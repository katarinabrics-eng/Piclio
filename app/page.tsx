'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const STEPS = [
  { n: '01', title: 'Host přijde ke kiosku', desc: 'Zadá e-mail a udělá rychlé selfie v prohlížeči. Žádná aplikace, žádná registrace. Připne si číslovaný odznáček.', img: '/demo/Piclio01.jpg', notif: 'E-mail zaregistrován · Galerie připravena' },
  { n: '02', title: 'Připne si číslovaný odznáček', desc: 'Každý host dostane odznáček s unikátním číslem. Záloha pro 100% přesnost — AI páruje obličej i číslo.', img: '/demo/demo-portrait.jpg', notif: 'Odznáček #014 přiřazen · Připraven k focení' },
  { n: '03', title: 'Fotograf fotí volně', desc: 'Pohybuje se v davu, zachycuje přirozené momenty. Profesionální technika, žádné fronty.', img: '/demo/Hero-01.png', notif: 'Fotka pořízena · Odesílám na server...' },
  { n: '04', title: 'Fotka přibyde do galerie', desc: 'Do 30 sekund AI rozpozná hosta a fotka se objeví v jeho soukromé galerii — ještě v sále.', img: '/demo/Piclio03.jpg', notif: 'Přibyla do vaší galerie automaticky' },
  { n: '05', title: 'Host sdílí s přáteli', desc: 'Host otevře odkaz, vidí všechny své fotky z celého večera a sdílí je okamžitě. Bez čekání, bez USB disků.', img: '/demo/demo-krajina.jpg', notif: 'Sdíleno · 3 přátelé viděli vaši fotku' },
]

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(1)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function goToStep(idx: number) {
    setActiveStep(idx + 1)
    const img = document.getElementById('step-preview-img') as HTMLImageElement
    const notifEl = document.getElementById('step-notif-text')
    if (img) img.src = STEPS[idx].img
    if (notifEl) notifEl.textContent = STEPS[idx].notif
  }

  function resetAuto() {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setActiveStep(prev => {
        const next = prev % STEPS.length
        const img = document.getElementById('step-preview-img') as HTMLImageElement
        const notifEl = document.getElementById('step-notif-text')
        if (img) img.src = STEPS[next].img
        if (notifEl) notifEl.textContent = STEPS[next].notif
        return next + 1
      })
    }, 2800)
  }

  useEffect(() => {
    resetAuto()
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ background: '#191224', color: '#f0f0f0', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>

      <style>{`
        @keyframes scroll-gallery {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gallery-track {
          display: flex;
          animation: scroll-gallery 20s linear infinite;
          width: max-content;
        }
        .gallery-track:hover { animation-play-state: paused; }

        @media (max-width: 768px) {
          .hero-content { padding: 0 24px 40px !important; }
          .hero-tag { margin-top: 80px !important; margin-bottom: 14px !important; }
          .hero-h1 { font-size: 42px !important; margin-bottom: 20px !important; }
          .hero-sub { display: none !important; }
          .hero-scroll { display: none !important; }
          .hero-btns a, .hero-btns button { padding: 12px 22px !important; font-size: 13px !important; }
          .hero-bottom { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
          .problem-grid { grid-template-columns: 1fr !important; }
          .kiosk-grid { grid-template-columns: 1fr !important; }
          .gallery-tile { width: 200px !important; height: 280px !important; }
          .atrakce-grid { grid-template-columns: 1fr !important; }
          .cenik-grid { grid-template-columns: 1fr !important; }
          .cenik-header { flex-direction: column !important; gap: 16px !important; }
          .cenik-sub { text-align: left !important; }
          .cta-inner { flex-direction: column !important; gap: 32px !important; padding: 48px 28px !important; }
          .cta-form { align-items: flex-start !important; min-width: unset !important; width: 100% !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .contact-bar { flex-direction: column !important; gap: 16px !important; }
          .footer-inner { flex-direction: column !important; gap: 20px !important; text-align: center !important; }
          .nav-links-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          .section-pad { padding: 64px 24px !important; }
        }

        @media (min-width: 769px) and (max-width: 1100px) {
          .hero-h1 { font-size: 56px !important; }
          .hero-content { padding: 0 48px 56px !important; }
          .stats-grid > div { padding: 28px 24px !important; }
          .kiosk-grid { min-height: auto !important; }
          .atrakce-grid { grid-template-columns: 1fr 1fr !important; }
          .cenik-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .section-pad { padding: 80px 32px !important; }
        }

        .nav-mobile-btn { display: none; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Image src="/logo01.png" alt="Piclio" width={100} height={32} style={{ objectFit: 'contain' }} />
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {['Jak to funguje','Atrakce','Ceník','Kontakt'].map(l => (
            <a key={l} href={'#'+l.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'-')} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13 }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>Přihlásit se</a>
          <Link href="/login" style={{ background: '#b7e94c', color: '#191224', textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 100 }}>Poptat akci →</Link>
        </div>
        <button
          className="nav-mobile-btn"
          onClick={() => {
            const menu = document.getElementById('mobile-menu')
            if (menu) menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex'
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 24, padding: 8 }}
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div id="mobile-menu" style={{
        display: 'none', flexDirection: 'column',
        position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
        background: 'rgba(25,18,36,0.98)', backdropFilter: 'blur(12px)',
        padding: '24px 24px', gap: 20,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {['Jak to funguje','Atrakce','Ceník','Kontakt'].map(l => (
          <a key={l}
            href={'#'+l.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'-')}
            onClick={() => { const m = document.getElementById('mobile-menu'); if(m) m.style.display = 'none' }}
            style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}
          >{l}</a>
        ))}
        <Link href="/login" style={{ background: '#b7e94c', color: '#191224', textDecoration: 'none', fontSize: 15, fontWeight: 700, padding: '12px 20px', borderRadius: 100, textAlign: 'center' }}>
          Poptat akci →
        </Link>
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', height: '78vh', minHeight: 520, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Image src="/demo/Hero-01.png" alt="Fotograf na eventu" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(25,18,36,0.1) 0%, rgba(25,18,36,0.35) 45%, rgba(25,18,36,0.92) 78%, rgba(25,18,36,0.99) 100%)' }} />
        <div className="hero-content hero-bottom" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 96px 52px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 620 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', fontWeight: 500, margin: '0 0 20px' }}>PICLIO BY LUCIFERA · KAMPA, PRAHA</p>
            <h1 className="hero-h1" style={{ fontSize: 'clamp(48px, 5.5vw, 82px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 28px', maxWidth: 600 }}>
              Akce skončí.<br />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>Zážitek</span><br />
              zůstane.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', margin: '0 0 36px', maxWidth: 520 }}>
              Profesionální fotky v telefonu každého hosta — doručené do 30 sekund. Bez aplikací. Bez čekání.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/login" style={{ background: '#b7e94c', color: '#191224', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '14px 30px', borderRadius: 100, display: 'inline-block' }}>Poptat akci na klíč →</Link>
              <a href="#jak-to-funguje" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, padding: '14px 30px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)', display: 'inline-block' }}>Vyzkoušet software (Beta)</a>
            </div>
          </div>
          <div className="hero-sub" style={{ textAlign: 'right', paddingBottom: 4 }}>
            <div className="hero-scroll" style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
              <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.12)' }} />SCROLL
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 1200, margin: '0 auto' }}>
          {[
            { n: '30s', l: 'OD ZÁVĚRKY K DORUČENÍ' },
            { n: '300+', l: 'HOSTŮ NA JEDNÉ AKCI' },
            { n: '52', l: 'LET ZKUŠENOSTÍ TÝMU' },
            { n: '0', l: 'STAŽENÝCH APLIKACÍ' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '36px 48px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: '#b7e94c', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLÉM */}
      <section className="section-pad" style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #1f1530 0%, #1a1625 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PROBLÉM KTERÝ ŘEŠÍME</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Konec éry<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>„Kdy už mi pošleš ty fotky?"</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 56px', maxWidth: 560 }}>
            Tradiční fotokoutky a reportáže narážejí na překážky, které Piclio odstraňuje:
          </p>
          <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
            {[
              { n: '01', title: 'Žádné týdny čekání', desc: 'Fotky nedoručujeme po akci na USB, ale v reálném čase, kdy jsou emoce nejživější.' },
              { n: '02', title: 'Žádné složité hledání', desc: 'Hosté nemusí scrollovat stovkami cizích tváří. Systém je pozná a ukáže jim v soukromé galerii jen jejich snímky.' },
              { n: '03', title: 'Žádné narušení zábavy', desc: 'Zapomeňte na fronty u statických boxů. Naši fotografové jsou v centru dění.' },
            ].map(c => (
              <div key={c.n} style={{ background: 'linear-gradient(135deg, #1f1530 0%, #1a1625 100%)', padding: '40px 32px' }}>
                <div style={{ fontSize: 64, fontWeight: 800, color: 'rgba(183,233,76,0.06)', lineHeight: 1, marginBottom: 20 }}>{c.n}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE */}
      <section id="jak-to-funguje" style={{ padding: '80px 48px', background: '#191224' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 16, fontWeight: 500 }}>JAK TO FUNGUJE</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.05 }}>
            Jednou zadáte e-mail.<br />
            <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Zbytek udělá Piclio.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 48, lineHeight: 1.6 }}>Od vstupu po sdílení — vše automaticky.</p>

          <style>{`
            .steps-accordion { display: none; }
            .steps-desktop { display: grid; }
            @media (max-width: 768px) {
              .steps-accordion { display: flex; flex-direction: column; gap: 4px; }
              .steps-desktop { display: none !important; }
              .acc-item { border-radius: 14px; overflow: hidden; }
              .acc-header { display: flex; align-items: center; gap: 14px; padding: 16px 18px; cursor: pointer; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; background: rgba(255,255,255,0.03); }
              .acc-header.open { background: rgba(183,233,76,0.07); border-color: rgba(183,233,76,0.15); border-radius: 14px 14px 0 0; }
              .acc-num { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.35); }
              .acc-num.open { background: rgba(183,233,76,0.15); color: #b7e94c; }
              .acc-title { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.5); flex: 1; }
              .acc-title.open { color: #fff; }
              .acc-chevron { color: rgba(255,255,255,0.25); font-size: 14px; }
              .acc-chevron.open { color: #b7e94c; transform: rotate(90deg); }
              .acc-body { display: none; background: rgba(255,255,255,0.02); border: 1px solid rgba(183,233,76,0.12); border-top: none; border-radius: 0 0 14px 14px; overflow: hidden; }
              .acc-body.open { display: block; }
              .acc-photo { aspect-ratio: 16/9; background: #2a1f42; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
              .acc-photo img { width: 100%; height: 100%; object-fit: cover; }
              .acc-notif { position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(25,18,36,0.92); border-radius: 10px; padding: 9px 12px; border: 1px solid rgba(255,255,255,0.08); }
              .acc-notif-top { font-size: 9px; color: rgba(255,255,255,0.3); letter-spacing: 0.07em; margin-bottom: 3px; }
              .acc-notif-val { font-size: 12px; font-weight: 600; color: #b7e94c; display: flex; align-items: center; gap: 5px; }
              .acc-notif-dot { width: 6px; height: 6px; background: #b7e94c; border-radius: 50%; flex-shrink: 0; }
              .acc-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.65; padding: 14px 18px 18px; }
            }
          `}</style>

          {/* DESKTOP — 2 sloupce */}
          <div className="steps-desktop" style={{ gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                ...STEPS
              ].map((step, i) => (
                <div
                  key={step.n}
                  onMouseEnter={() => { goToStep(i); resetAuto() }}
                  style={{
                    display: 'flex', gap: 16, padding: '20px 18px',
                    borderRadius: 14, cursor: 'pointer',
                    border: activeStep === i + 1 ? '1px solid rgba(183,233,76,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    background: activeStep === i + 1 ? 'rgba(183,233,76,0.07)' : 'transparent',
                    opacity: activeStep === i + 1 ? 1 : 0.4,
                    transition: 'all 0.2s',
                    borderLeft: activeStep === i + 1 ? '3px solid #b7e94c' : '3px solid transparent',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: activeStep === i + 1 ? 'rgba(183,233,76,0.15)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: activeStep === i + 1 ? '#b7e94c' : 'rgba(255,255,255,0.35)',
                  }}>{step.n}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: activeStep === i + 1 ? '#fff' : 'rgba(255,255,255,0.6)', marginBottom: 5 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '4/5', position: 'relative', background: '#160f28' }}>
                <img id="step-preview-img" src="/demo/Piclio01.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(25,18,36,0.92)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.08em' }}>NOVÁ FOTKA · PRÁVĚ TEĎ</div>
                  <div id="step-notif-text" style={{ fontSize: 13, fontWeight: 600, color: '#b7e94c', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, background: '#b7e94c', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}></span>
                    E-mail zaregistrován · Galerie připravena
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBIL — accordion */}
          <div className="steps-accordion">
            {[
              { n: '01', title: 'Host přijde ke kiosku', desc: 'Zadá e-mail a udělá rychlé selfie v prohlížeči. Žádná aplikace, žádná registrace. Připne si číslovaný odznáček.', img: '/demo/Piclio01.jpg', open: true },
              { n: '02', title: 'Fotograf fotí volně', desc: 'Pohybuje se v davu, zachycuje přirozené momenty. Profesionální technika, žádné fronty.', img: '/demo/Hero-01.png', open: false },
              { n: '03', title: 'AI spáruje do 30 sekund', desc: 'Systém rozpozná hosta a fotka automaticky přibude do jeho galerie.', img: '/demo/hero-02.png', open: false },
              { n: '04', title: 'Fotka přibyde do galerie', desc: 'Host vidí fotky jak přibývají — celý večer, v reálném čase.', img: '/demo/Piclio03.jpg', open: false },
              { n: '05', title: 'Host sdílí s přáteli', desc: 'Otevře odkaz a sdílí okamžitě. Bez čekání, bez USB disků.', img: '/demo/demo-krajina.jpg', open: false },
            ].map((step) => (
              <div key={step.n} className="acc-item">
                <div
                  className={`acc-header ${step.open ? 'open' : ''}`}
                  onClick={(e) => {
                    const item = (e.currentTarget as HTMLElement).closest('.acc-item')!
                    const body = item.querySelector('.acc-body') as HTMLElement
                    const isOpen = body.classList.contains('open')
                    document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'))
                    document.querySelectorAll('.acc-header').forEach(h => h.classList.remove('open'))
                    document.querySelectorAll('.acc-num').forEach(n => n.classList.remove('open'))
                    document.querySelectorAll('.acc-title').forEach(t => t.classList.remove('open'))
                    document.querySelectorAll('.acc-chevron').forEach(c => c.classList.remove('open'))
                    if (!isOpen) {
                      body.classList.add('open')
                      e.currentTarget.classList.add('open')
                      item.querySelector('.acc-num')?.classList.add('open')
                      item.querySelector('.acc-title')?.classList.add('open')
                      item.querySelector('.acc-chevron')?.classList.add('open')
                    }
                  }}
                >
                  <div className={`acc-num ${step.open ? 'open' : ''}`}>{step.n}</div>
                  <div className={`acc-title ${step.open ? 'open' : ''}`}>{step.title}</div>
                  <span className={`acc-chevron ${step.open ? 'open' : ''}`}>▶</span>
                </div>
                <div className={`acc-body ${step.open ? 'open' : ''}`}>
                  <div className="acc-photo">
                    <img src={step.img} alt={step.title} />
                    <div className="acc-notif">
                      <div className="acc-notif-top">NOVÁ FOTKA · PRÁVĚ TEĎ</div>
                      <div className="acc-notif-val"><span className="acc-notif-dot"></span>Přibyla do vaší galerie automaticky</div>
                    </div>
                  </div>
                  <div className="acc-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE STRIP */}
      <section style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="gallery-track">
          {[
            '/demo/Hero-01.png',
            '/demo/demo-portrait.jpg',
            '/demo/Piclio01.jpg',
            '/demo/hero-02.png',
            '/demo/Piclio03.jpg',
            '/demo/demo-krajina.jpg',
            '/demo/Piclio05.jpg',
            '/demo/Piclio-event01.png',
            '/demo/Hero-01.png',
            '/demo/demo-portrait.jpg',
            '/demo/Piclio01.jpg',
            '/demo/hero-02.png',
            '/demo/Piclio03.jpg',
            '/demo/demo-krajina.jpg',
            '/demo/Piclio05.jpg',
            '/demo/Piclio-event01.png',
          ].map((src, i) => (
            <div key={i} className="gallery-tile" style={{ width: 280, height: 380, flexShrink: 0, marginRight: 3, position: 'relative', overflow: 'hidden' }}>
              <Image src={src} alt="Foto z eventu" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ATRAKCE */}
      <section id="atrakce" className="section-pad" style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #1f1530 0%, #191224 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>ZÁŽITKOVÉ FOTOSLUŽBY NA KLÍČ</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 48px' }}>
            Profesionální produkce<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>pro váš event.</span>
          </h2>
          <div className="atrakce-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { badge: 'BESTSELLER', featured: true, name: 'The AI Magic Corner', desc: 'Náš bestseller. Generativní AI v reálném čase promění hosty v hrdiny nebo je přenese do jiných světů. Zahrnuje technika, obsluhu a okamžitý tisk.', price: '19 000 Kč', sub: '3 hodiny · obsluha v ceně · okamžitý tisk' },
              { badge: 'FULL SERVICE', featured: false, name: 'Fotoreportáž Piclio', desc: 'Živý fotograf zachycuje autentické emoce přímo v davu. Zahrnuje unikátní hybridní identifikační systém (Face Recognition + ID jmenovky pro 100% spolehlivost), hosting a individuální grafiku galerie.', price: '21 000 Kč', sub: '4 hodiny · AI doručení v ceně' },
              { badge: 'NA MÍRU', featured: false, name: 'Prémiová reálná scéna', desc: 'Mobilní studio s fyzicky postavenou scénou a profesionálním nasvícením na míru vašemu tématu (Gatsby, džungle, brand).', price: 'od 25 000 Kč', sub: 'Individuální nabídka' },
              { badge: 'DOPLNĚK', featured: false, name: 'Živé promítání', desc: 'Okamžitý přenos právě pořízených fotografií na obrazovky v sále pro maximální zapojení publika.', price: 'od 4 900 Kč', sub: 'Lze přidat k libovolnému balíčku' },
            ].map(a => (
              <div key={a.name} style={{ background: a.featured ? 'linear-gradient(135deg, #1e1640 0%, #1f1530 100%)' : 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 40, border: a.featured ? '1px solid rgba(183,233,76,0.25)' : '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'inline-block', fontSize: 10, letterSpacing: '0.12em', fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: a.featured ? '#b7e94c' : 'rgba(183,233,76,0.1)', color: a.featured ? '#191224' : '#b7e94c', marginBottom: 20 }}>{a.badge}</div>
                <h3 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em' }}>{a.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>{a.desc}</p>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{a.price}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{a.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '36px 40px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', color: '#b7e94c', fontWeight: 600, margin: '0 0 16px' }}>BALÍČKY OKAMŽITÉHO TISKU · termosublimační tisk přímo na místě</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { tag: 'S', desc: 'do 200 ks fotek', price: '3 000 Kč' },
                { tag: 'M', desc: 'do 500 ks fotek', price: '6 500 Kč' },
                { tag: 'L', desc: 'do 1 000 ks fotek', price: '11 000 Kč' },
              ].map(t => (
                <div key={t.tag} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(183,233,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#b7e94c', flexShrink: 0 }}>{t.tag}</div>
                  <div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>{t.desc}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{t.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CENÍK SAAS */}
      <section id="ceník" style={{ padding: '100px 48px', background: '#0d0b14' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="kiosk-grid">

            {/* Levá strana — text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(183,233,76,0.1)', border: '1px solid rgba(183,233,76,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
                <span style={{ width: 7, height: 7, background: '#b7e94c', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ fontSize: 11, color: '#b7e94c', fontWeight: 600, letterSpacing: '0.12em' }}>PRÁVĚ PŘIPRAVUJEME · BRZY SPOUŠTÍME</span>
              </div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 20px' }}>
                Buďte mezi prvními.<br />
                <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Za zvýhodněných podmínek.</span>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 440 }}>
                Piclio SaaS platforma pro fotografy je v závěrečné fázi vývoje. Máte jedinečnou příležitost být jedni z prvních, kteří ji vyzkouší — a získat přístup za speciálních podmínek.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
                {[
                  'Přístup do beta verze ještě před veřejným spuštěním',
                  'Zvýhodněná cena platná napořád pro early adopters',
                  'Přímý vliv na vývoj — vaše zpětná vazba formuje produkt',
                  'Osobní onboarding a podpora od našeho týmu',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(183,233,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: '#b7e94c', fontWeight: 700 }}>✓</span>
                    </span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="mailto:ahoj@piclio.cz?subject=Zájem o beta přístup Piclio SaaS" style={{
                display: 'inline-block', background: '#b7e94c', color: '#0d0b14',
                padding: '14px 32px', borderRadius: 100, fontSize: 14, fontWeight: 700,
                textDecoration: 'none', letterSpacing: '0.01em',
              }}>
                Mám zájem o beta přístup →
              </a>
            </div>

            {/* Pravá strana — Kristína karta */}
            <div style={{
              background: 'linear-gradient(135deg, #231845 0%, #1a1232 100%)',
              border: '1px solid rgba(183,233,76,0.2)',
              borderRadius: 28, padding: '40px 36px',
            }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#b7e94c', fontWeight: 500, marginBottom: 28 }}>VÁŠ KONTAKT PRO FOTOGRAFY</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
                <img src="/demo/kristina.png" alt="Kristína" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '2px solid rgba(183,233,76,0.25)' }} />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Kristína</div>
                  <div style={{ fontSize: 12, color: '#b7e94c', fontWeight: 500 }}>Péče o zákazníka · Koordinace</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 28px' }}>
                Ráda vám sdělí vše o tom, jak vám Piclio může pomoci. Domluvíme se na podmínkách přímo pro vás.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="mailto:ahoj@piclio.cz?subject=Zájem o Piclio SaaS pro fotografy" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(183,233,76,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '14px 18px', textDecoration: 'none',
                }}>
                  <span style={{ fontSize: 16 }}>✉</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>E-MAIL</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>ahoj@piclio.cz</div>
                  </div>
                </a>
                <a href="tel:+420604750776" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(183,233,76,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '14px 18px', textDecoration: 'none',
                }}>
                  <span style={{ fontSize: 16 }}>📞</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>TELEFON</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>+420 604 750 776</div>
                  </div>
                </a>
              </div>
              <div style={{ marginTop: 24, padding: '14px 16px', background: 'rgba(183,233,76,0.06)', borderRadius: 12, border: '1px solid rgba(183,233,76,0.12)' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  💬 <em>&quot;Napište nám a domluvíme se na podmínkách — osobně, bez automatů.&quot;</em>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SROVNÁNÍ */}
      <section className="section-pad" style={{ padding: '80px 48px', background: 'linear-gradient(135deg, #1f1530 0%, #191224 100%)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PROČ PICLIO?</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 40px' }}>Vlastnost po vlastnosti.</h2>
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ padding: '16px 28px', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', fontWeight: 600 }}>VLASTNOST</div>
              <div style={{ padding: '16px 28px', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>BĚŽNÝ FOTOKOUTEK</div>
              <div style={{ padding: '16px 28px', fontSize: 11, color: '#b7e94c', letterSpacing: '0.1em', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>PICLIO BY LUCIFERA</div>
            </div>
            {[
              { prop: 'Doručení fotek', old: 'USB po akci / hledání v galerii', new: 'Okamžitě do telefonu' },
              { prop: 'Identifikace hostů', old: 'Ruční zadávání / žádná', new: 'Face Recognition + Hybrid ID' },
              { prop: 'Způsob fotografování', old: 'Statické místo v rohu', new: 'Mobilní studio v centru dění' },
              { prop: 'AI Magie', old: 'Statický Green Screen', new: 'Generativní AI v reálném čase' },
            ].map((r, i) => (
              <div key={r.prop} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <div style={{ padding: '18px 28px', fontSize: 14, fontWeight: 600, color: '#e0e0e0' }}>{r.prop}</div>
                <div style={{ padding: '18px 28px', fontSize: 13, color: 'rgba(255,255,255,0.35)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>{r.old}</div>
                <div style={{ padding: '18px 28px', fontSize: 13, color: '#b7e94c', fontWeight: 500, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>{r.new}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÝM */}
      <section className="section-pad" style={{ padding: '100px 48px', background: '#191224', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>O NÁS</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            52 let zkušeností.<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Nejsme jen agentura, jsme studio.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 64px', maxWidth: 540 }}>
            Za projektem stojí duo z ateliéru na Kampě, které spojuje precizní práci se světlem a moderní AI digitální ekosystém.
          </p>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { name: 'Katarína', role: 'Obraz · Strategie · AI', desc: '26 let vizuální tvorby. Propojuje fotografii s AI technologiemi, aby klientům šetřila čas při tvorbě obsahu.', foto: '/demo/katarina.png' },
              { name: 'Luboš', role: 'Světlo · Kompozice · Technologie', desc: '26 let ve fotografii a filmu. Technický expert, který ručí za to, že každý výstup bude vypadat profesionálně.', foto: '/demo/lubos.png' },
              { name: 'Kristína', role: 'Péče o zákazníka · Koordinace', desc: 'Vaše hlavní spojka s projektem. Stará se o průběh akce, zákazníky a brand DNA.', foto: '/demo/kristina.png' },
            ].map(p => (
              <div key={p.name} style={{ background: 'linear-gradient(135deg, #251840 0%, #1f1530 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '36px 32px' }}>
                <img src={p.foto} alt={p.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', marginBottom: 20, border: '2px solid rgba(183,233,76,0.2)', display: 'block' }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#b7e94c', marginBottom: 16, letterSpacing: '0.03em', fontWeight: 500 }}>{p.role}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="contact-bar" style={{ marginTop: 48, padding: '32px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Lucifera Studio</div>
              <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>Kampa, Praha</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>E-mail</div>
              <a href="mailto:ahoj@piclio.cz" style={{ fontSize: 15, color: '#b7e94c', textDecoration: 'none', fontWeight: 500 }}>ahoj@piclio.cz</a>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Telefon</div>
              <a href="tel:+420604750776" style={{ fontSize: 15, color: '#fff', textDecoration: 'none', fontWeight: 500 }}>+420 604 750 776</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 48px 80px' }}>
        <div className="cta-inner" style={{ maxWidth: 1200, margin: '0 auto', background: '#b7e94c', borderRadius: 28, padding: '80px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', fontWeight: 800, lineHeight: 1.05, color: '#191224', letterSpacing: '-0.04em', margin: 0, maxWidth: 480 }}>Udělejte z vaší další akce zážitek, o kterém se bude mluvit.</h2>
          <div className="cta-form" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', minWidth: 340 }}>
            <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.55)', textAlign: 'right', lineHeight: 1.7, margin: 0 }}>
              Pro firmy, event agentury<br />i profesionální fotografy.<br />Praha a celá ČR.
            </p>
            <input type="text" placeholder="Vaše jméno" style={{ width: '100%', padding: '12px 18px', borderRadius: 12, border: '1.5px solid rgba(10,10,10,0.15)', background: 'rgba(255,255,255,0.6)', fontSize: 14, outline: 'none', color: '#191224', backdropFilter: 'blur(8px)' }} />
            <input type="email" placeholder="Váš e-mail" style={{ width: '100%', padding: '12px 18px', borderRadius: 12, border: '1.5px solid rgba(10,10,10,0.15)', background: 'rgba(255,255,255,0.6)', fontSize: 14, outline: 'none', color: '#191224', backdropFilter: 'blur(8px)' }} />
            <textarea placeholder="Popište vaši akci — datum, počet hostů, typ eventu..." rows={3} style={{ width: '100%', padding: '12px 18px', borderRadius: 12, border: '1.5px solid rgba(10,10,10,0.15)', background: 'rgba(255,255,255,0.6)', fontSize: 14, outline: 'none', color: '#191224', resize: 'none', fontFamily: 'inherit', backdropFilter: 'blur(8px)' }} />
            <button
              onClick={() => {
                const name = (document.querySelector('input[placeholder="Vaše jméno"]') as HTMLInputElement)?.value
                const email = (document.querySelector('input[placeholder="Váš e-mail"]') as HTMLInputElement)?.value
                const msg = (document.querySelector('textarea') as HTMLTextAreaElement)?.value
                window.location.href = `mailto:ahoj@piclio.cz?subject=Poptávka od ${name}&body=Jméno: ${name}%0AE-mail: ${email}%0A%0A${msg}`
              }}
              style={{ width: '100%', padding: '14px 28px', borderRadius: 100, background: '#191224', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', letterSpacing: '0.01em' }}
            >
              Odeslat poptávku →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Image src="/logo01.png" alt="Piclio" width={80} height={26} style={{ objectFit: 'contain', display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Piclio by Lucifera – Vaše značka a zážitky v novém světle.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>ahoj@piclio.cz · +420 604 750 776</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', marginTop: 4 }}>© 2026 Studio Lucifera · Kampa, Praha</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Jak to funguje','Atrakce','Ceník'].map(l => (
              <a key={l} href={'#'+l.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'-')} style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
        </div>
      </footer>

    </div>
  )
}
