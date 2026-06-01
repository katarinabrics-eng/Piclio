import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { signPhotosRobust } from '@/lib/supabase/signPhotosRobust'
import { GalleryClient } from './GalleryClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: { token: string }
}

export default async function GalleryPage({ params }: Props) {
  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('id, email, name, badge_number, gallery_token, photo_count, event_id, email_sent_at, registered_at')
    .eq('gallery_token', params.token)
    .single()

  if (!guest) notFound()

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, location, status, max_guests, client_name, client_email, client_logo_url, brand_color, overlay_portrait_url, overlay_landscape_url, overlay_status, overlay_approved_by, overlay_notes, overlay_approved, overlay_mode, event_type, gallery_public, slideshow_pin, slideshow_playlist, public_gallery, slideshow_content, slideshow_selected_guests, slideshow_output, slideshow_interval, slideshow_animation, slideshow_layout')
    .eq('id', guest.event_id)
    .single()

  if (!event) notFound()

  const { data: photoGuests } = await supabaseAdmin
    .from('photo_guests')
    .select('photo_id')
    .eq('guest_id', guest.id)

  const photoIds = (photoGuests ?? []).map((pg: { photo_id: string }) => pg.photo_id)

  const { data: photosData } = photoIds.length > 0
    ? await supabaseAdmin
        .from('photos')
        .select('id, filename, storage_path, original_path, taken_at, uploaded_at')
        .in('id', photoIds)
        .neq('is_deleted', true)
    : { data: [] }

  const photos = photosData ?? []
  const photosWithUrls = photos.length > 0
    ? await signPhotosRobust(photos, 172800)
    : []

  const initialPhotos = photosWithUrls.map((p: any) => ({
    id: p.id,
    url: p.url,
    filename: p.filename,
    taken_at: p.taken_at,
    uploaded_at: p.uploaded_at,
  }))

  return (
    <GalleryClient
      token={params.token}
      initialGuest={guest}
      initialEvent={event}
      initialPhotos={initialPhotos}
    />
  )
}
