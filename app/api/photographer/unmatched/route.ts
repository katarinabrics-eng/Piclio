import { NextRequest, NextResponse } from 'next/server'
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
  const { data: photos, error } = await supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, original_path, uploaded_at, ocr_number, event_id, status')
    .eq('event_id', eventId)
    .neq('is_deleted', true)
    .order('uploaded_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!photos || photos.length === 0) return NextResponse.json({ photos: [] })

  const validPhotos = photos.filter(p => p.storage_path && p.storage_path.trim() !== '')
  const { data: deleted } = await supabaseAdmin.from('deleted_photos').select('storage_path')
  const deletedPaths = new Set((deleted ?? []).map((d: any) => d.storage_path))
  const filtered = validPhotos.filter(p => !deletedPaths.has(p.storage_path))

  if (filtered.length === 0) return NextResponse.json({ photos: [] })

  const photosWithUrls = await signPhotosRobust(filtered, 86400)

  return NextResponse.json(
    { photos: photosWithUrls },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  )
}
