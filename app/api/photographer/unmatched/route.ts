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

  const baseQuery = supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, original_path, uploaded_at, ocr_number, event_id, status')
    .eq('status', 'unmatched')
    .order('uploaded_at', { ascending: false })

  const { data: photos, error } = eventId
    ? await baseQuery.eq('event_id', eventId).neq('is_deleted', true)
    : await baseQuery.neq('is_deleted', true)

  console.log('[unmatched] eventId:', eventId, '| count:', photos?.length ?? 0, '| error:', error?.message ?? null)

  if (error) {
    console.error('unmatched query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!photos || photos.length === 0) return NextResponse.json({ photos: [] })

  // Filter out photos without a valid storage_path
  const validPhotos = photos.filter(p => p.storage_path && p.storage_path.trim() !== '')

  // Filter out permanently deleted photos
  const { data: deleted } = await supabaseAdmin.from('deleted_photos').select('storage_path')
  const deletedPaths = new Set((deleted ?? []).map((d: { storage_path: string }) => d.storage_path))
  const filtered = validPhotos.filter(p => !deletedPaths.has(p.storage_path))

  if (filtered.length === 0) return NextResponse.json({ photos: [] })

  console.log('unmatched paths to sign:', filtered.map(p => p.storage_path))

  const photosWithUrls = await signPhotosRobust(filtered, 86400)

  return NextResponse.json({ photos: photosWithUrls })
}
