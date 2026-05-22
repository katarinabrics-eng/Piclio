'use client'

import { useEffect, useState } from 'react'
import type { EventWithStats, Guest, UnmatchedPhoto } from '@/lib/types'
import { StatCard } from '@/components/piclio/StatCard'
import { Logo } from '@/components/piclio/Logo'
import { PhotoUploader } from '@/components/piclio/PhotoUploader'

type Tab = 'events' | 'guests' | 'unmatched' | 'upload' | 'settings'

export function PhotographerClient() {
  const [events, setEvents] = useState<EventWithStats[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventWithStats | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [unmatched, setUnmatched] = useState<UnmatchedPhoto[]>([])
  const [tab, setTab] = useState<Tab>('events')
  const [loading, setLoading] = useState(true)
  const [assigningPhoto, setAssigningPhoto] = useState<string | null>(null)
  const [assignTarget, setAssignTarget] = useState<Record<string, string>>({})
  const [uploadedCount, setUploadedCount] = useState(0)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState({
    name: '', date: '', location: '', maxGuests: '100',
    clientName: '', clientEmail: '', brandColor: '#b7e94c',
  })
  const [editingEvent, setEditingEvent] = useState<EventWithStats | null>(null)
  const [editForm, setEditForm] = useState({
    name: '', date: '', location: '', maxGuests: '100',
    clientName: '', clientEmail: '', brandColor: '#b7e94c',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [overlayPortrait, setOverlayPortrait] = useState<{ file: File; preview: string } | null>(null)
  const [overlayLandscape, setOverlayLandscape] = useState<{ file: File; preview: string } | null>(null)
  const [overlayPortraitError, setOverlayPortraitError] = useState('')
  const [overlayLandscapeError, setOverlayLandscapeError] = useState('')
  const [overlayPortraitUrl, setOverlayPortraitUrl] = useState('')
  const [overlayLandscapeUrl, setOverlayLandscapeUrl] = useState('')
  const [overlayPortraitUploading, setOverlayPortraitUploading] = useState(false)
  const [overlayLandscapeUploading, setOverlayLandscapeUploading] = useState(false)
  const [overlayFullscreen, setOverlayFullscreen] = useState<string | null>(null)
  const [overlayStatus, setOverlayStatus] = useState<'pending_client' | 'approved_by_photographer' | 'approved_by_client' | null>(null)

  function updateForm(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function openEdit(event: EventWithStats) {
    setEditingEvent(event)
    setEditForm({
      name: event.name ?? '',
      date: event.date ? event.date.slice(0, 10) : '',
      location: event.location ?? '',
      maxGuests: String(event.max_guests ?? 100),
      clientName: event.client_name ?? '',
      clientEmail: event.client_email ?? '',
      brandColor: event.brand_color ?? '#b7e94c',
    })
    setSaveError('')
  }

  function handleOverlaySelect(
    orientation: 'portrait' | 'landscape',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    const setData = orientation === 'portrait' ? setOverlayPortrait : setOverlayLandscape
    const setError = orientation === 'portrait' ? setOverlayPortraitError : setOverlayLandscapeError
    const expectedRatio = orientation === 'portrait' ? 2 / 3 : 3 / 2
    const minW = orientation === 'portrait' ? 1000 : 1500
    const minH = orientation === 'portrait' ? 1500 : 1000

    setError('')
    setData(null)

    if (file.size > 8 * 1024 * 1024) {
      setError('Súbor je príliš veľký (max 8 MB)')
      e.target.value = ''
      return
    }

    const url = URL.createObjectURL(file)

    createImageBitmap(file).then(bmp => {
      const w = bmp.width
      const h = bmp.height
      bmp.close()
      const ratio = w / h
      const tolerance = 0.02
      if (Math.abs(ratio - expectedRatio) > tolerance) {
        setError(
          `Nesprávny pomer strán (${w}×${h}). ` +
          `Očakáva sa ${orientation === 'portrait' ? '2:3' : '3:2'}.`
        )
        URL.revokeObjectURL(url)
        e.target.value = ''
        return
      }
      if (w < minW || h < minH) {
        setError(
          `Príliš malé rozmery (${w}×${h}). ` +
          `Minimum je ${minW}×${minH} px.`
        )
        URL.revokeObjectURL(url)
        e.target.value = ''
        return
      }
      setData({ file, preview: url })
    }).catch(() => {
      setError('Nepodarilo sa načítať obrázok')
      URL.revokeObjectURL(url)
      e.target.value = ''
    })
  }

  async function handleOverlayUpload(orientation: 'portrait' | 'landscape') {
    if (!selectedEvent) return
    const source = orientation === 'portrait' ? overlayPortrait : overlayLandscape
    if (!source) return

    const setUploading = orientation === 'portrait' ? setOverlayPortraitUploading : setOverlayLandscapeUploading
    const setUrl = orientation === 'portrait' ? setOverlayPortraitUrl : setOverlayLandscapeUrl
    const setError = orientation === 'portrait' ? setOverlayPortraitError : setOverlayLandscapeError

    setUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('eventId', selectedEvent.id)
      fd.append('orientation', orientation)
      fd.append('file', source.file)

      const res = await fetch('/api/photographer/events/overlay', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Nahrávanie zlyhalo')
      } else {
        setUrl(data.url)
        // Persist URL to DB
        const patchField = orientation === 'portrait' ? 'overlayPortraitUrl' : 'overlayLandscapeUrl'
        await fetch('/api/photographer/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedEvent.id, [patchField]: data.url }),
        })
      }
    } catch {
      setError('Chyba pripojenia')
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingEvent) return
    setSaving(true); setSaveError('')
    try {
      const res = await fetch('/api/photographer/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEvent.id,
          name: editForm.name,
          date: editForm.date,
          location: editForm.location,
          maxGuests: parseInt(editForm.maxGuests) || 100,
          clientName: editForm.clientName,
          clientEmail: editForm.clientEmail,
          brandColor: editForm.brandColor,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSaveError(data.error ?? 'Chyba'); setSaving(false); return }
      setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? { ...ev, ...data.event } : ev))
      setEditingEvent(null)
    } catch { setSaveError('Chyba připojení') }
    setSaving(false)
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch('/api/photographer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          date: form.date,
          location: form.location,
          maxGuests: parseInt(form.maxGuests) || 100,
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          brandColor: form.brandColor,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error ?? 'Chyba'); setCreating(false); return }
      setEvents(prev => [data.event, ...prev])
      setShowNewEvent(false)
      setForm({ name: '', date: '', location: '', maxGuests: '100', clientName: '', clientEmail: '', brandColor: '#b7e94c' })
    } catch {
      setCreateError('Chyba připojení')
    }
    setCreating(false)
  }

  useEffect(() => {
    fetch('/api/photographer/events')
      .then(r => r.json())
      .then(d => { setEvents(d.events ?? []); setLoading(false) })
  }, [])

  async function selectEvent(event: EventWithStats) {
    setSelectedEvent(event)
    setTab('guests')
    setOverlayPortraitUrl(event.overlay_portrait_url ?? '')
    setOverlayLandscapeUrl(event.overlay_landscape_url ?? '')
    const [gRes, uRes] = await Promise.all([
      fetch(`/api/photographer/events/${event.id}/guests`),
      fetch(`/api/photographer/unmatched?eventId=${event.id}`),
    ])
    const [gData, uData] = await Promise.all([gRes.json(), uRes.json()])
    setGuests(gData.guests ?? [])
    setUnmatched(uData.photos ?? [])
  }

  async function assignPhoto(photoId: string) {
    const guestId = assignTarget[photoId]
    if (!guestId) return
    setAssigningPhoto(photoId)
    await fetch('/api/photographer/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId, guestId }),
    })
    setUnmatched(prev => prev.filter(p => p.id !== photoId))
    setGuests(prev => prev.map(g =>
      g.id === guestId ? { ...g, photo_count: g.photo_count + 1 } : g
    ))
    setAssigningPhoto(null)
    setAssignTarget(prev => { const n = { ...prev }; delete n[photoId]; return n })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#9ca3af' }}>Načítám…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Nav */}
      <div style={{
        background: '#111827', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '0 24px', height: 56,
      }}>
        <Logo dark={false} size="sm" />
        <span style={{ fontSize: 13, opacity: 0.5, marginLeft: 8 }}>Dashboard fotografa</span>
        <div style={{ flex: 1 }} />
        <a
          href="/api/photographer/auth/logout"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
        >
          Odhlásit
        </a>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {/* Event list */}
        {!selectedEvent ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
                Události
              </h1>
              <button
                onClick={() => { setShowNewEvent(true); setCreateError('') }}
                style={{
                  background: '#b7e94c', color: '#1a1225', border: 'none',
                  borderRadius: 10, padding: '9px 18px', fontWeight: 700,
                  fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Nový event
              </button>
            </div>
            {events.length === 0 ? (
              <div style={{ color: '#9ca3af', textAlign: 'center', padding: 60 }}>Žádné události</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {events.map(event => (
                  <div
                    key={event.id}
                    onClick={() => selectEvent(event)}
                    style={{
                      background: '#fff', borderRadius: 12,
                      padding: '18px 22px', cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      display: 'flex', alignItems: 'center', gap: 20,
                      transition: 'box-shadow 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{event.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>
                        {new Date(event.date).toLocaleDateString('cs-CZ')}
                        {event.location ? ` · ${event.location}` : ''}
                        {event.client_name ? ` · ${event.client_name}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <Stat label="Hosté" value={event.guestCount} />
                      <Stat label="Fotky" value={event.photoCount} />
                      <Stat label="Nespárované" value={event.unmatchedCount} warn={event.unmatchedCount > 0} />
                      <Stat label="Doručeno" value={event.deliveredCount} />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(`https://piclio.vercel.app/kiosk/${event.slug}`)
                          .then(() => alert(`Zkopírováno: /kiosk/${event.slug}`))
                      }}
                      title={`piclio.vercel.app/kiosk/${event.slug}`}
                      style={{
                        background: '#f3f4f6', border: '1px solid #e5e7eb',
                        borderRadius: 8, padding: '6px 12px', fontSize: 12,
                        fontWeight: 600, color: '#374151', cursor: 'pointer',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      Kiosk URL
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); openEdit(event) }}
                      title="Upravit event"
                      style={{
                        background: 'transparent', border: '1px solid #e5e7eb',
                        borderRadius: 8, padding: '6px 10px', fontSize: 14,
                        color: '#6b7280', cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      ✎
                    </button>
                    <div style={{ color: '#9ca3af', fontSize: 20 }}>›</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Back + tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14 }}
              >
                ← Zpět
              </button>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', flex: 1 }}>
                {selectedEvent.name}
              </h1>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
              <StatCard label="Hosté" value={selectedEvent.guestCount} />
              <StatCard label="Fotky celkem" value={selectedEvent.photoCount} />
              <StatCard label="Nespárované" value={selectedEvent.unmatchedCount} />
              <StatCard label="Doručeno" value={selectedEvent.deliveredCount} />
            </div>

            {/* Tab nav */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
              {([
                { key: 'guests',   label: `Hosté (${guests.length})` },
                { key: 'unmatched', label: `Nespárované (${unmatched.length})` },
                { key: 'upload',   label: uploadedCount > 0 ? `Upload (${uploadedCount})` : 'Upload' },
                { key: 'settings', label: 'Nastavení' },
              ] as { key: Tab; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    background: tab === key ? '#111827' : '#e5e7eb',
                    color: tab === key ? '#fff' : '#374151',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Guests tab */}
            {tab === 'guests' && (
              <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {['#', 'Jméno', 'E-mail', 'Fotky', 'Doručeno', 'Galéria'].map(h => (
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
                            ? <span style={{ color: '#16a34a', fontSize: 12 }}>✓ {new Date(g.email_sent_at).toLocaleDateString('cs-CZ')}</span>
                            : <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          {g.gallery_token
                            ? <a href={`/gallery/${g.gallery_token}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Otvoriť →</a>
                            : <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Unmatched tab */}
            {tab === 'unmatched' && (
              <div>
                {unmatched.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Všechny fotky jsou spárovány ✓</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    {unmatched.map(photo => (
                      <div key={photo.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <img src={photo.url} alt={photo.filename} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                        <div style={{ padding: '10px 12px' }}>
                          {photo.ocr_number && (
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>OCR: #{photo.ocr_number}</div>
                          )}
                          <select
                            value={assignTarget[photo.id] ?? ''}
                            onChange={e => setAssignTarget(prev => ({ ...prev, [photo.id]: e.target.value }))}
                            style={{
                              width: '100%', padding: '6px 8px', borderRadius: 6,
                              border: '1px solid #d1d5db', fontSize: 13, marginBottom: 8,
                            }}
                          >
                            <option value="">Vybrat hosta…</option>
                            {guests.map(g => (
                              <option key={g.id} value={g.id}>
                                {g.badge_number ? `#${g.badge_number} ` : ''}{g.name ?? g.email}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => assignPhoto(photo.id)}
                            disabled={!assignTarget[photo.id] || assigningPhoto === photo.id}
                            style={{
                              width: '100%', background: '#111827', color: '#fff',
                              border: 'none', borderRadius: 6, padding: '7px',
                              fontSize: 13, fontWeight: 600, cursor: 'pointer',
                              opacity: !assignTarget[photo.id] ? 0.4 : 1,
                            }}
                          >
                            {assigningPhoto === photo.id ? 'Přiřazuji…' : 'Přiřadit'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings tab */}
            {tab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Section header */}
                <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Overlay</h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    Nahrajte PNG overlay vrstvené cez fotografie hostí. Každá orientácia vyžaduje samostatný súbor.
                  </p>
                </div>

                {/* Two upload zones */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                  {/* Portrait */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <OverlayZone
                      label="Portrét"
                      description="PNG · pomer 2 : 3 · min 1000 × 1500 px · max 8 MB"
                      aspectLabel="2:3"
                      value={overlayPortrait}
                      error={overlayPortraitError}
                      onChange={e => handleOverlaySelect('portrait', e)}
                      onRemove={() => { setOverlayPortrait(null); setOverlayPortraitError(''); setOverlayPortraitUrl('') }}
                      onExpand={() => overlayPortrait && setOverlayFullscreen(overlayPortrait.preview)}
                    />
                    <button
                      onClick={() => handleOverlayUpload('portrait')}
                      disabled={!overlayPortrait || !!overlayPortraitError || overlayPortraitUploading}
                      style={{
                        background: overlayPortrait && !overlayPortraitError ? '#b7e94c' : '#e5e7eb',
                        color: overlayPortrait && !overlayPortraitError ? '#1a1225' : '#9ca3af',
                        border: 'none', borderRadius: 8, padding: '10px',
                        fontSize: 13, fontWeight: 700, cursor: overlayPortrait && !overlayPortraitError ? 'pointer' : 'not-allowed',
                        transition: 'background 0.15s',
                      }}
                    >
                      {overlayPortraitUploading ? 'Nahrávam…' : overlayPortraitUrl ? '✓ Nahraté' : 'Nahrať do Piclio'}
                    </button>
                    {overlayPortraitUrl && (
                      <div style={{ fontSize: 11, color: '#6b7280', wordBreak: 'break-all' }}>{overlayPortraitUrl}</div>
                    )}
                    {/* Composite preview */}
                    {overlayPortrait && (
                      <div style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', display: 'inline-block', height: 300 }}>
                        <img src="/sample-portrait.jpeg" alt="" style={{ height: 300, width: 'auto', display: 'block' }} />
                        <img src={overlayPortrait.preview} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'normal', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)', borderRadius: 4, padding: '2px 6px' }}>
                          Náhľad kompozitu
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Landscape */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <OverlayZone
                      label="Krajina"
                      description="PNG · pomer 3 : 2 · min 1500 × 1000 px · max 8 MB"
                      aspectLabel="3:2"
                      value={overlayLandscape}
                      error={overlayLandscapeError}
                      onChange={e => handleOverlaySelect('landscape', e)}
                      onRemove={() => { setOverlayLandscape(null); setOverlayLandscapeError(''); setOverlayLandscapeUrl('') }}
                      onExpand={() => overlayLandscape && setOverlayFullscreen(overlayLandscape.preview)}
                    />
                    <button
                      onClick={() => handleOverlayUpload('landscape')}
                      disabled={!overlayLandscape || !!overlayLandscapeError || overlayLandscapeUploading}
                      style={{
                        background: overlayLandscape && !overlayLandscapeError ? '#b7e94c' : '#e5e7eb',
                        color: overlayLandscape && !overlayLandscapeError ? '#1a1225' : '#9ca3af',
                        border: 'none', borderRadius: 8, padding: '10px',
                        fontSize: 13, fontWeight: 700, cursor: overlayLandscape && !overlayLandscapeError ? 'pointer' : 'not-allowed',
                        transition: 'background 0.15s',
                      }}
                    >
                      {overlayLandscapeUploading ? 'Nahrávam…' : overlayLandscapeUrl ? '✓ Nahraté' : 'Nahrať do Piclio'}
                    </button>
                    {overlayLandscapeUrl && (
                      <div style={{ fontSize: 11, color: '#6b7280', wordBreak: 'break-all' }}>{overlayLandscapeUrl}</div>
                    )}
                    {/* Composite preview */}
                    {overlayLandscape && (
                      <div style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', display: 'inline-block', height: 300 }}>
                        <img src="/sample-landscape.jpg" alt="" style={{ height: 300, width: 'auto', display: 'block' }} />
                        <img src={overlayLandscape.preview} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'normal', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 10, color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.45)', borderRadius: 4, padding: '2px 6px' }}>
                          Náhľad kompozitu
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Approval */}
                {(() => {
                  const bothReady = !!(overlayPortraitUrl && overlayLandscapeUrl)
                  const btnBase: React.CSSProperties = {
                    border: 'none', borderRadius: 8, padding: '10px 18px',
                    fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                    cursor: bothReady ? 'pointer' : 'not-allowed',
                  }
                  const statusMap: Record<string, { text: string; color: string; bg: string }> = {
                    pending_client:           { text: 'Odesláno zadavateli — čeká na vyjádření', color: '#92400e', bg: '#fef3c7' },
                    approved_by_photographer: { text: 'Schváleno fotografem — overlay aktivní. Zadavatel může přidat komentář.', color: '#065f46', bg: '#d1fae5' },
                    approved_by_client:       { text: 'Schváleno zadavatelem — overlay aktivní', color: '#065f46', bg: '#d1fae5' },
                  }
                  const status = overlayStatus ? statusMap[overlayStatus] : null

                  return (
                    <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Schválení overlaye</div>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          disabled={!bothReady}
                          onClick={() => setOverlayStatus('pending_client')}
                          style={{ ...btnBase, background: bothReady ? '#111827' : '#e5e7eb', color: bothReady ? '#fff' : '#9ca3af' }}
                        >
                          Odeslat ke schválení →
                        </button>
                        <button
                          disabled={!bothReady}
                          onClick={() => setOverlayStatus('approved_by_photographer')}
                          style={{ ...btnBase, background: bothReady ? '#b7e94c' : '#e5e7eb', color: bothReady ? '#1a1225' : '#9ca3af' }}
                        >
                          Schválit sám →
                        </button>
                      </div>

                      {status ? (
                        <div style={{ fontSize: 13, color: status.color, background: status.bg, borderRadius: 8, padding: '10px 14px' }}>
                          {status.text}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                          {bothReady
                            ? 'Overlay je pripravený — vyberte spôsob schválenia.'
                            : `Čeká na: ${[!overlayPortraitUrl && 'portrét', !overlayLandscapeUrl && 'krajina'].filter(Boolean).join(', ')}.`}
                        </div>
                      )}
                    </div>
                  )
                })()}


              </div>
            )}

            {/* Upload tab */}
            {tab === 'upload' && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                    Nahrát fotky
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    Fotky se nahrají na server a OCR automaticky přiřadí hosty podle čísla odznaku.
                  </p>
                </div>
                <PhotoUploader
                  eventId={selectedEvent.id}
                  onUploadComplete={(count) => setUploadedCount(count)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Overlay fullscreen preview */}
      {overlayFullscreen && (
        <div
          onClick={() => setOverlayFullscreen(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out',
          }}
        >
          <img
            src={overlayFullscreen}
            alt="Overlay fullscreen"
            style={{
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain', borderRadius: 8,
              background: 'repeating-conic-gradient(#444 0% 25%, #222 0% 50%) 0 0 / 20px 20px',
              boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
            }}
          />
          <button
            onClick={() => setOverlayFullscreen(null)}
            style={{
              position: 'fixed', top: 20, right: 24,
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: 'none', borderRadius: 8, width: 36, height: 36,
              fontSize: 20, cursor: 'pointer', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      )}

      {/* Edit event modal */}
      {editingEvent && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}
          onClick={e => { if (e.target === e.currentTarget) setEditingEvent(null) }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520,
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)', overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
            }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
                Upravit event
              </h2>
              <button
                onClick={() => setEditingEvent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 22, lineHeight: 1 }}
              >×</button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={labelStyle}>
                Název eventu *
                <input
                  required value={editForm.name}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={labelStyle}>
                  Datum
                  <input
                    type="date" value={editForm.date}
                    onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  Místo konání
                  <input
                    value={editForm.location}
                    onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))}
                    style={inputStyle}
                  />
                </label>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Zadavatel
                </div>
              </div>

              <label style={labelStyle}>
                Jméno zadavatele
                <input
                  value={editForm.clientName}
                  onChange={e => setEditForm(p => ({ ...p, clientName: e.target.value }))}
                  placeholder="Jan Novák"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Email zadavatele
                <input
                  type="email" value={editForm.clientEmail}
                  onChange={e => setEditForm(p => ({ ...p, clientEmail: e.target.value }))}
                  placeholder="jan@firma.cz"
                  style={inputStyle}
                />
              </label>

              {saveError && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13,
                }}>
                  {saveError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  style={{
                    flex: 1, padding: '11px', border: '1px solid #d1d5db',
                    borderRadius: 10, background: '#fff', color: '#374151',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2, padding: '11px', border: 'none',
                    borderRadius: 10, background: saving ? '#e5e7eb' : '#b7e94c',
                    color: saving ? '#9ca3af' : '#1a1225',
                    fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Ukládám…' : 'Uložit změny →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New event modal */}
      {showNewEvent && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowNewEvent(false) }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520,
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)', overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
            }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Nový event</h2>
              <button
                onClick={() => setShowNewEvent(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 22, lineHeight: 1 }}
              >×</button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateEvent} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Název */}
              <label style={labelStyle}>
                Název eventu *
                <input
                  required value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  placeholder="Voděrádky 2026"
                  style={inputStyle}
                />
              </label>

              {/* Datum + Místo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={labelStyle}>
                  Datum *
                  <input
                    type="date" required value={form.date}
                    onChange={e => updateForm('date', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  Místo konání *
                  <input
                    required value={form.location}
                    onChange={e => updateForm('location', e.target.value)}
                    placeholder="Praha, hotel XY"
                    style={inputStyle}
                  />
                </label>
              </div>

              {/* Max hostů + Barva */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={labelStyle}>
                  Max. počet hostů
                  <input
                    type="number" min={1} max={9999} value={form.maxGuests}
                    onChange={e => updateForm('maxGuests', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  Barva brandingu
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                    <input
                      type="color" value={form.brandColor}
                      onChange={e => updateForm('brandColor', e.target.value)}
                      style={{ width: 42, height: 38, border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', padding: 2 }}
                    />
                    <span style={{ fontSize: 13, color: '#374151', fontFamily: 'monospace' }}>{form.brandColor}</span>
                  </div>
                </label>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Zadavatel (obdrží pozvánku)
                </div>
              </div>

              {/* Jméno zadavatele */}
              <label style={labelStyle}>
                Jméno zadavatele *
                <input
                  required value={form.clientName}
                  onChange={e => updateForm('clientName', e.target.value)}
                  placeholder="Jan Novák"
                  style={inputStyle}
                />
              </label>

              {/* Email zadavatele */}
              <label style={labelStyle}>
                Email zadavatele *
                <input
                  type="email" required value={form.clientEmail}
                  onChange={e => updateForm('clientEmail', e.target.value)}
                  placeholder="jan@firma.cz"
                  style={inputStyle}
                />
              </label>

              {/* Error */}
              {createError && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13,
                }}>
                  {createError}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowNewEvent(false)}
                  style={{
                    flex: 1, padding: '11px', border: '1px solid #d1d5db',
                    borderRadius: 10, background: '#fff', color: '#374151',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 2, padding: '11px', border: 'none',
                    borderRadius: 10, background: creating ? '#e5e7eb' : '#b7e94c',
                    color: creating ? '#9ca3af' : '#1a1225',
                    fontSize: 14, fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {creating ? 'Vytvářím…' : 'Vytvořit event →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 5,
  fontSize: 13, fontWeight: 600, color: '#374151',
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8,
  fontSize: 14, color: '#111827', background: '#fff', outline: 'none',
  marginTop: 2,
}

interface OverlayZoneProps {
  label: string
  description: string
  aspectLabel: string
  value: { file: File; preview: string } | null
  error: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  onExpand: () => void
}

function OverlayZone({ label, description, aspectLabel, value, error, onChange, onRemove, onExpand }: OverlayZoneProps) {
  const inputId = `overlay-${label}`
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>{description}</div>
      </div>

      {/* Preview or drop zone */}
      {value ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <img
              src={value.preview}
              alt={`${label} overlay náhľad`}
              onClick={onExpand}
              title="Kliknúť pre celý náhľad"
              style={{
                maxHeight: 200,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 0 0 / 16px 16px',
                display: 'block',
                cursor: 'zoom-in',
              }}
            />
            <button
              onClick={onRemove}
              title="Odstraniť"
              style={{
                position: 'absolute', top: 6, right: 6,
                background: 'rgba(0,0,0,0.55)', color: '#fff',
                border: 'none', borderRadius: 6, width: 28, height: 28,
                fontSize: 16, cursor: 'pointer', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
            <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 10, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.45)', borderRadius: 4, padding: '2px 5px', pointerEvents: 'none' }}>
              🔍 celý náhľad
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', wordBreak: 'break-all' }}>
            {value.file.name} · {(value.file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, border: `2px dashed ${error ? '#fca5a5' : '#d1d5db'}`,
            borderRadius: 10, padding: '28px 16px', cursor: 'pointer',
            background: error ? '#fef2f2' : '#f9fafb',
            transition: 'border-color 0.15s',
          }}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>🖼</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Vybrať PNG súbor</span>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{aspectLabel} · max 8 MB</span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/png"
        onChange={onChange}
        style={{ display: 'none' }}
      />

      {error && (
        <div style={{
          fontSize: 12, color: '#dc2626',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 6, padding: '8px 10px',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: warn ? '#dc2626' : '#111827' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#9ca3af' }}>{label}</div>
    </div>
  )
}
