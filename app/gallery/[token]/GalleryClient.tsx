'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { GalleryPhoto, Guest, PiclioEvent } from '@/lib/types'
import { PhotoGrid } from '@/components/piclio/PhotoGrid'
import { PhotoLightbox } from '@/components/piclio/PhotoLightbox'

interface Props {
  token: string
  initialGuest: Guest
  initialEvent: PiclioEvent
  initialPhotos: GalleryPhoto[]
}

export function GalleryClient({ token, initialGuest, initialEvent, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos)
  const [newPhotoIds, setNewPhotoIds] = useState<Set<string>>(new Set())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
  const supabase = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  ).current

  useEffect(() => {
    const channel = supabase
      .channel(`gallery-${token}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photo_guests' },
        async () => {
          const res = await fetch(`/api/gallery/${token}`)
          const data = await res.json()
          if (data.photos) {
            const currentIds = new Set(photos.map(p => p.id))
            const fresh = data.photos as GalleryPhoto[]
            const addedIds = new Set(fresh.filter(p => !currentIds.has(p.id)).map(p => p.id))
            setPhotos(fresh)
            if (addedIds.size > 0) {
              setNewPhotoIds(addedIds)
              setTimeout(() => setNewPhotoIds(new Set()), 2000)
            }
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [token, photos, supabase])

  async function downloadAll() {
    setDownloading(true)
    try {
      for (const photo of photos) {
        const res = await fetch(photo.url)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = photo.filename
        a.click()
        URL.revokeObjectURL(url)
        await new Promise(r => setTimeout(r, 300))
      }
    } finally {
      setDownloading(false)
    }
  }

  const brandColor = initialEvent.brand_color ?? '#111827'

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: brandColor, color: '#fff', padding: '24px 20px 20px' }}>
        {initialEvent.client_logo_url && (
          <img
            src={initialEvent.client_logo_url}
            alt={initialEvent.client_name ?? ''}
            style={{ height: 40, marginBottom: 12, objectFit: 'contain' }}
          />
        )}
        <div style={{ fontSize: 20, fontWeight: 700 }}>{initialEvent.name}</div>
        <div style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>
          {initialGuest.name ? `Ahoj, ${initialGuest.name}` : 'Vaše galerie'} · {photos.length} {photos.length === 1 ? 'fotka' : photos.length < 5 ? 'fotky' : 'fotek'}
        </div>
      </div>

      {/* Actions */}
      {photos.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={downloadAll}
            disabled={downloading}
            style={{
              background: brandColor, color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 18px', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, opacity: downloading ? 0.6 : 1,
            }}
          >
            {downloading ? 'Stahuji…' : 'Stáhnout vše'}
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: '8px 12px 40px' }}>
        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: 48 }}>📷</div>
            <div style={{ marginTop: 12, fontSize: 16 }}>Zatím žádné fotky</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Fotky se objeví automaticky po přiřazení</div>
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            onPhotoClick={setLightboxIndex}
            newPhotoIds={newPhotoIds}
          />
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex(i => Math.min(photos.length - 1, (i ?? 0) + 1))}
        />
      )}
    </div>
  )
}
