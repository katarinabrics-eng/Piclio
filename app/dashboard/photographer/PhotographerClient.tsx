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
              <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
                  Overlay a nastavenia — pripravujeme
                </p>
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

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: warn ? '#dc2626' : '#111827' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#9ca3af' }}>{label}</div>
    </div>
  )
}
