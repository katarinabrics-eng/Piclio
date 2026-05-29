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
  layout: 'single' | 'slide' | 'kenburns' | 'grid'
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
  useEffect(() => { photosRef.current = photos }, [photos])

  const intervalMs = (initialSettings.interval ?? 5) * 1000
  const animation = initialSettings.animation ?? 'fade'
  const layout = initialSettings.layout ?? 'single'

  const supabase = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  ).current

  useEffect(() => {
    const channel = supabase
      .channel(`slideshow-${eventSlug}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photo_guests' }, async () => {
        const res = await fetch(`/api/slideshow/${eventSlug}`)
        const data = await res.json()
        if (data.photos?.length > 0) setPhotos(data.photos)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [eventSlug, supabase])

  const advance = useCallback((dir: 1 | -1 = 1) => {
    if (photosRef.current.length === 0) return
    if (animation === 'fade' || layout === 'kenburns') {
      setVisible(false)
      setTimeout(() => {
        setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
        setVisible(true)
      }, 350)
    } else {
      setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
    }
  }, [animation, layout])

  useEffect(() => {
    if (!playing || photos.length <= 1) return
    const id = setInterval(() => advance(1), intervalMs)
    return () => clearInterval(id)
  }, [playing, photos.length, intervalMs, advance])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); setPlaying(p => !p) }
      if (e.key === 'ArrowRight') advance(1)
      if (e.key === 'ArrowLeft') advance(-1)
      if (e.key === 'f' || e.key === 'F') {
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
      }
      if (e.key === 'Escape' && !document.fullscreenElement) window.history.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

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
  const n = photos.length

  // ── Slide transition helpers ──────────────────────────────────────────────
  const slideTransition = animation === 'slide' ? 'transform 0.4s ease' : 'none'

  // ── Render layout ─────────────────────────────────────────────────────────
  function renderPhoto() {
    if (!photo) return null

    // Ken Burns layout — same as single but always with KB animation
    if (layout === 'kenburns') {
      return (
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.filename}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.35s ease',
            animation: 'kenburns 8s ease-in-out infinite alternate',
          }}
        />
      )
    }

    // Slide layout — outgoing exits left, incoming enters from right
    if (layout === 'slide') {
      return (
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.filename}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', display: 'block',
            animation: 'slideInFromRight 0.45s ease forwards',
          }}
        />
      )
    }

    // Grid layout — 3 photos simultaneously
    if (layout === 'grid' && n >= 1) {
      const p0 = photos[current % n]
      const p1 = photos[(current + 1) % n]
      const p2 = photos[(current + 2) % n]
      return (
        <div
          key={current}
          style={{
            position: 'absolute', inset: 0, display: 'flex', gap: 3,
            opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
          }}
        >
          <div style={{ flex: 2, overflow: 'hidden' }}>
            <img src={p0.url} alt={p0.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img src={p1.url} alt={p1.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <img src={p2.url} alt={p2.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      )
    }

    // Single (default)
    return (
      <img
        key={photo.id}
        src={photo.url}
        alt={photo.filename}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', display: 'block',
          transition: animation === 'fade' ? 'opacity 0.35s ease' : slideTransition,
          opacity: animation === 'fade' ? (visible ? 1 : 0) : 1,
          transform: animation === 'slide' ? (visible ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        }}
      />
    )
  }

  return (
    <div
      style={{ height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}
      onMouseMove={resetHideTimer}
    >
      <style>{`
        @keyframes kenburns {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.12) translate(-2%, -1%); }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      {photos.length === 0 ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(183,233,76,0.25)', fontSize: 16, letterSpacing: '0.1em' }}>
          Čeká se na fotky…
        </div>
      ) : renderPhoto()}

      {/* Event name */}
      <div style={{ position: 'absolute', top: 16, left: 20, color: 'rgba(183,233,76,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', pointerEvents: 'none', opacity: showControls ? 1 : 0, transition: 'opacity 0.4s' }}>
        {initialEvent.name}
      </div>

      {/* Keyboard hint */}
      <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)', pointerEvents: 'none', opacity: showControls ? 1 : 0, transition: 'opacity 0.4s' }}>
        Space · ← → · F · ESC
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: '8px 18px',
        opacity: showControls ? 1 : 0, transition: 'opacity 0.4s',
        pointerEvents: showControls ? 'auto' : 'none',
      }}>
        <button onClick={() => advance(-1)} style={ctrlBtn}>‹</button>
        <button onClick={() => setPlaying(p => !p)} style={ctrlBtn}>{playing ? '⏸' : '▶'}</button>
        <button onClick={() => advance(1)} style={ctrlBtn}>›</button>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '0 4px', userSelect: 'none' }}>
          {n > 0 ? `${current + 1} / ${n}` : '0'}
        </span>
        <button
          onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}
          style={ctrlBtn} title="Fullscreen (F)"
        >⛶</button>
      </div>

      {/* Piclio logo */}
      <div style={{ position: 'absolute', bottom: 18, right: 20, opacity: 0.3, pointerEvents: 'none', userSelect: 'none' }}>
        <span style={{ color: '#b7e94c', fontWeight: 800, fontSize: 12, letterSpacing: '0.15em' }}>PICLIO</span>
      </div>
    </div>
  )
}

const ctrlBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: '#fff',
  cursor: 'pointer', fontSize: 20, padding: '2px 6px',
  lineHeight: 1, borderRadius: 6,
}
