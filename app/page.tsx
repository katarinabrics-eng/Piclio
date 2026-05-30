import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#f0f0f0', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Image src="/logo01.png" alt="Piclio" width={100} height={32} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="https://www.piclio.cz/login" style={{
            color: '#d0d0d0', textDecoration: 'none', fontSize: 14, fontWeight: 500,
            padding: '8px 16px', borderRadius: 8, transition: 'color 0.2s',
          }}>
            Přihlásit se
          </a>
          <Link href="/login" style={{
            background: '#b7e94c', color: '#0a0a0a', textDecoration: 'none',
            fontSize: 14, fontWeight: 700, padding: '9px 20px', borderRadius: 8,
          }}>
            Začít zdarma
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '100px 40px 60px',
        gap: 60,
        maxWidth: 1200, margin: '0 auto',
      }}>
        {/* Left */}
        <div style={{ flex: '1 1 480px', maxWidth: 540 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(183,233,76,0.12)',
            color: '#b7e94c', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
            padding: '6px 14px', borderRadius: 20, marginBottom: 28,
            border: '1px solid rgba(183,233,76,0.25)',
          }}>
            FOTOGRAFICKÉ UDÁLOSTI
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.1,
            color: '#ffffff', margin: '0 0 24px',
          }}>
            Fotky každému hostu{' '}
            <span style={{ color: '#b7e94c' }}>okamžitě.</span>
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.7, color: '#b0b0b0',
            margin: '0 0 40px', maxWidth: 460,
          }}>
            Piclio rozpozná tváře a doručí každému hostu právě jeho fotky —
            přímo na telefon, ještě během večera. Žádné čekání, žádné prohledávání.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              background: '#b7e94c', color: '#0a0a0a', textDecoration: 'none',
              fontSize: 16, fontWeight: 700, padding: '14px 32px', borderRadius: 10,
              display: 'inline-block',
            }}>
              Vyzkoušet zdarma
            </Link>
            <a href="#jak-to-funguje" style={{
              color: '#e0e0e0', textDecoration: 'none',
              fontSize: 16, fontWeight: 500, padding: '14px 24px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'inline-block',
            }}>
              Jak to funguje →
            </a>
          </div>
        </div>

        {/* Right — hero image */}
        <div style={{ flex: '1 1 480px', position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
          <Image
            src="/demo/Hero-01.png"
            alt="Fotograf na eventu sdílí fotky hostům"
            width={620}
            height={480}
            style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 16, display: 'block' }}
            priority
          />
          {/* floating badge */}
          <div style={{
            position: 'absolute', bottom: 24, left: 24,
            background: 'rgba(10,10,10,0.82)', backdropFilter: 'blur(10px)',
            borderRadius: 12, padding: '12px 18px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ color: '#b7e94c', fontSize: 22, fontWeight: 800, lineHeight: 1 }}>98 %</div>
            <div style={{ color: '#c0c0c0', fontSize: 12, marginTop: 4 }}>hostů dostane fotky do 30 minut</div>
          </div>
        </div>
      </section>

      {/* ── JAK TO FUNGUJE ── */}
      <section id="jak-to-funguje" style={{
        padding: '100px 40px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#b7e94c', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 16 }}>
              JAK TO FUNGUJE
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Tři kroky. Žádná práce navíc.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              {
                num: '01',
                title: 'Fotografujete normálně',
                text: 'Fotíte jako vždy. Piclio běží na pozadí — průběžně nahrává a zpracovává fotky v reálném čase.',
              },
              {
                num: '02',
                title: 'Hosté naskenují QR kód',
                text: 'Na vstup nebo stůl umístíte QR kód. Host naskenuje, vyfotí se a systém ho automaticky rozpozná.',
              },
              {
                num: '03',
                title: 'Každý dostane své fotky',
                text: 'Každý host vidí jen svoje fotky. Může si je prohlédnout, stáhnout nebo sdílet — ještě ten večer.',
              },
            ].map(step => (
              <div key={step.num} style={{
                flex: '1 1 280px', maxWidth: 340,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '36px 32px',
              }}>
                <div style={{
                  fontSize: 36, fontWeight: 900, color: '#b7e94c',
                  opacity: 0.7, lineHeight: 1, marginBottom: 20,
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '0 0 12px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#a0a0a0', margin: 0 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#b7e94c', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 16 }}>
              FUNKCE
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Vše co fotograf potřebuje
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { icon: '🤖', title: 'Rozpoznávání tváří', text: 'AI automaticky přiřadí každou fotku správnému hostu. Bez ručního třídění.' },
              { icon: '📱', title: 'Galerie na telefonu', text: 'Host otevře odkaz, vidí jen svoje fotky. Žádná registrace, žádné heslo.' },
              { icon: '🎞', title: 'Živý slideshow', text: 'Promítejte fotky přímo na eventh v reálném čase. Různé layouty a animace.' },
              { icon: '⬇️', title: 'Stahování ve vysoké kvalitě', text: 'Hosté si stáhnou originální fotky v plném rozlišení jedním kliknutím.' },
              { icon: '🎨', title: 'Brandování akce', text: 'Logo, barvy, název eventu — každá akce má svoji identitu.' },
              { icon: '⚡️', title: 'Reálný čas', text: 'Nové fotky se objeví v galerii hostu během sekund od nahrání.' },
            ].map(f => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '28px 24px',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#909090', margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / CTA BANNER ── */}
      <section style={{
        padding: '0 40px 100px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          borderRadius: 20, overflow: 'hidden',
          position: 'relative', minHeight: 400,
          display: 'flex', alignItems: 'center',
        }}>
          {/* Background image */}
          <Image
            src="/demo/hero-02.png"
            alt="Piclio v akci"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(10,10,10,0.92) 45%, rgba(10,10,10,0.3) 100%)',
          }} />
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, padding: '60px 56px', maxWidth: 520 }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#ffffff', margin: '0 0 20px', lineHeight: 1.2 }}>
              Připraveni na první event?
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#c0c0c0', margin: '0 0 36px' }}>
              Začněte zdarma. Žádná kreditní karta, žádná smlouva.
              První akce je na nás.
            </p>
            <Link href="/login" style={{
              background: '#b7e94c', color: '#0a0a0a', textDecoration: 'none',
              fontSize: 16, fontWeight: 700, padding: '14px 32px', borderRadius: 10,
              display: 'inline-block',
            }}>
              Vytvořit první event →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        maxWidth: 1100, margin: '0 auto',
      }}>
        <Image src="/logo01.png" alt="Piclio" width={80} height={26} style={{ objectFit: 'contain' }} />
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
          © {new Date().getFullYear()} Piclio. Všechna práva vyhrazena.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/login" style={{ color: '#666', fontSize: 13, textDecoration: 'none' }}>Přihlásit se</Link>
          <a href="mailto:hello@piclio.app" style={{ color: '#666', fontSize: 13, textDecoration: 'none' }}>Kontakt</a>
        </div>
      </footer>

    </div>
  )
}
