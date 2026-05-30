import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ background: '#0d0b14', color: '#f0f0f0', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        background: 'rgba(13,11,20,0.88)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Image src="/logo01.png" alt="Piclio" width={100} height={32} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {['Jak to funguje','Atrakce','Ceník','Kontakt'].map(l => (
            <a key={l} href={'#'+l.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'-')} style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13 }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>Přihlásit se</a>
          <Link href="/login" style={{ background: '#b7e94c', color: '#0a0a0a', textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 100 }}>Poptat akci →</Link>
        </div>
      </nav>

      {/* HERO — fullscreen */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
        <Image src="/demo/Hero-01.png" alt="Fotograf na eventu" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,11,20,0.1) 0%, rgba(13,11,20,0.35) 45%, rgba(13,11,20,0.92) 78%, rgba(13,11,20,0.99) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 64px 64px' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500, margin: '0 0 20px' }}>PICLIO BY LUCIFERA · KAMPA, PRAHA</p>
            <h1 style={{ fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 36px' }}>
              Akce skončí.<br />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>Zážitek</span><br />
              zůstane.
            </h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/login" style={{ background: '#b7e94c', color: '#0a0a0a', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '14px 30px', borderRadius: 100, display: 'inline-block' }}>Poptat akci →</Link>
              <a href="#jak-to-funguje" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, padding: '14px 30px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)', display: 'inline-block' }}>Jak to funguje</a>
            </div>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: 320, margin: '0 0 16px' }}>Fotky v telefonu každého hosta — automaticky, celý večer. Bez aplikace. Bez čekání.</p>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
              <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.12)' }} />SCROLL
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
      </section>

      {/* PROBLÉM */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #13102a 0%, #1a1625 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PROBLÉM KTERÝ ŘEŠÍME</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 60px' }}>
            Konec éry<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>„Kdy už mi pošleš ty fotky?"</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
            {[
              { n: '01', title: 'Týdny čekání', desc: 'Fotky se doručují na USB discích nebo přes hromadné odkazy dlouho po opadnutí emocí z akce.' },
              { n: '02', title: 'Složité hledání', desc: 'Zdlouhavé scrollování stovkami cizích tváří v nepřehledných sdílených galeriích.' },
              { n: '03', title: 'Narušení zábavy', desc: 'Dlouhé fronty u statických fotokoutků se základní webkamerou a neosobním přístupem.' },
            ].map(c => (
              <div key={c.n} style={{ background: 'linear-gradient(135deg, #13102a 0%, #1a1625 100%)', padding: '40px 32px' }}>
                <div style={{ fontSize: 64, fontWeight: 800, color: 'rgba(183,233,76,0.06)', lineHeight: 1, marginBottom: 20 }}>{c.n}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE — kiosk demo */}
      <section id="jak-to-funguje" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '85vh' }}>
        <div style={{ padding: '80px 64px', background: '#0d0b14', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PICLIO KIOSK · JAK TO FUNGUJE</p>
          <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 50px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            Jednou zadáte e-mail.<br />
            <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Zbytek udělá Piclio.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: '0 0 40px', maxWidth: 400 }}>
            Host se zaregistruje u kiosku na vstupu. Od té chvíle mu každá nová fotka přibývá do galerie automaticky — celý večer, v reálném čase.
          </p>
          {[
            { n: '01', title: 'Registrace u kiosku', desc: 'E-mail u kiosku na vstupu nebo přes QR kód. Jednou a naposledy.' },
            { n: '02', title: 'Fotograf fotí volně', desc: 'Pohybuje se v davu, zachycuje přirozené momenty. Profesionální technika.' },
            { n: '03', title: 'AI spáruje do 30 sekund', desc: 'Fotka automaticky přibude do galerie hosta. Bez obsluhy.' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 20px', marginBottom: 10, background: 'rgba(45,31,78,0.3)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'rgba(183,233,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#b7e94c' }}>{step.n}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a1232 0%, #0d0b14 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 260, background: '#0d0b14', borderRadius: 24, padding: '32px 24px', border: '1px solid rgba(183,233,76,0.15)', textAlign: 'center', boxShadow: '0 0 60px rgba(45,31,78,0.6)' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Piclio<span style={{ width: 6, height: 6, background: '#b7e94c', borderRadius: '50%', display: 'inline-block', marginLeft: 2, verticalAlign: 'super' }}></span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 24, lineHeight: 1.5 }}>Zadejte svůj e-mail<br />pro příjem fotek z večera</div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 10, textAlign: 'left', border: '1px solid rgba(255,255,255,0.08)' }}>vas@email.cz</div>
              <div style={{ background: '#b7e94c', color: '#0a0a0a', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 700 }}>Pokračovat →</div>
              <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b7e94c' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['01','02','03','04'].map(n => (
                <div key={n} style={{ width: 52, height: 52, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#0a0a0a' }}>{n}</div>
              ))}
            </div>
            <div style={{ background: 'rgba(20,14,38,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '12px 18px', width: '100%' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 5, letterSpacing: '0.08em', fontWeight: 500 }}>NOVÁ FOTKA · PRÁVĚ TEĎ</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#b7e94c', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, background: '#b7e94c', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}></span>
                Přibyla do vaší galerie automaticky
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE STRIP */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ aspectRatio: '3/4', background: i % 2 === 0 ? '#1a1232' : '#13102a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 28, opacity: 0.12 }}>📷</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>FOTO Z EVENTU</div>
          </div>
        ))}
      </section>

      {/* ATRAKCE */}
      <section id="atrakce" style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #13102a 0%, #0d0b14 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>ZÁŽITKOVÉ FOTOATRAKCE</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 48px' }}>
            Fotografie která baví.<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Hosté stojí ve frontě zpátky.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { badge: 'BESTSELLER', featured: true, name: 'AI Magic Corner', desc: 'Z hosta superhrdina, astronaut nebo postava z jiného světa. Generativní AI přemění kohokoli v reálném čase. Fyzický tisk jako památka.', price: 'od 15 000 Kč', sub: '3 hodiny · obsluha v ceně · okamžitý tisk' },
              { badge: 'FULL SERVICE', featured: false, name: 'Fotoreportáž Piclio', desc: 'Živý fotograf se pohybuje v davu, zachycuje přirozené momenty. Každá fotka putuje do galerie hosta automaticky.', price: 'od 17 000 Kč', sub: '4 hodiny · AI doručení v ceně' },
              { badge: 'ZÁBAVA', featured: false, name: 'Fotokoutek a scény', desc: 'Od Green Screenu po fyzicky postavené dekorace. Scény které ladí s tématem vaší akce.', price: 'od 7 500 Kč', sub: '3 hodiny · digitální i fyzický výstup' },
              { badge: 'NA MÍRU', featured: false, name: 'Prémiová scéna', desc: 'Specifické téma, brand nebo vize? Postavíme scénu přesně podle vás. Extra světlo, extra technologie.', price: 'od 21 000 Kč', sub: 'Individuální nabídka' },
            ].map(a => (
              <div key={a.name} style={{ background: a.featured ? 'linear-gradient(135deg, #1e1640 0%, #13102a 100%)' : 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 40, border: a.featured ? '1px solid rgba(183,233,76,0.25)' : '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'inline-block', fontSize: 10, letterSpacing: '0.12em', fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: a.featured ? '#b7e94c' : 'rgba(183,233,76,0.1)', color: a.featured ? '#0a0a0a' : '#b7e94c', marginBottom: 20 }}>{a.badge}</div>
                <h3 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em' }}>{a.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>{a.desc}</p>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{a.price}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{a.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CENÍK SAAS */}
      <section id="ceník" style={{ padding: '100px 48px', background: '#0d0b14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PRO FOTOGRAFY · SAAS</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>Platforma pro fotografy.</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 240, textAlign: 'right', lineHeight: 1.6, margin: 0 }}>Využijte vlastní techniku. Překvapte klienty bleskovým doručením.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { tag: 'STARTER', price: '990 Kč', period: 'za event · 100 hostů', features: ['AI Face Recognition','Soukromé galerie hostů','QR kód + e-mail'], pop: false },
              { tag: '★ PRO EVENT', price: '2 490 Kč', period: 'za event · 500 hostů', features: ['AI Face Recognition','White label galerie','Dashboard fotografa','Slideshow projekce'], pop: true },
              { tag: 'MĚSÍČNÍ', price: '2 990 Kč', period: 'měsíčně · neomezené akce', features: ['Neomezené akce','10 000 fotek / měsíc','Prioritní podpora'], pop: false },
              { tag: 'ROČNÍ', price: '24 900 Kč', period: 'ročně · vše neomezené', features: ['API přístup','White label','Custom integrace','Dedicated support'], pop: false },
            ].map(p => (
              <div key={p.tag} style={{ background: p.pop ? 'linear-gradient(135deg, #1e1640 0%, #13102a 100%)' : 'rgba(255,255,255,0.03)', border: p.pop ? '1px solid rgba(183,233,76,0.35)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', fontWeight: 600, color: p.pop ? '#b7e94c' : 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{p.tag}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>{p.period}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#b7e94c', fontWeight: 700, flexShrink: 0 }}>—</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 100, fontSize: 13, fontWeight: p.pop ? 700 : 500, textDecoration: 'none', background: p.pop ? '#b7e94c' : 'transparent', color: p.pop ? '#0a0a0a' : 'rgba(255,255,255,0.6)', border: p.pop ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>Začít →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#b7e94c', borderRadius: 28, padding: '80px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', fontWeight: 800, lineHeight: 1.05, color: '#0a0a0a', letterSpacing: '-0.04em', margin: 0, maxWidth: 480 }}>Vaši hosté si zaslouží víc než USB disk.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end' }}>
            <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.55)', textAlign: 'right', lineHeight: 1.7, margin: 0 }}>Pro firmy, event agentury<br />i profesionální fotografy.<br />Praha a celá ČR.</p>
            <Link href="/login" style={{ background: '#0d0b14', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, padding: '14px 28px', borderRadius: 100, display: 'inline-block' }}>Nezávazná poptávka →</Link>
            <a href="mailto:ahoj@piclio.cz" style={{ color: 'rgba(10,10,10,0.5)', textDecoration: 'none', fontSize: 13, padding: '14px 28px', borderRadius: 100, border: '1.5px solid rgba(10,10,10,0.2)', display: 'inline-block' }}>ahoj@piclio.cz</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%' }}>
        <Image src="/logo01.png" alt="Piclio" width={80} height={26} style={{ objectFit: 'contain' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>ahoj@piclio.cz · +420 604 750 776</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', marginTop: 4 }}>© 2026 Lucifera Studio · Kampa, Praha</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Jak to funguje','Atrakce','Ceník'].map(l => (
            <a key={l} href={'#'+l.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ /g,'-')} style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}
