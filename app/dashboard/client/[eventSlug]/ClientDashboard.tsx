'use client'

import { useState, useRef, useEffect } from 'react'
import type { PiclioEvent, Guest, UnmatchedPhoto, PlaylistPhoto } from '@/lib/types'
import { StatCard } from '@/components/piclio/StatCard'

interface Stats {
  guestCount: number
  photoCount: number
  unmatchedCount: number
  deliveredCount: number
  avgPhotosPerGuest: number
  galleryOpenedCount: number
  publicPhotoCount: number
}

interface Props {
  event: PiclioEvent
  guests: Guest[]
  stats: Stats
  unmatchedPhotos: UnmatchedPhoto[]
  allPhotos: PlaylistPhoto[]
  eventSlug: string
}

type Tab = 'overview' | 'guests' | 'unmatched' | 'branding' | 'projekcia' | 'gallery_public'

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://piclio.vercel.app'

export function ClientDashboard({ event, guests, stats, unmatchedPhotos, allPhotos, eventSlug }: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  // ── Live state (SSR-initialised, refreshed by polling) ─────────────────────
  const [liveStats, setLiveStats] = useState(stats)
  const [liveGuests, setLiveGuests] = useState(guests)
  const [liveUnmatched, setLiveUnmatched] = useState(unmatchedPhotos)
  const [liveAllPhotos, setLiveAllPhotos] = useState(allPhotos)

  // Poll stats + guests every 15s (always active)
  useEffect(() => {
    const tick = () =>
      fetch(`/api/client/${eventSlug}/live?include=stats,guests`)
        .then(r => r.json())
        .then(d => {
          if (d.stats) setLiveStats(d.stats)
          if (d.guests) setLiveGuests(d.guests)
        })
        .catch(() => {})
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [eventSlug])

  // Poll unmatched photos every 15s when that tab is active
  useEffect(() => {
    if (tab !== 'unmatched') return
    const tick = () =>
      fetch(`/api/client/${eventSlug}/live?include=unmatched`)
        .then(r => r.json())
        .then(d => { if (d.unmatchedPhotos) setLiveUnmatched(d.unmatchedPhotos) })
        .catch(() => {})
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [eventSlug, tab])

  // Poll allPhotos every 15s when projekcia or gallery_public tab is active
  useEffect(() => {
    if (tab !== 'projekcia' && tab !== 'gallery_public') return
    const tick = () =>
      fetch(`/api/client/${eventSlug}/live?include=photos`)
        .then(r => r.json())
        .then(d => { if (d.allPhotos) setLiveAllPhotos(d.allPhotos) })
        .catch(() => {})
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [eventSlug, tab])
  const [brandColor, setBrandColor] = useState(event.brand_color ?? '#1a1225')
  const [logoUrl, setLogoUrl] = useState(event.client_logo_url ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [savingBranding, setSavingBranding] = useState(false)
  const [brandingMsg, setBrandingMsg] = useState('')

  const [description, setDescription] = useState((event as any).description ?? '')
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoMsg, setInfoMsg] = useState('')

  const [overlayApproved, setOverlayApproved] = useState(event.overlay_approved ?? false)
  const [overlayNotes, setOverlayNotes] = useState(event.overlay_notes ?? '')
  const [savingOverlay, setSavingOverlay] = useState(false)
  const [overlayMsg, setOverlayMsg] = useState('')
  const [overlayFullscreen, setOverlayFullscreen] = useState<'portrait' | 'landscape' | null>(null)

  const [playlist, setPlaylist] = useState<Set<string>>(
    new Set(Array.isArray(event.slideshow_playlist) ? event.slideshow_playlist : [])
  )
  const [savingPlaylist, setSavingPlaylist] = useState(false)
  const [playlistMsg, setPlaylistMsg] = useState('')

  const [publicGallery, setPublicGallery] = useState(event.public_gallery ?? false)
  const [savingPublic, setSavingPublic] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const accent = brandColor

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function saveInfo() {
    setSavingInfo(true)
    setInfoMsg('')
    try {
      const res = await fetch(`/api/client/${eventSlug}/branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setInfoMsg('✓ Uloženo')
    } catch (e: any) {
      setInfoMsg(`✗ ${e.message}`)
    } finally {
      setSavingInfo(false)
    }
  }

  async function saveBranding() {
    setSavingBranding(true)
    setBrandingMsg('')
    try {
      const form = new FormData()
      form.append('brand_color', brandColor)
      if (logoFile) {
        form.append('logo', logoFile)
      } else {
        form.append('client_logo_url', logoUrl)
      }
      const res = await fetch(`/api/client/${eventSlug}/branding`, { method: 'PUT', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      if (json.client_logo_url) setLogoUrl(json.client_logo_url)
      if (json.brand_color) setBrandColor(json.brand_color)
      console.log('BEFORE RELOAD — brand_color from response:', json.brand_color)
      console.log('BEFORE RELOAD — current brandColor state:', brandColor)
      setBrandingMsg('✓ Branding uložen')
      window.location.reload()
    } catch (e: any) {
      setBrandingMsg(`✗ Chyba: ${e.message}`)
    } finally {
      setSavingBranding(false)
    }
  }

  async function saveOverlay(approved: boolean) {
    setSavingOverlay(true)
    setOverlayMsg('')
    try {
      const res = await fetch(`/api/client/${eventSlug}/approve-overlay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, notes: overlayNotes }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setOverlayApproved(approved)
      setOverlayMsg(approved ? '✓ Overlay schválen' : '✓ Žádost o změnu odeslána')
    } catch (e: any) {
      setOverlayMsg(`✗ Chyba: ${e.message}`)
    } finally {
      setSavingOverlay(false)
    }
  }

  async function savePlaylist() {
    setSavingPlaylist(true)
    setPlaylistMsg('')
    try {
      const res = await fetch(`/api/client/${eventSlug}/playlist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlist: Array.from(playlist) }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setPlaylistMsg(`✓ Playlist uložen (${playlist.size} fotek)`)
    } catch (e: any) {
      setPlaylistMsg(`✗ Chyba: ${e.message}`)
    } finally {
      setSavingPlaylist(false)
    }
  }

  async function togglePublicGallery(val: boolean) {
    setSavingPublic(true)
    setPublicGallery(val)
    await fetch(`/api/client/${eventSlug}/branding`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_gallery: val }),
    })
    setSavingPublic(false)
  }

  function togglePhoto(id: string) {
    setPlaylist(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() { setPlaylist(new Set(liveAllPhotos.map(p => p.id))) }
  function selectNone() { setPlaylist(new Set()) }

  // ── Tabs config ────────────────────────────────────────────────────────────

  const TABS: [Tab, string][] = [
    ['overview',       'Přehled'],
    ['guests',         `Hosté (${liveStats.guestCount})`],
    ['unmatched',      `Nespárované (${liveStats.unmatchedCount})`],
    ['branding',       'Branding'],
    ['projekcia',      'Projekce'],
    ['gallery_public', 'Veřejná galerie'],
  ]

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Header */}
      <div style={{ background: accent, color: '#fff', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {logoUrl && (
            <img src={logoUrl} alt="" style={{ height: 36, objectFit: 'contain', borderRadius: 4 }} />
          )}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{event.name}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>
              {new Date(event.date).toLocaleDateString('cs-CZ')}
              {event.location ? ` · ${event.location}` : ''}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 20px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: tab === key ? accent : '#e5e7eb',
              color: tab === key ? '#fff' : '#374151',
              transition: 'all 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── PŘEHLED ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard label="Registrovaní hosté" value={liveStats.guestCount} />
              <StatCard label="Fotky celkem" value={liveStats.photoCount} />
              <StatCard label="Doručené galerie" value={liveStats.deliveredCount} accent />
              <StatCard label="Nespárované fotky" value={liveStats.unmatchedCount} />
              <StatCard label="Ø fotky / host" value={liveStats.avgPhotosPerGuest} sublabel="průměr" />
              <StatCard label="Otevřeli galerii" value={liveStats.galleryOpenedCount} sublabel={`z ${liveStats.guestCount} hostů`} />
              <StatCard label="Ve veřejné galerii" value={liveStats.publicPhotoCount} sublabel="spárovaných fotek" />
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Rychlé odkazy</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([
                  ['Slideshow / projekce', `${APP_URL}/slideshow/${eventSlug}`],
                  ['Registrace kiosk', `${APP_URL}/kiosk`],
                  ...(publicGallery ? [['Veřejná galerie', `${APP_URL}/event/${eventSlug}/gallery`]] : []),
                ] as [string, string][]).map(([lbl, url]) => (
                  <div key={url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#374151' }}>{lbl}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: accent, fontWeight: 600, textDecoration: 'none' }}>Otevřít →</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HOSTÉ ── */}
        {tab === 'guests' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {liveGuests.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Žádní hosté</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['#', 'Jméno', 'E-mail', 'Fotky', 'Doručené', 'Galerie'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {liveGuests.map(g => (
                    <tr key={g.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 16px', color: '#9ca3af' }}>{g.badge_number ?? '—'}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>{g.name ?? '—'}</td>
                      <td style={{ padding: '10px 16px', color: '#6b7280' }}>{g.email}</td>
                      <td style={{ padding: '10px 16px' }}>{g.photo_count}</td>
                      <td style={{ padding: '10px 16px' }}>
                        {g.email_sent_at
                          ? <span style={{ color: '#16a34a', fontSize: 12 }}>✓ {new Date(g.email_sent_at).toLocaleDateString('cs-CZ')}</span>
                          : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {g.gallery_token
                          ? <a href={`/gallery/${g.gallery_token}`} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Otevřít →</a>
                          : <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── NESPÁROVANÉ ── */}
        {tab === 'unmatched' && (
          <div>
            {liveUnmatched.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Žádné nespárované fotky ✓</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {liveUnmatched.map(photo => (
                  <div key={photo.id} style={{ borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <img src={photo.url} alt={photo.filename} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                    {photo.ocr_number && (
                      <div style={{ padding: '6px 10px', fontSize: 12, color: '#6b7280' }}>OCR: #{photo.ocr_number}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BRANDING ── */}
        {tab === 'branding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}>Logo a barva eventu</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Logo URL</label>
                  <input style={inputStyle} value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." />
                  <div style={{ marginTop: 8 }}>
                    <button style={btnSecondary} onClick={() => fileRef.current?.click()}>📁 Nahrát soubor</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) { setLogoFile(f); setLogoUrl(URL.createObjectURL(f)) }
                      }} />
                    {logoFile && <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 10 }}>{logoFile.name}</span>}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Brand barva</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)}
                      style={{ width: 52, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                    <input style={{ ...inputStyle, width: 120 }} value={brandColor} onChange={e => setBrandColor(e.target.value)} maxLength={7} />
                  </div>
                </div>
              </div>
              {(logoUrl || brandColor) && (
                <div style={{ marginTop: 20 }}>
                  <div style={labelStyle}>Náhled headeru</div>
                  <div style={{ background: brandColor, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    {logoUrl && <img src={logoUrl} alt="" style={{ height: 32, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />}
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{event.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{new Date(event.date).toLocaleDateString('cs-CZ')}</div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button style={btnPrimary(accent)} onClick={saveBranding} disabled={savingBranding}>
                  {savingBranding ? 'Ukládám...' : 'Uložit branding'}
                </button>
                {brandingMsg && <span style={{ fontSize: 13, color: brandingMsg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{brandingMsg}</span>}
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>Informace o akci</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={labelStyle}>Název akce</div>
                  <div style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}>{event.name}</div>
                </div>
                <div>
                  <div style={labelStyle}>Místo konání</div>
                  <div style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}>{event.location ?? '—'}</div>
                </div>
                <div>
                  <div style={labelStyle}>Datum</div>
                  <div style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}>
                    {event.date ? new Date(event.date).toLocaleDateString('cs-CZ') : '—'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={labelStyle}>Počet hostů</div>
                  <div style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}>{event.max_guests ?? '—'}</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Popis akce</label>
                <textarea
                  style={{ ...inputStyle, height: 100, resize: 'vertical' as const, marginBottom: 12 }}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Stručný popis akce, program, speciální požadavky…"
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button style={btnPrimary(accent)} onClick={saveInfo} disabled={savingInfo}>
                    {savingInfo ? 'Ukládám...' : 'Požádat o změny'}
                  </button>
                  {infoMsg && <span style={{ fontSize: 13, color: infoMsg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{infoMsg}</span>}
                </div>
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>Schválení overlay</h2>
              <div style={{ marginBottom: 16, padding: '12px 16px', background: overlayApproved ? '#f0fdf4' : '#fef9c3', borderRadius: 8, fontSize: 14 }}>
                {overlayApproved ? '✅ Overlay byl schválen' : '⏳ Overlay čeká na schválení'}
              </div>
              {event.overlay_portrait_url || event.overlay_landscape_url ? (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
                  {/* Portrait composite */}
                  {event.overlay_portrait_url && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div
                        onClick={() => setOverlayFullscreen('portrait')}
                        title="Kliknutím zobrazit větší náhled"
                        style={{ aspectRatio: '2/3', width: 133, position: 'relative', overflow: 'hidden', borderRadius: 10, flexShrink: 0, cursor: 'zoom-in' }}
                      >
                        {/* Demo background */}
                        <img src="/demo/demo-portrait.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={event.overlay_portrait_url} alt="Overlay portrét" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portrét</span>
                    </div>
                  )}
                  {/* Landscape composite */}
                  {event.overlay_landscape_url && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div
                        onClick={() => setOverlayFullscreen('landscape')}
                        title="Kliknutím zobrazit větší náhled"
                        style={{ aspectRatio: '3/2', height: 133, width: 'auto', position: 'relative', overflow: 'hidden', borderRadius: 10, flexShrink: 0, cursor: 'zoom-in' }}
                      >
                        <img src="/demo/demo-krajina.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={event.overlay_landscape_url} alt="Overlay krajina" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Krajina</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 16, padding: '14px 16px', background: '#f3f4f6', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
                  <em>Náhled overlay šablony — fotograf zatím nenahrál žádnou šablonu.</em>
                </div>
              )}
              <label style={labelStyle}>Komentář / žádost o změny</label>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, lineHeight: 1.6, marginTop: 0 }}>
                Popište požadované změny — informace o akci, úpravy textu na fotografiích nebo jakékoliv
                další přání. Fotograf se na váš komentář co nejdříve ozve.
              </p>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }}
                value={overlayNotes} onChange={e => setOverlayNotes(e.target.value)}
                placeholder="Např.: prosím zvětšit logo, změnit pozici čísla..." />
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                {!overlayApproved && (
                  <button style={btnPrimary('#16a34a')} onClick={() => saveOverlay(true)} disabled={savingOverlay}>✓ Schválit overlay</button>
                )}
                <button style={{ ...btnSecondary, borderColor: '#dc2626', color: '#dc2626' }} onClick={() => saveOverlay(false)} disabled={savingOverlay}>✗ Požádat o změny</button>
                {overlayMsg && <span style={{ fontSize: 13, color: overlayMsg.startsWith('✓') ? '#16a34a' : '#dc2626', alignSelf: 'center' }}>{overlayMsg}</span>}
              </div>
            </section>
          </div>
        )}

        {/* ── PROJEKCE ── */}
        {tab === 'projekcia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}>Slideshow / projekce</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                <div>
                  <div style={labelStyle}>Odkaz na projekci</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <code style={{ fontSize: 13, background: '#f3f4f6', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
                      {APP_URL}/slideshow/{eventSlug}
                    </code>
                    <a href={`${APP_URL}/slideshow/${eventSlug}`} target="_blank" rel="noopener noreferrer"
                      style={{ ...btnPrimary(accent), textDecoration: 'none', fontSize: 13 }}>
                      Otevřít →
                    </a>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={labelStyle}>PIN pro obsluhu</div>
                  <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 8, color: accent, background: '#f3f4f6', padding: '10px 20px', borderRadius: 10 }}>
                    {event.slideshow_pin ?? '1234'}
                  </div>
                </div>
              </div>
            </section>

            <section style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ ...sectionTitle, margin: 0 }}>Playlist ({playlist.size} / {liveAllPhotos.length})</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btnSecondary} onClick={selectAll}>Všechny</button>
                  <button style={btnSecondary} onClick={selectNone}>Žádné</button>
                  <button style={btnPrimary(accent)} onClick={savePlaylist} disabled={savingPlaylist}>
                    {savingPlaylist ? 'Ukládám...' : 'Uložit playlist'}
                  </button>
                </div>
              </div>
              {playlistMsg && <div style={{ marginBottom: 14, fontSize: 13, color: playlistMsg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{playlistMsg}</div>}
              {liveAllPhotos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Zatím nejsou k dispozici žádné spárované fotky</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {liveAllPhotos.map(photo => {
                    const selected = playlist.has(photo.id)
                    return (
                      <div key={photo.id} onClick={() => togglePhoto(photo.id)} style={{
                        borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative',
                        border: `3px solid ${selected ? accent : 'transparent'}`,
                        boxShadow: selected ? `0 0 0 2px ${accent}40` : '0 1px 4px rgba(0,0,0,0.08)',
                        transition: 'all 0.15s',
                      }}>
                        <img src={photo.url} alt={photo.filename} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                        <div style={{
                          position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%',
                          background: selected ? accent : 'rgba(255,255,255,0.85)',
                          border: `2px solid ${selected ? accent : '#ccc'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, color: selected ? '#fff' : '#ccc', fontWeight: 700,
                        }}>
                          {selected ? '✓' : ''}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── VEŘEJNÁ GALERIE ── */}
        {tab === 'gallery_public' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}>Veřejná galerie eventu</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <button onClick={() => togglePublicGallery(!publicGallery)} disabled={savingPublic} style={{
                  width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: publicGallery ? accent : '#d1d5db', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: publicGallery ? 26 : 4, width: 22, height: 22,
                    borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
                <span style={{ fontSize: 15, fontWeight: 600, color: publicGallery ? '#111827' : '#9ca3af' }}>
                  {publicGallery ? 'Veřejná galerie je ZAPNUTÁ' : 'Veřejná galerie je vypnutá'}
                </span>
                {savingPublic && <span style={{ fontSize: 13, color: '#9ca3af' }}>Ukládám...</span>}
              </div>
              {publicGallery ? (
                <div>
                  <div style={labelStyle}>Odkaz na veřejnou galerii</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                    <code style={{ fontSize: 13, background: '#f3f4f6', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
                      {APP_URL}/event/{eventSlug}/gallery
                    </code>
                    <a href={`${APP_URL}/event/${eventSlug}/gallery`} target="_blank" rel="noopener noreferrer"
                      style={{ ...btnPrimary(accent), textDecoration: 'none', fontSize: 13 }}>Otevřít →</a>
                    <button style={btnSecondary}
                      onClick={() => navigator.clipboard.writeText(`${APP_URL}/event/${eventSlug}/gallery`)}>
                      Kopírovat
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <StatCard label="Fotky ve veřejné galerii" value={liveStats.publicPhotoCount} accent />
                    <StatCard label="Doručených hostů" value={liveStats.deliveredCount} />
                  </div>
                  <div style={{ padding: '12px 16px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534' }}>
                    Veřejná galerie zobrazuje všechny spárované fotky eventu bez rozdělení podle hostů.
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px 24px', background: '#f9fafb', borderRadius: 10, color: '#9ca3af', fontSize: 14 }}>
                  Zapněte veřejnou galerii, aby si fotky mohl prohlížet kdokoliv s odkazem.
                </div>
              )}
            </section>
          </div>
        )}

      </div>

      {/* Overlay fullscreen modal */}
      {overlayFullscreen && (() => {
        const isPortrait = overlayFullscreen === 'portrait'
        const overlaySrc = isPortrait ? event.overlay_portrait_url : event.overlay_landscape_url
        return (
          <div
            onClick={() => setOverlayFullscreen(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative', overflow: 'hidden', borderRadius: 10,
                aspectRatio: isPortrait ? '2/3' : '3/2',
                ...(isPortrait
                  ? { width: 'min(calc(80vh * 2 / 3), 90vw)' }
                  : { height: 'min(80vh, calc(90vw * 2 / 3))' }),
              }}
            >
              <img
                src={isPortrait ? '/demo/demo-portrait.jpg' : '/demo/demo-krajina.jpg'}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {overlaySrc && (
                <img src={overlaySrc} alt="Overlay" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              )}
            </div>
            <button
              onClick={() => setOverlayFullscreen(null)}
              style={{ position: 'fixed', top: 16, right: 16, zIndex: 1001, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: 'white', fontSize: 22, width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >×</button>
          </div>
        )
      })()}
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}
const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280',
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
  borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
function btnPrimary(bg: string): React.CSSProperties {
  return { padding: '9px 18px', background: bg, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }
}
const btnSecondary: React.CSSProperties = {
  padding: '9px 18px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb',
  borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
}
