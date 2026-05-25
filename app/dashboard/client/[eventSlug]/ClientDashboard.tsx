'use client'

import { useState, useRef } from 'react'
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
  const [brandColor, setBrandColor] = useState(event.brand_color ?? '#1a1225')
  const [logoUrl, setLogoUrl] = useState(event.client_logo_url ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [savingBranding, setSavingBranding] = useState(false)
  const [brandingMsg, setBrandingMsg] = useState('')

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
      setBrandingMsg('✓ Branding uložený')
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
      setOverlayMsg(approved ? '✓ Overlay schválený' : '✓ Žiadosť o zmenu odoslaná')
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
      setPlaylistMsg(`✓ Playlist uložený (${playlist.size} fotiek)`)
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

  function selectAll() { setPlaylist(new Set(allPhotos.map(p => p.id))) }
  function selectNone() { setPlaylist(new Set()) }

  // ── Tabs config ────────────────────────────────────────────────────────────

  const TABS: [Tab, string][] = [
    ['overview',       'Prehľad'],
    ['guests',         `Hosté (${stats.guestCount})`],
    ['unmatched',      `Nespárované (${stats.unmatchedCount})`],
    ['branding',       'Branding'],
    ['projekcia',      'Projekcia'],
    ['gallery_public', 'Verejná galéria'],
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
              {new Date(event.date).toLocaleDateString('sk-SK')}
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

        {/* ── PREHĽAD ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard label="Registrovaní hosté" value={stats.guestCount} />
              <StatCard label="Fotky celkom" value={stats.photoCount} />
              <StatCard label="Doručené galérie" value={stats.deliveredCount} accent />
              <StatCard label="Nespárované fotky" value={stats.unmatchedCount} />
              <StatCard label="Ø fotky / hosť" value={stats.avgPhotosPerGuest} sublabel="priemer" />
              <StatCard label="Otvorili galériu" value={stats.galleryOpenedCount} sublabel={`z ${stats.guestCount} hostí`} />
              <StatCard label="Vo verejnej galérii" value={stats.publicPhotoCount} sublabel="spárovaných fotiek" />
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Rýchle linky</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([
                  ['Slideshow / projekcia', `${APP_URL}/slideshow/${eventSlug}`],
                  ['Registrácia kiosk', `${APP_URL}/kiosk`],
                  ...(publicGallery ? [['Verejná galéria', `${APP_URL}/event/${eventSlug}/gallery`]] : []),
                ] as [string, string][]).map(([lbl, url]) => (
                  <div key={url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9fafb', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#374151' }}>{lbl}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: accent, fontWeight: 600, textDecoration: 'none' }}>Otvoriť →</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HOSTÉ ── */}
        {tab === 'guests' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {guests.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Žiadni hostia</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    {['#', 'Meno', 'E-mail', 'Fotky', 'Doručené', 'Galéria'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guests.map(g => (
                    <tr key={g.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 16px', color: '#9ca3af' }}>{g.badge_number ?? '—'}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>{g.name ?? '—'}</td>
                      <td style={{ padding: '10px 16px', color: '#6b7280' }}>{g.email}</td>
                      <td style={{ padding: '10px 16px' }}>{g.photo_count}</td>
                      <td style={{ padding: '10px 16px' }}>
                        {g.email_sent_at
                          ? <span style={{ color: '#16a34a', fontSize: 12 }}>✓ {new Date(g.email_sent_at).toLocaleDateString('sk-SK')}</span>
                          : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {g.gallery_token
                          ? <a href={`/gallery/${g.gallery_token}`} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Otvoriť →</a>
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
            {unmatchedPhotos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Žiadne nespárované fotky ✓</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {unmatchedPhotos.map(photo => (
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
              <h2 style={sectionTitle}>Logo a farba eventu</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Logo URL</label>
                  <input style={inputStyle} value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." />
                  <div style={{ marginTop: 8 }}>
                    <button style={btnSecondary} onClick={() => fileRef.current?.click()}>📁 Nahrať súbor</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) { setLogoFile(f); setLogoUrl(URL.createObjectURL(f)) }
                      }} />
                    {logoFile && <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 10 }}>{logoFile.name}</span>}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Brand farba</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)}
                      style={{ width: 52, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                    <input style={{ ...inputStyle, width: 120 }} value={brandColor} onChange={e => setBrandColor(e.target.value)} maxLength={7} />
                  </div>
                </div>
              </div>
              {(logoUrl || brandColor) && (
                <div style={{ marginTop: 20 }}>
                  <div style={labelStyle}>Náhľad headera</div>
                  <div style={{ background: brandColor, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    {logoUrl && <img src={logoUrl} alt="" style={{ height: 32, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />}
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{event.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{new Date(event.date).toLocaleDateString('sk-SK')}</div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button style={btnPrimary(accent)} onClick={saveBranding} disabled={savingBranding}>
                  {savingBranding ? 'Ukladám...' : 'Uložiť branding'}
                </button>
                {brandingMsg && <span style={{ fontSize: 13, color: brandingMsg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{brandingMsg}</span>}
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}>Overlay schválenie</h2>
              <div style={{ marginBottom: 16, padding: '12px 16px', background: overlayApproved ? '#f0fdf4' : '#fef9c3', borderRadius: 8, fontSize: 14 }}>
                {overlayApproved ? '✅ Overlay bol schválený' : '⏳ Overlay čaká na schválenie'}
              </div>
              {event.overlay_portrait_url || event.overlay_landscape_url ? (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
                  {/* Portrait composite */}
                  {event.overlay_portrait_url && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div
                        onClick={() => setOverlayFullscreen('portrait')}
                        title="Kliknúť pre väčší náhľad"
                        style={{ aspectRatio: '2/3', width: 133, position: 'relative', overflow: 'hidden', borderRadius: 10, flexShrink: 0, cursor: 'zoom-in' }}
                      >
                        {/* Demo background */}
                        <div style={{ position: 'absolute', inset: 0, background: '#2d2040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity={0.25}>
                            <circle cx="12" cy="8" r="4" fill="white"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/>
                          </svg>
                        </div>
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
                        title="Kliknúť pre väčší náhľad"
                        style={{ aspectRatio: '3/2', height: 133, width: 'auto', position: 'relative', overflow: 'hidden', borderRadius: 10, flexShrink: 0, cursor: 'zoom-in' }}
                      >
                        <div style={{ position: 'absolute', inset: 0, background: '#2d2040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity={0.25}>
                            <circle cx="12" cy="8" r="4" fill="white"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/>
                          </svg>
                        </div>
                        <img src={event.overlay_landscape_url} alt="Overlay krajina" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Krajina</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 16, padding: '14px 16px', background: '#f3f4f6', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
                  <em>Náhľad overlay šablóny — fotograf ešte nenahrál žiadnu šablónu.</em>
                </div>
              )}
              <label style={labelStyle}>Komentár / žiadosť o zmeny</label>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }}
                value={overlayNotes} onChange={e => setOverlayNotes(e.target.value)}
                placeholder="Napr.: prosím zväčšiť logo, zmeniť pozíciu čísla..." />
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button style={btnPrimary('#16a34a')} onClick={() => saveOverlay(true)} disabled={savingOverlay}>✓ Schváliť overlay</button>
                <button style={{ ...btnSecondary, borderColor: '#dc2626', color: '#dc2626' }} onClick={() => saveOverlay(false)} disabled={savingOverlay}>✗ Požiadať o zmeny</button>
                {overlayMsg && <span style={{ fontSize: 13, color: overlayMsg.startsWith('✓') ? '#16a34a' : '#dc2626', alignSelf: 'center' }}>{overlayMsg}</span>}
              </div>
            </section>
          </div>
        )}

        {/* ── PROJEKCIA ── */}
        {tab === 'projekcia' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}>Slideshow / projekcia</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                <div>
                  <div style={labelStyle}>Link na projekciu</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <code style={{ fontSize: 13, background: '#f3f4f6', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
                      {APP_URL}/slideshow/{eventSlug}
                    </code>
                    <a href={`${APP_URL}/slideshow/${eventSlug}`} target="_blank" rel="noopener noreferrer"
                      style={{ ...btnPrimary(accent), textDecoration: 'none', fontSize: 13 }}>
                      Otvoriť →
                    </a>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={labelStyle}>PIN pre obsluhu</div>
                  <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 8, color: accent, background: '#f3f4f6', padding: '10px 20px', borderRadius: 10 }}>
                    {event.slideshow_pin ?? '1234'}
                  </div>
                </div>
              </div>
            </section>

            <section style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ ...sectionTitle, margin: 0 }}>Playlist ({playlist.size} / {allPhotos.length})</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btnSecondary} onClick={selectAll}>Všetky</button>
                  <button style={btnSecondary} onClick={selectNone}>Žiadne</button>
                  <button style={btnPrimary(accent)} onClick={savePlaylist} disabled={savingPlaylist}>
                    {savingPlaylist ? 'Ukladám...' : 'Uložiť playlist'}
                  </button>
                </div>
              </div>
              {playlistMsg && <div style={{ marginBottom: 14, fontSize: 13, color: playlistMsg.startsWith('✓') ? '#16a34a' : '#dc2626' }}>{playlistMsg}</div>}
              {allPhotos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Žiadne spárované fotky ešte nie sú k dispozícii</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {allPhotos.map(photo => {
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

        {/* ── VEREJNÁ GALÉRIA ── */}
        {tab === 'gallery_public' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}>Verejná galéria eventu</h2>
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
                  {publicGallery ? 'Verejná galéria je ZAPNUTÁ' : 'Verejná galéria je vypnutá'}
                </span>
                {savingPublic && <span style={{ fontSize: 13, color: '#9ca3af' }}>Ukladám...</span>}
              </div>
              {publicGallery ? (
                <div>
                  <div style={labelStyle}>Link na verejnú galériu</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                    <code style={{ fontSize: 13, background: '#f3f4f6', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
                      {APP_URL}/event/{eventSlug}/gallery
                    </code>
                    <a href={`${APP_URL}/event/${eventSlug}/gallery`} target="_blank" rel="noopener noreferrer"
                      style={{ ...btnPrimary(accent), textDecoration: 'none', fontSize: 13 }}>Otvoriť →</a>
                    <button style={btnSecondary}
                      onClick={() => navigator.clipboard.writeText(`${APP_URL}/event/${eventSlug}/gallery`)}>
                      Kopírovať
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <StatCard label="Fotky vo verejnej galérii" value={stats.publicPhotoCount} accent />
                    <StatCard label="Doručených hostí" value={stats.deliveredCount} />
                  </div>
                  <div style={{ padding: '12px 16px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#166534' }}>
                    Verejná galéria zobrazuje všetky spárované fotky eventu bez rozdelenia podľa hostí.
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px 24px', background: '#f9fafb', borderRadius: 10, color: '#9ca3af', fontSize: 14 }}>
                  Zapnite verejnú galériu, aby si fotky mohol prezerať ktokoľvek s linkom.
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
              <div style={{ position: 'absolute', inset: 0, background: '#2d2040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="96" height="96" viewBox="0 0 24 24" fill="none" opacity={0.2}>
                  <circle cx="12" cy="8" r="4" fill="white"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/>
                </svg>
              </div>
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
