import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ClientDashboard } from './ClientDashboard'

interface Props {
  params: { eventSlug: string }
}

async function signPhotos(photos: any[], expiresIn: number): Promise<any[]> {
  if (photos.length === 0) return []
  const paths = photos.map(p => p.storage_path)
  const { data: signedUrls } = await supabaseAdmin.storage
    .from('photos')
    .createSignedUrls(paths, expiresIn)
  return photos.map((p, i) => ({
    ...p,
    url: signedUrls?.[i]?.signedUrl ?? '',
  }))
}

export default async function ClientDashboardPage({ params }: Props) {
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, location, status, max_guests, client_name, client_email, client_logo_url, brand_color, slideshow_pin, slideshow_playlist, public_gallery, overlay_approved, overlay_approved_by, overlay_notes, overlay_portrait_url, overlay_landscape_url, overlay_status, description')
    .eq('slug', params.eventSlug)
    .single()

  if (!event) notFound()

  const [
    { data: guests },
    { count: photoCount },
    { count: unmatchedCount },
    { count: deliveredCount },
  ] = await Promise.all([
    supabaseAdmin
      .from('guests')
      .select('id, event_id, email, name, badge_number, gallery_token, photo_count, email_sent_at, registered_at')
      .eq('event_id', event.id)
      .order('badge_number', { ascending: true }),
    supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id),
    supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id).eq('status', 'unmatched'),
    supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('event_id', event.id).not('email_sent_at', 'is', null),
  ])

  const guestList = guests ?? []
  const totalPhotos = photoCount ?? 0
  const guestCount = guestList.length
  const avgPhotosPerGuest = guestCount > 0 ? +(totalPhotos / guestCount).toFixed(1) : 0
  const galleryOpenedCount = guestList.filter((g: any) => g.email_sent_at).length

  const { data: allPhotos } = await supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, uploaded_at')
    .eq('event_id', event.id)
    .eq('status', 'matched')
    .order('uploaded_at', { ascending: false })
    .limit(100)

  const { data: unmatchedPhotos } = await supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, uploaded_at, ocr_number, status')
    .eq('event_id', event.id)
    .eq('status', 'unmatched')
    .order('uploaded_at', { ascending: false })
    .limit(20)

  const [unmatchedWithUrls, allPhotosWithUrls] = await Promise.all([
    signPhotos(unmatchedPhotos ?? [], 3600),
    signPhotos(allPhotos ?? [], 172800),
  ])

  const publicPhotoCount = totalPhotos - (unmatchedCount ?? 0)

  return (
    <ClientDashboard
      event={{
        ...event,
        slideshow_playlist: event.slideshow_playlist ?? [],
        public_gallery: event.public_gallery ?? false,
        overlay_approved: event.overlay_approved ?? false,
      }}
      guests={guestList}
      stats={{
        guestCount,
        photoCount: totalPhotos,
        unmatchedCount: unmatchedCount ?? 0,
        deliveredCount: deliveredCount ?? 0,
        avgPhotosPerGuest,
        galleryOpenedCount,
        publicPhotoCount,
      }}
      unmatchedPhotos={unmatchedWithUrls}
      allPhotos={allPhotosWithUrls}
      eventSlug={params.eventSlug}
    />
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
