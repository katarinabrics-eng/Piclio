import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: { eventSlug: string } }) {
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, location, status, max_guests, client_name, client_logo_url, brand_color')
    .eq('slug', params.eventSlug)
    .single()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const [
    { data: guests },
    { count: photoCount },
    { count: unmatchedCount },
    { count: deliveredCount },
  ] = await Promise.all([
    supabaseAdmin
      .from('guests')
      .select('id, email, name, badge_number, photo_count, email_sent_at, registered_at')
      .eq('event_id', event.id)
      .order('badge_number', { ascending: true }),
    supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id),
    supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id).eq('status', 'unmatched'),
    supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('event_id', event.id).not('email_sent_at', 'is', null),
  ])

  const { data: unmatchedPhotos } = await supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, uploaded_at, ocr_number, status')
    .eq('event_id', event.id)
    .eq('status', 'unmatched')
    .order('uploaded_at', { ascending: false })
    .limit(20)

  const paths = (unmatchedPhotos ?? []).map(p => p.storage_path)
  let unmatchedWithUrls: any[] = []
  if (paths.length > 0) {
    const { data: signedUrls } = await supabaseAdmin.storage
      .from('photos')
      .createSignedUrls(paths, 3600)
    unmatchedWithUrls = (unmatchedPhotos ?? []).map((p, i) => ({
      ...p,
      url: signedUrls?.[i]?.signedUrl ?? '',
    }))
  }

  return NextResponse.json({
    event,
    guests: guests ?? [],
    stats: {
      guestCount: guests?.length ?? 0,
      photoCount: photoCount ?? 0,
      unmatchedCount: unmatchedCount ?? 0,
      deliveredCount: deliveredCount ?? 0,
    },
    unmatchedPhotos: unmatchedWithUrls,
  })
}
