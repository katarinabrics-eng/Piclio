'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ background: '#191224', color: '#f0f0f0', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
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
          <Link href="/login" style={{ background: '#b7e94c', color: '#191224', textDecoration: 'none', fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 100 }}>Poptat akci →</Link>
        </div>
      </nav>

      {/* HERO — fullscreen */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
        <Image src="/demo/Hero-01.png" alt="Fotograf na eventu" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(25,18,36,0.1) 0%, rgba(25,18,36,0.35) 45%, rgba(25,18,36,0.92) 78%, rgba(25,18,36,0.99) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 64px 64px' }}>
          <div style={{ maxWidth: 620 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', fontWeight: 500, margin: '0 0 20px' }}>PICLIO BY LUCIFERA · KAMPA, PRAHA</p>
            <h1 style={{ fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 28px' }}>
              Akce skončí.<br />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>Zážitek</span><br />
              zůstane.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', margin: '0 0 14px', maxWidth: 520 }}>
              Profesionální fotky v telefonu každého hosta — doručené do 30 sekund. Bez aplikací. Bez čekání.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.4)', margin: '0 0 36px', maxWidth: 500 }}>
              Piclio by Lucifera boří staré pořádky v eventové fotografii. Propojujeme 52 let vizuálních zkušeností s nejmodernější AI technologií, která doručí emoce přímo tam, kde je hosté chtějí mít — hned teď do jejich soukromé galerie.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/login" style={{ background: '#b7e94c', color: '#191224', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '14px 30px', borderRadius: 100, display: 'inline-block' }}>Poptat akci na klíč →</Link>
              <a href="#jak-to-funguje" style={{ color: '#fff', textDecoration: 'none', fontSize: 14, padding: '14px 30px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)', display: 'inline-block' }}>Vyzkoušet software (Beta)</a>
            </div>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
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
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #1f1530 0%, #1a1625 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PROBLÉM KTERÝ ŘEŠÍME</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Konec éry<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>„Kdy už mi pošleš ty fotky?"</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 56px', maxWidth: 560 }}>
            Tradiční fotokoutky a reportáže narážejí na překážky, které Piclio odstraňuje:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
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

      {/* JAK TO FUNGUJE — kiosk demo */}
      <section id="jak-to-funguje" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '85vh' }}>
        <div style={{ padding: '80px 64px', background: '#191224', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>TECHNOLOGIE KTERÁ NEPŘEKÁŽÍ ZÁBAVĚ</p>
          <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 50px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 20px' }}>
            Jednou zadáte e-mail.<br />
            <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Zbytek udělá Piclio.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: '0 0 40px', maxWidth: 400 }}>
            Host se zaregistruje u kiosku na vstupu. Od té chvíle mu každá nová fotka přibývá do galerie automaticky — celý večer, v reálném čase.
          </p>
          {[
            { n: '01', title: 'Registrace bez aplikací', desc: 'Host naskenuje QR kód nebo zadá e-mail u kiosku a pořídí si rychlé „magické" selfie v prohlížeči.' },
            { n: '02', title: 'Akce a momentky', desc: 'Fotograf fotí v davu nebo hosté pózují v AI koutku. Data putují přes WiFi okamžitě na server.' },
            { n: '03', title: 'AI párování do 30 sekund', desc: 'Systém pomocí Face Recognition rozpozná hosta a doručí fotku do jeho unikátní galerie.' },
            { n: '04', title: 'GDPR Native', desc: 'Selfie slouží pouze k vytvoření digitálního otisku a ihned se maže. Data jsou bezpečně hostována v EU.' },
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

        <div style={{ background: 'linear-gradient(135deg, #251840 0%, #191224 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 260, background: '#191224', borderRadius: 24, padding: '32px 24px', border: '1px solid rgba(183,233,76,0.15)', textAlign: 'center', boxShadow: '0 0 60px rgba(45,31,78,0.6)' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Piclio<span style={{ width: 6, height: 6, background: '#b7e94c', borderRadius: '50%', display: 'inline-block', marginLeft: 2, verticalAlign: 'super' }}></span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 24, lineHeight: 1.5 }}>Zadejte svůj e-mail<br />pro příjem fotek z večera</div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 10, textAlign: 'left', border: '1px solid rgba(255,255,255,0.08)' }}>vas@email.cz</div>
              <div style={{ background: '#b7e94c', color: '#191224', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 700 }}>Pokračovat →</div>
              <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b7e94c' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['01','02','03','04'].map(n => (
                <div key={n} style={{ width: 52, height: 52, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#191224' }}>{n}</div>
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
      <section style={{ overflow: 'hidden', position: 'relative' }}>
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
          .gallery-track:hover {
            animation-play-state: paused;
          }
        `}</style>
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
            // zdvojení pro nekonečnou smyčku
            '/demo/Hero-01.png',
            '/demo/demo-portrait.jpg',
            '/demo/Piclio01.jpg',
            '/demo/hero-02.png',
            '/demo/Piclio03.jpg',
            '/demo/demo-krajina.jpg',
            '/demo/Piclio05.jpg',
            '/demo/Piclio-event01.png',
          ].map((src, i) => (
            <div key={i} style={{ width: 280, height: 380, flexShrink: 0, marginRight: 3, position: 'relative', overflow: 'hidden' }}>
              <Image src={src} alt="Foto z eventu" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ATRAKCE */}
      <section id="atrakce" style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #1f1530 0%, #191224 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>ZÁŽITKOVÉ FOTOSLUŽBY NA KLÍČ</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 48px' }}>
            Profesionální produkce<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>pro váš event.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              {
                badge: 'BESTSELLER', featured: true,
                name: 'The AI Magic Corner',
                desc: 'Náš bestseller. Generativní AI v reálném čase promění hosty v hrdiny nebo je přenese do jiných světů. Zahrnuje technika, obsluhu a okamžitý tisk.',
                price: '19 000 Kč', sub: '3 hodiny · obsluha v ceně · okamžitý tisk',
              },
              {
                badge: 'FULL SERVICE', featured: false,
                name: 'Fotoreportáž Piclio',
                desc: 'Živý fotograf zachycuje autentické emoce přímo v davu. Zahrnuje unikátní hybridní identifikační systém (Face Recognition + ID jmenovky pro 100% spolehlivost), hosting a individuální grafiku galerie.',
                price: '21 000 Kč', sub: '4 hodiny · AI doručení v ceně',
              },
              {
                badge: 'NA MÍRU', featured: false,
                name: 'Prémiová reálná scéna',
                desc: 'Mobilní studio s fyzicky postavenou scénou a profesionálním nasvícením na míru vašemu tématu (Gatsby, džungle, brand).',
                price: 'od 25 000 Kč', sub: 'Individuální nabídka',
              },
              {
                badge: 'DOPLNĚK', featured: false,
                name: 'Živé promítání',
                desc: 'Okamžitý přenos právě pořízených fotografií na obrazovky v sále pro maximální zapojení publika.',
                price: 'od 4 900 Kč', sub: 'Lze přidat k libovolnému balíčku',
              },
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

          {/* Tisk balíčky */}
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
      <section id="ceník" style={{ padding: '100px 48px', background: '#191224' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PRO FOTOGRAFY · SAAS</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 32 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>Platforma pro fotografy.</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 260, textAlign: 'right', lineHeight: 1.6, margin: 0, flexShrink: 0 }}>Využijte vlastní techniku. Překvapte klienty bleskovým doručením.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { tag: 'STARTER', price: '990 Kč', period: 'za event · 100 hostů', features: ['AI Face Recognition','Soukromé galerie hostů','QR kód + e-mail'], pop: false },
              { tag: '★ PRO EVENT', price: '2 490 Kč', period: 'za event · 500 hostů', features: ['AI Face Recognition','White label galerie','Dashboard fotografa','Slideshow projekce'], pop: true },
              { tag: 'MĚSÍČNÍ', price: '2 990 Kč', period: 'měsíčně · neomezené akce', features: ['Neomezené akce','10 000 fotek / měsíc','Prioritní podpora'], pop: false },
              { tag: 'ROČNÍ', price: '24 900 Kč', period: 'ročně · vše neomezené', features: ['API přístup','White label','Custom integrace','Dedicated support'], pop: false },
            ].map(p => (
              <div key={p.tag} style={{ background: p.pop ? 'linear-gradient(135deg, #1e1640 0%, #1f1530 100%)' : 'rgba(255,255,255,0.03)', border: p.pop ? '1px solid rgba(183,233,76,0.35)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
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
                <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 100, fontSize: 13, fontWeight: p.pop ? 700 : 500, textDecoration: 'none', background: p.pop ? '#b7e94c' : 'transparent', color: p.pop ? '#191224' : 'rgba(255,255,255,0.6)', border: p.pop ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>Začít →</Link>
              </div>
            ))}
          </div>
          {/* Beta banner */}
          <div style={{ marginTop: 32, padding: '24px 32px', background: 'rgba(183,233,76,0.06)', border: '1px solid rgba(183,233,76,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#b7e94c', marginBottom: 4 }}>PRÁVĚ PŘIPRAVUJEME</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Tato sekce je v závěrečné fázi ladění. Chcete se stát naším testerem za zvýhodněnou cenu?{' '}
                <a href="mailto:ahoj@piclio.cz" style={{ color: '#b7e94c', textDecoration: 'none', fontWeight: 600 }}>Napište nám</a>{' '}
                a domluvíme se na individuálních podmínkách.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SROVNÁNÍ */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(135deg, #1f1530 0%, #191224 100%)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>PROČ PICLIO?</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 40px' }}>Vlastnost po vlastnosti.</h2>
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            {/* Header */}
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
      <section style={{ padding: '100px 48px', background: '#191224', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#b7e94c', marginBottom: 20, fontWeight: 500 }}>O NÁS</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            52 let zkušeností.<br /><span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>Nejsme jen agentura, jsme studio.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 64px', maxWidth: 540 }}>
            Za projektem stojí duo z ateliéru na Kampě, které spojuje precizní práci se světlem a moderní AI digitální ekosystém.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                name: 'Katarína',
                role: 'Obraz · Strategie · AI',
                desc: '26 let vizuální tvorby. Propojuje fotografii s AI technologiemi, aby klientům šetřila čas při tvorbě obsahu.',
                foto: '/demo/katarina.png',
              },
              {
                name: 'Luboš',
                role: 'Světlo · Kompozice · Technologie',
                desc: '26 let ve fotografii a filmu. Technický expert, který ručí za to, že každý výstup bude vypadat profesionálně.',
                foto: '/demo/lubos.png',
              },
              {
                name: 'Kristína',
                role: 'Péče o zákazníka · Koordinace',
                desc: 'Vaše hlavní spojka s projektem. Stará se o průběh akce, zákazníky a brand DNA.',
                foto: '/demo/kristina.png',
              },
            ].map(p => (
              <div key={p.name} style={{
                background: 'linear-gradient(135deg, #251840 0%, #1f1530 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24,
                padding: '36px 32px',
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  overflow: 'hidden', marginBottom: 20,
                  border: '2px solid rgba(183,233,76,0.2)',
                  position: 'relative',
                }}>
                  <Image src={p.foto} alt={p.name} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#b7e94c', marginBottom: 16, letterSpacing: '0.03em', fontWeight: 500 }}>{p.role}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: '32px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
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
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#b7e94c', borderRadius: 28, padding: '80px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', fontWeight: 800, lineHeight: 1.05, color: '#191224', letterSpacing: '-0.04em', margin: 0, maxWidth: 480 }}>Udělejte z vaší další akce zážitek, o kterém se bude mluvit.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', minWidth: 340 }}>
            <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.55)', textAlign: 'right', lineHeight: 1.7, margin: 0 }}>
              Pro firmy, event agentury<br />i profesionální fotografy.<br />Praha a celá ČR.
            </p>
            <input
              type="text"
              placeholder="Vaše jméno"
              style={{
                width: '100%', padding: '12px 18px', borderRadius: 12,
                border: '1.5px solid rgba(10,10,10,0.15)',
                background: 'rgba(255,255,255,0.6)',
                fontSize: 14, outline: 'none', color: '#191224',
                backdropFilter: 'blur(8px)',
              }}
            />
            <input
              type="email"
              placeholder="Váš e-mail"
              style={{
                width: '100%', padding: '12px 18px', borderRadius: 12,
                border: '1.5px solid rgba(10,10,10,0.15)',
                background: 'rgba(255,255,255,0.6)',
                fontSize: 14, outline: 'none', color: '#191224',
                backdropFilter: 'blur(8px)',
              }}
            />
            <textarea
              placeholder="Popište vaši akci — datum, počet hostů, typ eventu..."
              rows={3}
              style={{
                width: '100%', padding: '12px 18px', borderRadius: 12,
                border: '1.5px solid rgba(10,10,10,0.15)',
                background: 'rgba(255,255,255,0.6)',
                fontSize: 14, outline: 'none', color: '#191224',
                resize: 'none', fontFamily: 'inherit',
                backdropFilter: 'blur(8px)',
              }}
            />
            <button
              onClick={() => {
                const name = (document.querySelector('input[placeholder="Vaše jméno"]') as HTMLInputElement)?.value
                const email = (document.querySelector('input[placeholder="Váš e-mail"]') as HTMLInputElement)?.value
                const msg = (document.querySelector('textarea') as HTMLTextAreaElement)?.value
                window.location.href = `mailto:ahoj@piclio.cz?subject=Poptávka od ${name}&body=Jméno: ${name}%0AE-mail: ${email}%0A%0A${msg}`
              }}
              style={{
                width: '100%', padding: '14px 28px', borderRadius: 100,
                background: '#191224', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                border: 'none', letterSpacing: '0.01em',
              }}
            >
              Odeslat poptávku →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%', flexWrap: 'wrap', gap: 16 }}>
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
      </footer>

    </div>
  )
}
