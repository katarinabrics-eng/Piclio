'use client'

import { useEffect, useState } from 'react'
import type { EventWithStats, Guest, UnmatchedPhoto } from '@/lib/types'
import { StatCard } from '@/components/piclio/StatCard'
import { Logo } from '@/components/piclio/Logo'

type Tab = 'events' | 'guests' | 'unmatched'

export function PhotographerClient() {
  const [events, setEvents] = useState<EventWithStats[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventWithStats | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [unmatched, setUnmatched] = useState<UnmatchedPhoto[]>([])
  const [tab, setTab] = useState<Tab>('events')
  const [loading, setLoading] = useState(true)
  const [assigningPhoto, setAssigningPhoto] = useState<string | null>(null)
  const [assignTarget, setAssignTarget] = useState<Record<string, string>>({})

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
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#111827' }}>
              Události
            </h1>
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
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {(['guests', 'unmatched'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    background: tab === t ? '#111827' : '#e5e7eb',
                    color: tab === t ? '#fff' : '#374151',
                  }}
                >
                  {t === 'guests' ? `Hosté (${guests.length})` : `Nespárované (${unmatched.length})`}
                </button>
              ))}
            </div>

            {/* Guests tab */}
            {tab === 'guests' && (
              <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {['#', 'Jméno', 'E-mail', 'Fotky', 'Doručeno'].map(h => (
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
          </>
        )}
      </div>
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
