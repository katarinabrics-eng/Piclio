'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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

interface SlideshowSettings {
  interval: number
  animation: 'fade' | 'slide' | 'none'
  output: 'slideshow' | 'download' | 'both'
}

interface Props {
  eventSlug: string
  initialEvent: SlideshowEvent
  initialPhotos: SlideshowPhoto[]
  initialSettings: SlideshowSettings
}

export function SlideshowClient({ eventSlug, initialEvent, initialPhotos, initialSettings }: Props) {
  const [photos, setPhotos] = useState<SlideshowPhoto[]>(initialPhotos)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const photosRef = useRef(photos)
  const currentRef = useRef(current)
  useEffect(() => { photosRef.current = photos }, [photos])
  useEffect(() => { currentRef.current = current }, [current])

  const intervalMs = (initialSettings.interval ?? 5) * 1000
  const animation = initialSettings.animation ?? 'fade'

  const supabase = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  ).current

  // Real-time: new photo assigned → refresh list
  useEffect(() => {
    const channel = supabase
      .channel(`slideshow-${eventSlug}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photo_guests' },
        async () => {
          const res = await fetch(`/api/slideshow/${eventSlug}`)
          const data = await res.json()
          if (data.photos?.length > 0) setPhotos(data.photos)
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [eventSlug, supabase])

  // Advance with animation
  const advance = useCallback((dir: 1 | -1 = 1) => {
    if (photosRef.current.length === 0) return
    if (animation === 'fade') {
      setVisible(false)
      setTimeout(() => {
        setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
        setVisible(true)
      }, 350)
    } else {
      setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
    }
  }, [animation])

  // Auto-advance
  useEffect(() => {
    if (!playing || photos.length <= 1) return
    const id = setInterval(() => advance(1), intervalMs)
    return () => clearInterval(id)
  }, [playing, photos.length, intervalMs, advance])

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        setPlaying(p => !p)
      }
      if (e.key === 'ArrowRight') advance(1)
      if (e.key === 'ArrowLeft') advance(-1)
      if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen()
      }
      if (e.key === 'Escape' && !document.fullscreenElement) window.history.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

  // Auto-hide controls on mouse inactivity
  function resetHideTimer() {
    setShowControls(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    resetHideTimer()
    return () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const photo = photos[current]

  return (
    <div
      style={{ height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}
      onMouseMove={resetHideTimer}
    >
      {/* Photo */}
      {photo && (
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.filename}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'contain', display: 'block',
            transition: animation === 'fade'
              ? 'opacity 0.35s ease'
              : animation === 'slide'
              ? 'transform 0.35s ease'
              : 'none',
            opacity: animation === 'fade' ? (visible ? 1 : 0) : 1,
          }}
        />
      )}

      {/* Empty state */}
      {photos.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(183,233,76,0.25)', fontSize: 16, letterSpacing: '0.1em',
        }}>
          Čeká se na fotky…
        </div>
      )}

      {/* Event name — top left */}
      <div style={{
        position: 'absolute', top: 16, left: 20,
        color: 'rgba(183,233,76,0.5)', fontSize: 12, fontWeight: 600,
        letterSpacing: '0.08em', pointerEvents: 'none',
        opacity: showControls ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        {initialEvent.name}
      </div>

      {/* Keyboard hint — top right */}
      <div style={{
        position: 'absolute', top: 16, right: 20,
        fontSize: 11, color: 'rgba(255,255,255,0.2)',
        pointerEvents: 'none',
        opacity: showControls ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        Space · ← → · F · ESC
      </div>

      {/* Controls bar — bottom center */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: '8px 18px',
        opacity: showControls ? 1 : 0, transition: 'opacity 0.4s',
        pointerEvents: showControls ? 'auto' : 'none',
      }}>
        <button onClick={() => advance(-1)} style={ctrlBtn} title="Předchozí (←)">‹</button>
        <button onClick={() => setPlaying(p => !p)} style={ctrlBtn} title="Přehrát/Pauza (Space)">
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => advance(1)} style={ctrlBtn} title="Další (→)">›</button>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 4px', userSelect: 'none' }}>
          {photos.length > 0 ? `${current + 1} / ${photos.length}` : '0'}
        </span>
        <button
          onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}
          style={ctrlBtn}
          title="Fullscreen (F)"
        >
          ⛶
        </button>
      </div>

      {/* Piclio logo — bottom right */}
      <div style={{
        position: 'absolute', bottom: 18, right: 20,
        opacity: 0.3, pointerEvents: 'none', userSelect: 'none',
      }}>
        <span style={{ color: '#b7e94c', fontWeight: 800, fontSize: 12, letterSpacing: '0.15em' }}>
          PICLIO
        </span>
      </div>
    </div>
  )
}

const ctrlBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: '#fff',
  cursor: 'pointer', fontSize: 20, padding: '2px 6px',
  lineHeight: 1, borderRadius: 6,
  transition: 'background 0.15s',
}
