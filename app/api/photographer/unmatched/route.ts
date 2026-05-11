import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const eventId = req.nextUrl.searchParams.get('eventId')

  let query = supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, uploaded_at, ocr_number, event_id, status')
    .eq('status', 'unmatched')
    .order('uploaded_at', { ascending: false })

  if (eventId) query = query.eq('event_id', eventId)

  const { data: photos, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!photos || photos.length === 0) return NextResponse.json({ photos: [] })

  const paths = photos.map(p => p.storage_path)
  const { data: signedUrls } = await supabaseAdmin.storage
    .from('photos')
    .createSignedUrls(paths, 3600) // 1h

  const photosWithUrls = photos.map((p, i) => ({
    ...p,
    url: signedUrls?.[i]?.signedUrl ?? '',
  }))

  return NextResponse.json({ photos: photosWithUrls })
}
