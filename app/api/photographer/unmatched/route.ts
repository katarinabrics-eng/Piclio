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
  const rawUrl = req.nextUrl.toString()
  console.log('[unmatched] rawUrl:', rawUrl, '| eventId raw:', JSON.stringify(eventId))

  let query = supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, original_path, uploaded_at, ocr_number, event_id, status')
    .eq('status', 'unmatched')

  if (eventId) query = query.eq('event_id', eventId)

  const { data: photos, error } = await query.order('uploaded_at', { ascending: false })

  console.log('[unmatched] eventId:', eventId, '| count:', photos?.length ?? 0, '| error:', error?.message ?? null)

  if (error) {
    console.error('unmatched query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!photos || photos.length === 0) return NextResponse.json({ photos: [] })

  console.log('unmatched paths to sign:', photos.map(p => p.storage_path))

  const photosWithUrls = await signPhotosRobust(photos, 86400)

  return NextResponse.json({ photos: photosWithUrls })
}
