'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface SlideshowPhoto {
  id: string
  url: string
  filename: string
  uploaded_at: string
}

interface SlideshowEvent {
  id: string
  name: string
}

interface Props {
  eventSlug: string
  initialEvent: SlideshowEvent
  initialPhotos: SlideshowPhoto[]
}

export function SlideshowClient({ eventSlug, initialEvent, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<SlideshowPhoto[]>(initialPhotos)
  const [newPhotoIds, setNewPhotoIds] = useState<Set<string>>(new Set())
  const photosRef = useRef(photos)

  useEffect(() => { photosRef.current = photos }, [photos])

  const supabase = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  ).current

  useEffect(() => {
    const channel = supabase
      .channel(`slideshow-${eventSlug}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photo_guests' },
        async () => {
          const res = await fetch(`/api/slideshow/${eventSlug}`)
          const data = await res.json()
          if (!data.photos) return

          const fresh = data.photos as SlideshowPhoto[]
          const currentIds = new Set(photosRef.current.map(p => p.id))
          const addedIds = new Set(fresh.filter(p => !currentIds.has(p.id)).map(p => p.id))
          setPhotos(fresh)
          if (addedIds.size > 0) {
            setNewPhotoIds(addedIds)
            setTimeout(() => setNewPhotoIds(new Set()), 1500)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [eventSlug, supabase])

  return (
    <div style={{
      height: '100vh',
      background: '#0a0812',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: '13px 24px',
        flexShrink: 0,
      }}>
        <span style={{ color: '#b7e94c', fontWeight: 800, fontSize: 17, letterSpacing: '0.15em' }}>
          PICLIO
        </span>
        <span style={{ color: 'rgba(183,233,76,0.3)', fontSize: 18, lineHeight: 1 }}>·</span>
        <span style={{ color: '#b7e94c', fontSize: 14, fontWeight: 500, opacity: 0.8, letterSpacing: '0.05em' }}>
          {initialEvent.name}
        </span>
      </div>

      {/* Photos */}
      {photos.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(183,233,76,0.2)', fontSize: 16, letterSpacing: '0.1em' }}>
          Čaká sa na prvé fotky…
        </div>
      ) : (
        <div style={{ columns: 4, gap: '4px', padding: '0 4px 4px', overflowY: 'auto', flex: 1 }}>
          {photos.map(photo => (
            <div key={photo.id} style={{ breakInside: 'avoid', animation: newPhotoIds.has(photo.id) ? 'slideFadeIn 0.7s ease forwards' : 'none' }}>
              <img
                src={photo.url}
                alt={photo.filename}
                style={{ width: '100%', display: 'block', marginBottom: 4, objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
