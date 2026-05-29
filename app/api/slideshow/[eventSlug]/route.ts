import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { signPhotosRobust } from '@/lib/supabase/signPhotosRobust'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { eventSlug: string } }) {
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, brand_color, slideshow_content, slideshow_selected_guests, slideshow_interval, slideshow_animation, slideshow_output')
    .eq('slug', params.eventSlug)
    .single()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const content: string = event.slideshow_content ?? 'random'
  const selectedGuests: string[] = event.slideshow_selected_guests ?? []

  let photoIds: string[] = []

  if (
    content === 'selected_guests' ||
    ((content === 'photographer' || content === 'client') && selectedGuests.length > 0)
  ) {
    // Photos belonging to specific guests
    const { data: pg } = await supabaseAdmin
      .from('photo_guests')
      .select('photo_id')
      .in('guest_id', selectedGuests)
    photoIds = (pg ?? []).map(r => r.photo_id)
  } else {
    // All photo_guests for this event (random / fallback)
    const { data: guestRows } = await supabaseAdmin
      .from('guests')
      .select('id')
      .eq('event_id', event.id)
    const guestIds = (guestRows ?? []).map(g => g.id)

    if (guestIds.length > 0) {
      const { data: pg } = await supabaseAdmin
        .from('photo_guests')
        .select('photo_id')
        .in('guest_id', guestIds)
      photoIds = (pg ?? []).map(r => r.photo_id)
    }
  }

  if (photoIds.length === 0) {
    return NextResponse.json({
      event,
      photos: [],
      settings: {
        interval: event.slideshow_interval ?? 5,
        animation: event.slideshow_animation ?? 'fade',
        output: event.slideshow_output ?? 'slideshow',
      },
    })
  }

  // Deduplicate
  const uniquePhotoIds = [...new Set(photoIds)]

  const { data: photos } = await supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, original_path, uploaded_at')
    .in('id', uniquePhotoIds)

  if (!photos || photos.length === 0) {
    return NextResponse.json({
      event,
      photos: [],
      settings: {
        interval: event.slideshow_interval ?? 5,
        animation: event.slideshow_animation ?? 'fade',
        output: event.slideshow_output ?? 'slideshow',
      },
    })
  }

  // Shuffle for random content
  const ordered = content === 'random'
    ? [...photos].sort(() => Math.random() - 0.5)
    : photos

  const signed = await signPhotosRobust(ordered, 172800)

  const photosWithUrls = signed.map((p: any) => ({
    id: p.id,
    url: p.url,
    filename: p.filename,
    uploaded_at: p.uploaded_at,
  }))

  return NextResponse.json({
    event,
    photos: photosWithUrls,
    settings: {
      interval: event.slideshow_interval ?? 5,
      animation: event.slideshow_animation ?? 'fade',
      output: event.slideshow_output ?? 'slideshow',
    },
  })
}
