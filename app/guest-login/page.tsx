'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function GuestLoginPage() {
  const router = useRouter()

  const [guestMode, setGuestMode] = useState<'email' | 'badge'>('email')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestBadge, setGuestBadge] = useState('')
  const [guestEvent, setGuestEvent] = useState('')
  const [guestError, setGuestError] = useState('')
  const [guestLoading, setGuestLoading] = useState(false)

  async function handleGuestSearch(e: React.FormEvent) {
    e.preventDefault()
    setGuestLoading(true); setGuestError('')
    const payload = guestMode === 'badge'
      ? { badgeNumber: guestBadge, eventName: guestEvent }
      : { email: guestEmail, eventName: guestEvent }
    const res = await fetch('/api/find-gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const d = await res.json()
    if (d.found && d.galleryToken) {
      router.push(`/gallery/${d.galleryToken}`)
    } else {
      setGuestError(
        guestMode === 'badge'
          ? 'Číslo odznaku nenalezeno. Zkontrolujte číslo nebo se zaregistrujte u vchodu.'
          : 'Email nenalezen. Zkontrolujte adresu nebo se zaregistrujte u vchodu.'
      )
    }
    setGuestLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1225',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '48px 20px 64px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <style>{`
        .login-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: white;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .login-input:focus { border-color: #b7e94c; }
        .login-input::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>

      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <Image src="/logo01.png" alt="Piclio" width={140} height={47} priority />
      </div>

      {/* Karta Hosté */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16, padding: '28px 24px', width: '100%', maxWidth: 400,
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            Hosté
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Hledat fotografie</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            {guestMode === 'email' ? 'Zadejte email použitý při registraci' : 'Zadejte číslo odznaku z registrace'}
          </p>
        </div>

        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.06)',
          borderRadius: 10, padding: 3, marginBottom: 16,
        }}>
          {(['email', 'badge'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => { setGuestMode(mode); setGuestError('') }}
              style={{
                flex: 1, padding: '7px 0', fontSize: 13, fontWeight: 600,
                border: 'none', borderRadius: 8, cursor: 'pointer',
                transition: 'all 0.15s',
                background: guestMode === mode ? '#b7e94c' : 'transparent',
                color: guestMode === mode ? '#1a1225' : 'rgba(255,255,255,0.45)',
              }}
            >
              {mode === 'email' ? 'Email' : 'Číslo odznaku'}
            </button>
          ))}
        </div>

        <form onSubmit={handleGuestSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guestMode === 'email' ? (
            <input
              className="login-input" type="email" required
              placeholder="váš@email.cz" value={guestEmail}
              onChange={e => { setGuestEmail(e.target.value); setGuestError('') }}
            />
          ) : (
            <input
              className="login-input" type="number" required
              placeholder="např. 42" value={guestBadge} min="1"
              onChange={e => { setGuestBadge(e.target.value); setGuestError('') }}
            />
          )}
          <input
            className="login-input" type="text"
            placeholder="název akce (nepovinné)" value={guestEvent}
            onChange={e => setGuestEvent(e.target.value)}
          />
          {guestError && (
            <div style={{ fontSize: 13, color: '#ff6b6b', padding: '4px 0' }}>{guestError}</div>
          )}
          <button type="submit" disabled={guestLoading} style={{
            background: 'transparent',
            color: guestLoading ? 'rgba(255,255,255,0.4)' : 'white',
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700,
            cursor: guestLoading ? 'not-allowed' : 'pointer', marginTop: 4,
            transition: 'border-color 0.15s',
          }}>
            {guestLoading ? 'Hledám…' : 'Hledat →'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>
          Piclio by Lucifera Studio
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}>
          Používáním Piclia souhlasíte s{' '}
          <a href="/obchodni-podminky" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>
            Obchodními podmínkami
          </a>
          {' '}a{' '}
          <a href="/gdpr" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>
            Zásadami ochrany osobních údajů
          </a>
        </div>
      </div>
    </div>
  )
}
