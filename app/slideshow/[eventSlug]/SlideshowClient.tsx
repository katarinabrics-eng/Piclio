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
  layout: 'single' | 'kenburns' | 'slide' | 'grid'
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
  const [animating, setAnimating] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const photosRef = useRef(photos)
  useEffect(() => { photosRef.current = photos }, [photos])

  const intervalMs = (initialSettings.interval ?? 5) * 1000

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

  useEffect(() => {
    fetch(`/api/slideshow/${eventSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.photos?.length > 0) setPhotos(data.photos)
      })
  }, [eventSlug])

  const advance = useCallback((dir: 1 | -1 = 1) => {
    if (photosRef.current.length === 0) return
    const anim = initialSettings.animation
    if (anim === 'fade') {
      setVisible(false)
      setTimeout(() => {
        setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
        setVisible(true)
      }, 350)
    } else if (anim === 'slide') {
      setAnimating(true)
      setTimeout(() => {
        setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
        setAnimating(false)
      }, 400)
    } else {
      setCurrent(i => (i + dir + photosRef.current.length) % photosRef.current.length)
    }
  }, [initialSettings.animation])

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

  const layout = initialSettings.layout
  const n = Math.max(photos.length, 1)
  const photo  = photos[current]
  const photo2 = photos[(current + 1) % n]
  const photo3 = photos[(current + 2) % n]

  function renderContent() {
    if (photos.length === 0) {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(183,233,76,0.25)', fontSize: 16, letterSpacing: '0.1em' }}>
          Čeká se na fotky…
        </div>
      )
    }

    if (layout === 'grid') {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 4, padding: 4 }}>
          <div style={{ flex: 1, overflow: 'hidden', borderRadius: 4 }}>
            <img src={photo?.url} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: initialSettings.animation === 'fade' ? (visible ? 1 : 0) : 1,
              transition: 'opacity 0.35s ease',
            }} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden', borderRadius: 4 }}>
            <img src={photo2?.url} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: initialSettings.animation === 'fade' ? (visible ? 1 : 0) : 1,
              transition: 'opacity 0.35s ease',
            }} />
          </div>
          <div style={{ flex: 2, overflow: 'hidden', borderRadius: 4 }}>
            <img src={photo3?.url} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: initialSettings.animation === 'fade' ? (visible ? 1 : 0) : 1,
              transition: 'opacity 0.35s ease',
            }} />
          </div>
        </div>
      )
    }

    // single / kenburns / slide layout
    return (
      <>
        <img
          key={photo?.id}
          src={photo?.url}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain',
            opacity: initialSettings.animation === 'fade' ? (visible ? 1 : 0) : 1,
            transition: initialSettings.animation === 'fade' ? 'opacity 0.35s ease' : 'none',
            animation: layout === 'kenburns' ? 'kenburns 8s ease-in-out infinite alternate' : 'none',
            transform: initialSettings.animation === 'slide' && animating ? 'translateX(-100%)' : 'translateX(0)',
          }}
        />
        {initialSettings.animation === 'slide' && animating && (
          <img
            key={(photo2?.id ?? '') + '-in'}
            src={photo2?.url}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain',
              animation: 'slideInRight 0.4s ease forwards',
            }}
          />
        )}
      </>
    )
  }

  return (
    <div
      style={{ height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}
      onMouseMove={resetHideTimer}
    >
      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1)    translate(0, 0); }
          100% { transform: scale(1.12) translate(-2%, -1%); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
      `}</style>

      {renderContent()}

      {/* Event name */}
      <div style={{
        position: 'absolute', top: 16, left: 20,
        color: 'rgba(183,233,76,0.5)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
        pointerEvents: 'none', opacity: showControls ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        {initialEvent.name}
      </div>

      {/* Keyboard hint */}
      <div style={{
        position: 'absolute', top: 16, right: 20,
        fontSize: 11, color: 'rgba(255,255,255,0.2)',
        pointerEvents: 'none', opacity: showControls ? 1 : 0, transition: 'opacity 0.4s',
      }}>
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
          {photos.length > 0 ? `${current + 1} / ${photos.length}` : '0'}
        </span>
        <button onClick={() => window.location.reload()} style={ctrlBtn} title="Reload nastavení">↺</button>
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
