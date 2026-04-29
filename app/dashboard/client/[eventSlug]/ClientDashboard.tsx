'use client'

import { useState } from 'react'
import type { PiclioEvent, Guest, UnmatchedPhoto } from '@/lib/types'
import { StatCard } from '@/components/piclio/StatCard'
import { Logo } from '@/components/piclio/Logo'

interface Stats {
  guestCount: number
  photoCount: number
  unmatchedCount: number
  deliveredCount: number
}

interface Props {
  event: PiclioEvent
  guests: Guest[]
  stats: Stats
  unmatchedPhotos: UnmatchedPhoto[]
}

type Tab = 'overview' | 'guests' | 'unmatched'

export function ClientDashboard({ event, guests, stats, unmatchedPhotos }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const brandColor = event.brand_color ?? '#111827'

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: brandColor, color: '#fff', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {event.client_logo_url && (
            <img src={event.client_logo_url} alt="" style={{ height: 36, objectFit: 'contain' }} />
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

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
          {([
            ['overview', 'Přehled'],
            ['guests', `Hosté (${stats.guestCount})`],
            ['unmatched', `Nespárované (${stats.unmatchedCount})`],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '7px 16px', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: tab === key ? brandColor : '#e5e7eb',
                color: tab === key ? '#fff' : '#374151',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <StatCard label="Registrovaní hosté" value={stats.guestCount} />
            <StatCard label="Fotky celkem" value={stats.photoCount} />
            <StatCard label="Nespárované fotky" value={stats.unmatchedCount} />
            <StatCard label="Doručené galerie" value={stats.deliveredCount} />
          </div>
        )}

        {/* Guests */}
        {tab === 'guests' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {guests.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Žádní hosté</div>
            ) : (
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
            )}
          </div>
        )}

        {/* Unmatched */}
        {tab === 'unmatched' && (
          <div>
            {unmatchedPhotos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Žádné nespárované fotky ✓</div>
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
      </div>
    </div>
  )
}
