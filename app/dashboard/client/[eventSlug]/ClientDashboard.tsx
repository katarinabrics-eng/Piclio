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

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://piclio.cz'

type Tab = 'overview' | 'links' | 'albums' | 'branding' | 'photos'

interface Album {
  id: string
  name: string
  photoIds: string[]
}

export function ClientDashboard({ event, guests, stats, unmatchedPhotos, allPhotos, eventSlug }: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  // ── Photos state ────────────────────────────────────────────────────────────
  const [eventPhotos, setEventPhotos] = useState<any[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)

  useEffect(() => {
    if (tab !== 'photos') return
    setPhotosLoading(true)
    fetch(`/api/photographer/unmatched?eventId=${event.id}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setEventPhotos(d.photos ?? []))
      .catch(() => setEventPhotos([]))
      .finally(() => setPhotosLoading(false))
  }, [tab, event.id])

  // ── Live state ──────────────────────────────────────────────────────────────
  const [liveStats, setLiveStats] = useState(stats)
  const [liveGuests, setLiveGuests] = useState(guests)

  // Poll stats + guests every 15s
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

  // ── Albums ──────────────────────────────────────────────────────────────────
  const [albums, setAlbums] = useState<Album[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(`piclio-albums-${eventSlug}`) ?? '[]') } catch { return [] }
  })
  const [newAlbumName, setNewAlbumName] = useState('')
  const [editingAlbum, setEditingAlbum] = useState<string | null>(null)
  const [albumPhotos, setAlbumPhotos] = useState<PlaylistPhoto[]>(allPhotos)
  const [loadingPhotos, setLoadingPhotos] = useState(false)

  useEffect(() => {
    if (tab !== 'albums') return
    setLoadingPhotos(true)
    fetch(`/api/events/${eventSlug}/gallery-photos`)
      .then(r => r.json())
      .then(d => { if (d.photos) setAlbumPhotos(d.photos) })
      .catch(() => {})
      .finally(() => setLoadingPhotos(false))
  }, [eventSlug, tab])

  function saveAlbums(next: Album[]) {
    setAlbums(next)
    localStorage.setItem(`piclio-albums-${eventSlug}`, JSON.stringify(next))
  }

  function createAlbum() {
    const name = newAlbumName.trim()
    if (!name) return
    const album: Album = { id: crypto.randomUUID(), name, photoIds: [] }
    saveAlbums([...albums, album])
    setNewAlbumName('')
    setEditingAlbum(album.id)
  }

  function deleteAlbum(id: string) {
    if (!confirm('Smazat album?')) return
    saveAlbums(albums.filter(a => a.id !== id))
    if (editingAlbum === id) setEditingAlbum(null)
  }

  function togglePhotoInAlbum(albumId: string, photoId: string) {
    saveAlbums(albums.map(a => {
      if (a.id !== albumId) return a
      const has = a.photoIds.includes(photoId)
      return { ...a, photoIds: has ? a.photoIds.filter(id => id !== photoId) : [...a.photoIds, photoId] }
    }))
  }

  // ── Branding state ──────────────────────────────────────────────────────────
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const accent = brandColor

  // ── Handlers ────────────────────────────────────────────────────────────────

  function copyLink(key: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    })
  }

  async function saveInfo() {
    setSavingInfo(true); setInfoMsg('')
    try {
      const res = await fetch(`/api/client/${eventSlug}/branding`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setInfoMsg('✓ Uloženo')
    } catch (e: any) { setInfoMsg(`✗ ${e.message}`) }
    finally { setSavingInfo(false) }
  }

  async function saveBranding() {
    setSavingBranding(true); setBrandingMsg('')
    try {
      const form = new FormData()
      form.append('brand_color', brandColor)
      if (logoFile) form.append('logo', logoFile)
      else form.append('client_logo_url', logoUrl)
      const res = await fetch(`/api/client/${eventSlug}/branding`, { method: 'PUT', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      if (json.client_logo_url) setLogoUrl(json.client_logo_url)
      if (json.brand_color) setBrandColor(json.brand_color)
      setBrandingMsg('✓ Branding uložen')
      window.location.reload()
    } catch (e: any) { setBrandingMsg(`✗ Chyba: ${e.message}`) }
    finally { setSavingBranding(false) }
  }

  async function saveOverlay(approved: boolean) {
    setSavingOverlay(true); setOverlayMsg('')
    try {
      const res = await fetch(`/api/client/${eventSlug}/approve-overlay`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, notes: overlayNotes }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setOverlayApproved(approved)
      setOverlayMsg(approved ? '✓ Overlay schválen' : '✓ Žádost o změnu odeslána')
    } catch (e: any) { setOverlayMsg(`✗ Chyba: ${e.message}`) }
    finally { setSavingOverlay(false) }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  function statusBadge(status: string) {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      active:    { label: 'Aktivní',   bg: '#dcfce7', color: '#16a34a' },
      draft:     { label: 'Příprava',  bg: '#fef9c3', color: '#92400e' },
      paused:    { label: 'Pozastaveno', bg: '#fee2e2', color: '#dc2626' },
      completed: { label: 'Dokončeno', bg: '#f3f4f6', color: '#6b7280' },
      archived:  { label: 'Archiv',    bg: '#f3f4f6', color: '#9ca3af' },
    }
    const s = map[status] ?? { label: status, bg: '#f3f4f6', color: '#6b7280' }
    return (
      <span style={{ display: 'inline-block', background: s.bg, color: s.color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
        {s.label}
      </span>
    )
  }

  const LINKS = [
    {
      key: 'kiosk',
      icon: '📱',
      label: 'Kiosk — registrace hostů',
      desc: 'Zobrazte na tabletu u vstupu. Hosté zadají e-mail a dostanou odznak.',
      url: `${APP_URL}/kiosk/${eventSlug}`,
    },
    {
      key: 'slideshow',
      icon: '▶',
      label: 'Slideshow — projekce',
      desc: event.slideshow_pin ? `PIN pro obsluhu: ${event.slideshow_pin}` : 'Živá projekce fotek na plátno nebo TV.',
      url: `${APP_URL}/slideshow/${eventSlug}`,
    },
    {
      key: 'gallery',
      icon: '🖼',
      label: 'Veřejná galerie eventu',
      desc: 'Odkaz pro sdílení — zobrazuje všechny spárované fotky bez přihlášení.',
      url: `${APP_URL}/event/${eventSlug}/gallery`,
    },
  ]

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ background: accent, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        {logoUrl && <img src={logoUrl} alt="" style={{ height: 36, objectFit: 'contain', borderRadius: 4 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{event.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
            {formatDate(event.date)}{event.location ? ` · ${event.location}` : ''}
          </div>
        </div>
        {statusBadge(event.status)}
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#e8e5df', borderRadius: 12, padding: 4 }}>
          {([
            ['overview', 'Přehled'],
            ['links',    'Linky'],
            ['albums',   'Alba'],
            ['photos',   'Fotky z eventu'],
            ['branding', 'Branding'],
          ] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: tab === key ? '#fff' : 'transparent',
              color: tab === key ? '#111827' : '#6b7280',
              boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── PŘEHLED ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Info o eventu */}
            <div style={card}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <InfoTile label="Název akce" value={event.name} />
                <InfoTile label="Datum" value={formatDate(event.date)} />
                {event.location && <InfoTile label="Místo" value={event.location} />}
                <InfoTile label="Max hostů" value={String(event.max_guests ?? '—')} />
                <InfoTile label="Stav" value={event.status} />
              </div>
            </div>

            {/* Stat karty */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              <StatCard label="Hosté celkem" value={liveStats.guestCount} />
              <StatCard label="Fotky celkem" value={liveStats.photoCount} />
              <StatCard label="Spárované" value={liveStats.publicPhotoCount} accent />
              <StatCard label="Doručeno" value={liveStats.deliveredCount} accent />
              <StatCard label="Ø fotky / host" value={liveStats.avgPhotosPerGuest} sublabel="průměr" />
              <StatCard label="Nespárované" value={liveStats.unmatchedCount} />
            </div>

            {/* Rychlé linky */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Rychlé linky</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LINKS.map(l => (
                  <div key={l.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f9f8f5', borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: '#374151' }}>{l.icon} {l.label}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => copyLink(l.key, l.url)} style={btnOutline(accent)}>
                        {copiedKey === l.key ? '✓ Zkopírováno' : 'Kopírovat'}
                      </button>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ ...btnOutline(accent), textDecoration: 'none' }}>Otevřít →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LINKY ── */}
        {tab === 'links' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LINKS.map(l => (
              <div key={l.key} style={{ ...card, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fde8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {l.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{l.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>{l.desc}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                    <code style={{ fontSize: 12, background: '#f3f4f6', padding: '6px 10px', borderRadius: 6, color: '#374151', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {l.url}
                    </code>
                    <button onClick={() => copyLink(l.key, l.url)} style={btnPrimary(accent)}>
                      {copiedKey === l.key ? '✓ Zkopírováno' : 'Kopírovat'}
                    </button>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ ...btnOutline(accent), textDecoration: 'none' }}>
                      Otevřít →
                    </a>
                  </div>
                  {l.key === 'slideshow' && event.slideshow_pin && (
                    <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fde8', border: '1px solid #b7e94c', borderRadius: 8, padding: '6px 14px' }}>
                      <span style={{ fontSize: 11, color: '#4a7c00', fontWeight: 600, letterSpacing: '0.05em' }}>PIN:</span>
                      <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 4, color: '#111827', fontFamily: 'monospace' }}>{event.slideshow_pin}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ALBA ── */}
        {tab === 'albums' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Vytvoření nového alba */}
            {editingAlbum === null && (
              <div style={card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Vytvořit album</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Název alba (např. Večeře, Tanec, VIP…)"
                    value={newAlbumName}
                    onChange={e => setNewAlbumName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createAlbum()}
                    style={inputStyle}
                  />
                  <button onClick={createAlbum} disabled={!newAlbumName.trim()} style={btnPrimary(accent)}>
                    + Vytvořit
                  </button>
                </div>
              </div>
            )}

            {/* Existující alba */}
            {albums.length === 0 && editingAlbum === null && (
              <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af', background: '#fff', borderRadius: 12 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Zatím žádná alba</div>
                <div style={{ fontSize: 13 }}>Vytvořte album a přidejte do něj fotky z eventu.</div>
              </div>
            )}

            {editingAlbum === null && albums.map(album => (
              <div key={album.id} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{album.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{album.photoIds.length} fotek</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setEditingAlbum(album.id)} style={btnPrimary(accent)}>Upravit</button>
                    <button onClick={() => deleteAlbum(album.id)} style={{ ...btnOutline('#dc2626'), color: '#dc2626' }}>Smazat</button>
                  </div>
                </div>
                {album.photoIds.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    {album.photoIds.slice(0, 8).map(pid => {
                      const p = albumPhotos.find(x => x.id === pid)
                      return p ? (
                        <img key={pid} src={p.url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                      ) : null
                    })}
                    {album.photoIds.length > 8 && (
                      <div style={{ width: 60, height: 60, borderRadius: 6, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#6b7280', fontWeight: 700 }}>
                        +{album.photoIds.length - 8}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Editor alba */}
            {editingAlbum !== null && (() => {
              const album = albums.find(a => a.id === editingAlbum)
              if (!album) return null
              return (
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <button onClick={() => setEditingAlbum(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#6b7280', padding: 0 }}>←</button>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{album.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{album.photoIds.length} fotek vybráno</div>
                    </div>
                    <button onClick={() => setEditingAlbum(null)} style={{ marginLeft: 'auto', ...btnOutline(accent) }}>
                      ✓ Hotovo
                    </button>
                  </div>
                  {loadingPhotos ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Načítám fotky…</div>
                  ) : albumPhotos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Zatím nejsou k dispozici žádné fotky</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                      {albumPhotos.map(photo => {
                        const selected = album.photoIds.includes(photo.id)
                        return (
                          <div key={photo.id} onClick={() => togglePhotoInAlbum(album.id, photo.id)} style={{
                            borderRadius: 8, overflow: 'hidden', cursor: 'pointer', position: 'relative',
                            border: `2px solid ${selected ? accent : 'transparent'}`,
                            aspectRatio: '1',
                          }}>
                            <img src={photo.url} alt={photo.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {selected && (
                              <div style={{ position: 'absolute', top: 5, right: 5, width: 20, height: 20, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#1a1225', fontWeight: 700 }}>
                                ✓
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ── FOTKY Z EVENTU ── */}
        {tab === 'photos' && (
          <div style={{ padding: '24px 0' }}>
            {photosLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Načítám fotky…</div>
            ) : eventPhotos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                <div style={{ fontSize: 15 }}>Zatím žádné fotky z eventu</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                  Celkem {eventPhotos.length} fotek z eventu
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {eventPhotos.map((photo: any) => (
                    <div key={photo.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1' }}>
                      <img
                        src={photo.url}
                        alt={photo.filename}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {photo.status === 'unmatched' && (
                        <div style={{
                          position: 'absolute', top: 4, left: 4,
                          background: '#f59e0b', color: '#fff',
                          fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        }}>
                          Bez galerie
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
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
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{formatDate(event.date)}</div>
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
                  <div style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }}>{formatDate(event.date)}</div>
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
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' as const, marginBottom: 16 }}>
                  {event.overlay_portrait_url && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div onClick={() => setOverlayFullscreen('portrait')} title="Kliknutím zobrazit větší náhled"
                        style={{ aspectRatio: '2/3', width: 133, position: 'relative', overflow: 'hidden', borderRadius: 10, flexShrink: 0, cursor: 'zoom-in' }}>
                        <img src="/demo/demo-portrait.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={event.overlay_portrait_url} alt="Overlay portrét" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Portrét</span>
                    </div>
                  )}
                  {event.overlay_landscape_url && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div onClick={() => setOverlayFullscreen('landscape')} title="Kliknutím zobrazit větší náhled"
                        style={{ aspectRatio: '3/2', height: 133, width: 'auto', position: 'relative', overflow: 'hidden', borderRadius: 10, flexShrink: 0, cursor: 'zoom-in' }}>
                        <img src="/demo/demo-krajina.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={event.overlay_landscape_url} alt="Overlay krajina" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Krajina</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 16, padding: '14px 16px', background: '#f3f4f6', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
                  <em>Fotograf zatím nenahrál žádnou overlay šablonu.</em>
                </div>
              )}
              <label style={labelStyle}>Komentář / žádost o změny</label>
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

      </div>

      {/* Overlay fullscreen modal */}
      {overlayFullscreen && (() => {
        const isPortrait = overlayFullscreen === 'portrait'
        const overlaySrc = isPortrait ? event.overlay_portrait_url : event.overlay_landscape_url
        return (
          <div onClick={() => setOverlayFullscreen(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={e => e.stopPropagation()}
              style={{ position: 'relative', overflow: 'hidden', borderRadius: 10, aspectRatio: isPortrait ? '2/3' : '3/2', ...(isPortrait ? { width: 'min(calc(80vh * 2 / 3), 90vw)' } : { height: 'min(80vh, calc(90vw * 2 / 3))' }) }}>
              <img src={isPortrait ? '/demo/demo-portrait.jpg' : '/demo/demo-krajina.jpg'} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              {overlaySrc && <img src={overlaySrc} alt="Overlay" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />}
            </div>
            <button onClick={() => setOverlayFullscreen(null)}
              style={{ position: 'fixed', top: 16, right: 16, zIndex: 1001, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: 'white', fontSize: 22, width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
          </div>
        )
      })()}
    </div>
  )
}

// ── Helper components ─────────────────────────────────────────────────────────

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#f5f3ee', borderRadius: 8, padding: '10px 16px', minWidth: 130 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</div>
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
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
  return { padding: '9px 18px', background: bg, color: bg === '#16a34a' ? '#fff' : '#1a1225', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }
}
function btnOutline(color: string): React.CSSProperties {
  return { padding: '7px 14px', background: 'transparent', color, border: `1px solid ${color}`, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }
}
const btnSecondary: React.CSSProperties = {
  padding: '9px 18px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb',
  borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
}
