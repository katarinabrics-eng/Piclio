import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { eventSlug: string } }) {
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, location, brand_color')
    .eq('slug', params.eventSlug)
    .single()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const { data: photos } = await supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, uploaded_at, taken_at')
    .eq('event_id', event.id)
    .eq('status', 'matched')
    .order('uploaded_at', { ascending: false })
    .limit(20)

  if (!photos || photos.length === 0) {
    return NextResponse.json({ event, photos: [] })
  }

  const paths = photos.map(p => p.storage_path)
  const { data: signedUrls } = await supabaseAdmin.storage
    .from('photos')
    .createSignedUrls(paths, 172800) // 48h

  const urlMap = Object.fromEntries(
    (signedUrls ?? []).map(s => [s.path, s.signedUrl])
  )

  const photosWithUrls = photos.map(p => ({
    id: p.id,
    url: urlMap[p.storage_path] ?? '',
    filename: p.filename,
    uploaded_at: p.uploaded_at,
  }))

  return NextResponse.json({ event, photos: photosWithUrls })
}
