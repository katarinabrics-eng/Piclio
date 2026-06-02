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
  slideshow_welcome_text?: string | null
  event_category?: string | null
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
  const [showIntro, setShowIntro] = useState(true)
  const [introDismissed, setIntroDismissed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [slideshowContent, setSlideshowContent] = useState<'all' | 'selected' | 'by-guest'>('all')
  const [slideshowOrder, setSlideshowOrder] = useState<'random' | 'newest' | 'oldest'>('random')
  const [slideshowEffect, setSlideshowEffect] = useState<'fade' | 'slide' | 'kenburns' | 'none'>('fade')
  const [slideshowInterval, setSlideshowInterval] = useState(5)
  const [slideshowLayout, setSlideshowLayout] = useState<'single' | 'grid' | 'alternating'>('single')
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

  useEffect(() => {
    if (introDismissed) return
    const t = setTimeout(() => setShowIntro(false), 5000)
    return () => clearTimeout(t)
  }, [introDismissed])

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

      {/* Uvítací obrazovka */}
      {showIntro && !showSettings && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#000',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '28px 20px',
        }}>
          <div style={{ position: 'absolute', top: 16, left: 20, color: '#b7e94c', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', opacity: 0.7 }}>PICLIO</div>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {initialEvent.event_category && (
              <div style={{ display: 'inline-block', background: 'rgba(183,233,76,0.12)', border: '1px solid rgba(183,233,76,0.25)', borderRadius: 20, padding: '3px 12px', fontSize: 10, color: '#b7e94c', letterSpacing: '0.12em', marginBottom: 12 }}>
                {initialEvent.event_category.toUpperCase()}
              </div>
            )}
            <div style={{ fontSize: 32, fontWeight: 500, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>{initialEvent.name}</div>
            {initialEvent.slideshow_welcome_text && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{initialEvent.slideshow_welcome_text}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => setShowSettings(true)}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '14px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
            >
              Nastavení
            </button>
            <button
              onClick={() => { setShowIntro(false); setIntroDismissed(true); setPlaying(true) }}
              style={{ background: '#b7e94c', color: '#1a1225', border: 'none', borderRadius: 8, padding: '14px 40px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Spustit slideshow
            </button>
          </div>

          <div style={{ position: 'absolute', bottom: 14, right: 18, color: 'rgba(183,233,76,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em' }}>PICLIO</div>
        </div>
      )}

      {/* Nastavení obrazovka */}
      {showIntro && showSettings && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#000',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '28px 20px',
        }}>
          <div style={{ position: 'absolute', top: 16, left: 20, color: '#b7e94c', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', opacity: 0.7 }}>PICLIO</div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: '#fff', lineHeight: 1.2, marginBottom: 6 }}>{initialEvent.name}</div>
          </div>

          <div style={{ display: 'flex', gap: 14, width: '100%', maxWidth: 660, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: '#b7e94c', letterSpacing: '0.12em', marginBottom: 14, fontWeight: 700 }}>NASTAVENÍ</div>

              {/* Obsah */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Obsah</div>
                {(['all', 'selected', 'by-guest'] as const).map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 4 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: slideshowContent === opt ? '#b7e94c' : 'transparent', border: slideshowContent === opt ? 'none' : '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} onClick={() => setSlideshowContent(opt)} />
                    <span style={{ fontSize: 11, color: slideshowContent === opt ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                      {opt === 'all' ? 'Všechny fotky' : opt === 'selected' ? 'Výběr fotek' : 'Dle galerie hosta'}
                    </span>
                  </label>
                ))}
              </div>

              {/* Pořadí */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Pořadí</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                  {(['random', 'newest', 'oldest'] as const).map(opt => (
                    <div key={opt} onClick={() => setSlideshowOrder(opt)}
                      style={{ background: slideshowOrder === opt ? '#b7e94c' : 'rgba(255,255,255,0.08)', color: slideshowOrder === opt ? '#1a1225' : 'rgba(255,255,255,0.5)', borderRadius: 5, padding: '3px 9px', fontSize: 10, fontWeight: slideshowOrder === opt ? 700 : 400, cursor: 'pointer' }}>
                      {opt === 'random' ? 'Náhodné' : opt === 'newest' ? 'Nejnovější' : 'Nejstarší'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Efekt */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Efekt přechodu</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                  {(['fade', 'slide', 'kenburns', 'none'] as const).map(opt => (
                    <div key={opt} onClick={() => setSlideshowEffect(opt)}
                      style={{ background: slideshowEffect === opt ? '#b7e94c' : 'rgba(255,255,255,0.08)', color: slideshowEffect === opt ? '#1a1225' : 'rgba(255,255,255,0.5)', borderRadius: 5, padding: '3px 9px', fontSize: 10, fontWeight: slideshowEffect === opt ? 700 : 400, cursor: 'pointer' }}>
                      {opt === 'fade' ? 'Fade' : opt === 'slide' ? 'Slide' : opt === 'kenburns' ? 'Ken Burns' : 'Bez efektu'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interval */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Interval</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                  {[3, 4, 5, 7, 10].map(s => (
                    <div key={s} onClick={() => setSlideshowInterval(s)}
                      style={{ background: slideshowInterval === s ? '#b7e94c' : 'rgba(255,255,255,0.08)', color: slideshowInterval === s ? '#1a1225' : 'rgba(255,255,255,0.5)', borderRadius: 5, padding: '3px 9px', fontSize: 10, fontWeight: slideshowInterval === s ? 700 : 400, cursor: 'pointer' }}>
                      {s} s
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Layout</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {([
                    { key: 'single', label: 'Jedna fotka', preview: 'single' },
                    { key: 'grid', label: 'Mozaika', preview: 'grid' },
                    { key: 'alternating', label: 'Střídání', preview: 'alternating' },
                  ] as const).map(opt => (
                    <div key={opt.key} onClick={() => setSlideshowLayout(opt.key)}
                      style={{ background: slideshowLayout === opt.key ? 'rgba(183,233,76,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${slideshowLayout === opt.key ? '#b7e94c' : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, padding: 7, cursor: 'pointer', textAlign: 'center' as const }}>
                      {opt.preview === 'single' && <div style={{ width: '100%', height: 22, background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 4 }} />}
                      {opt.preview === 'grid' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 22, marginBottom: 4 }}><div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /><div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /><div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /><div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /></div>}
                      {opt.preview === 'alternating' && <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 2, height: 22, marginBottom: 4 }}><div style={{ height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /><div style={{ display: 'flex', gap: 2, flex: 1 }}><div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} /></div></div>}
                      <div style={{ fontSize: 9, color: slideshowLayout === opt.key ? '#b7e94c' : 'rgba(255,255,255,0.4)' }}>{opt.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, minWidth: 130 }}>
              <button onClick={() => { setShowIntro(false); setIntroDismissed(true); setPlaying(true) }}
                style={{ background: '#b7e94c', color: '#1a1225', border: 'none', borderRadius: 8, padding: '13px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                ▶ Spustit
              </button>
              <button onClick={() => setShowSettings(false)}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '10px 16px', fontSize: 12, cursor: 'pointer', width: '100%', marginTop: 8 }}>
                ← Zpět
              </button>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textAlign: 'center' as const }}>NÁHLED</div>
                <div style={{ width: '100%', height: 70, background: 'rgba(255,255,255,0.06)', borderRadius: 4, position: 'relative' as const, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {slideshowLayout === 'single' && <div style={{ width: '70%', height: '80%', background: 'rgba(255,255,255,0.12)', borderRadius: 3 }} />}
                    {slideshowLayout === 'grid' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: '85%', height: '85%' }}><div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /><div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /><div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /><div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /></div>}
                    {slideshowLayout === 'alternating' && <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 3, width: '85%', height: '85%' }}><div style={{ height: '55%', background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /><div style={{ display: 'flex', gap: 3, flex: 1 }}><div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /><div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} /></div></div>}
                  </div>
                </div>
                <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                  <span>{slideshowEffect} · {slideshowInterval}s</span>
                  <span>{slideshowOrder === 'random' ? 'Náhodné' : slideshowOrder === 'newest' ? 'Nejnovější' : 'Nejstarší'}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 14, right: 18, color: 'rgba(183,233,76,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em' }}>PICLIO</div>
        </div>
      )}

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
