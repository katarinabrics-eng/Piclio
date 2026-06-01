import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { signPhotosRobust } from '@/lib/supabase/signPhotosRobust'

export const dynamic = 'force-dynamic'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const eventId = req.nextUrl.searchParams.get('eventId')
  if (!eventId) return NextResponse.json({ photos: [] })

  // Galerie eventu = VŠECHNY fotky eventu (ne jen unmatched)
  // Používáme fresh klienta aby se předešlo stale singleton state
  const freshClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: photos, error } = await freshClient
    .from('photos')
    .select('id, filename, storage_path, original_path, uploaded_at, ocr_number, event_id, status')
    .eq('event_id', eventId)
    .neq('is_deleted', true)
    .order('uploaded_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!photos || photos.length === 0) return NextResponse.json({ photos: [] })

  // DEBUG: return raw data immediately to check what DB returns
  const luka7020 = photos.find(p => p.filename === 'LUKA7020.JPG')
  if (luka7020) console.log('LUKA7020 raw from DB:', luka7020.status)
  return NextResponse.json({ raw: photos.map(p => ({ f: p.filename, s: p.status })) })

  const validPhotos = photos.filter(p => p.storage_path && p.storage_path.trim() !== '')
  const { data: deleted } = await supabaseAdmin.from('deleted_photos').select('storage_path')
  const deletedPaths = new Set((deleted ?? []).map((d: any) => d.storage_path))
  const filtered = validPhotos.filter(p => !deletedPaths.has(p.storage_path))

  if (filtered.length === 0) return NextResponse.json({ photos: [] })

  // Zachovaj status mapu pred signPhotosRobust (status môže byť stratený)
  const statusMap = new Map(filtered.map(p => [p.id, p.status]))

  const photosWithUrls = await signPhotosRobust(filtered, 86400)

  // Explicitne nastav status z pôvodného DB query
  const result = photosWithUrls.map((p: any) => ({
    ...p,
    status: statusMap.get(p.id) ?? p.status,
  }))

  return NextResponse.json(
    { photos: result },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  )
}
