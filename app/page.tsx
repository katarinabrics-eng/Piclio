import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piclio — Fotografické zážitky pro eventy · fotografie, technologie, AI',
  description: 'Piclio je kreativní a technologický partner pro eventy. Od reportážní fotografie přes interaktivní fotostudia až po AI zážitky — fotky vidí hosté na obrazovkách a mají je hned v mobilu.',
}

export default function HomePage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Piclio — Fotografické zážitky pro eventy · fotografie, technologie, AI</title>
<meta name="description" content="Piclio je kreativní a technologický partner pro eventy. Od reportážní fotografie přes interaktivní fotostudia až po AI zážitky — fotky vidí hosté na obrazovkách a mají je hned v mobilu.">
<meta property="og:title" content="Piclio — Fotografické zážitky pro eventy">
<meta property="og:description" content="Fotografie, technologie a AI zážitky, které promění vaši akci. Hosté mají fotky během akce — na obrazovkách i v mobilu.">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/lp-styles.css">
<link rel="stylesheet" href="/lp-sections.css">
<link rel="stylesheet" href="/lp-concept.css">
</head>
<body>

<div class="aura" aria-hidden="true"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>

<!-- ===================== NAV ===================== -->
<nav class="nav" id="nav">
  <a class="brand" href="#top"><img src="/lp-assets/piclio-logo.png" alt="Piclio"></a>
  <ul class="nav-links">
    <li><a href="#jak-to-funguje">Jak to funguje</a></li>
    <li><a href="#vystupy">Ukázky</a></li>
    <li><a href="#sluzby">Služby a ceny</a></li>
    <li><a href="#reference">Reference</a></li>
    <li hidden><a href="#pro-fotografy">Pro fotografy</a></li>
    <li><a href="/vanocni-vecirky">Vánoce &amp; plesy</a></li>
    <li><a href="#kontakt">Kontakt</a></li>
  </ul>
  <div class="nav-cta">
    <a class="nav-login" href="https://www.piclio.cz/login">Přihlásit se</a>
    <a class="btn btn-primary" href="#kontakt">Nezávazně poptat <span class="arr">→</span></a>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <a href="#jak-to-funguje">Jak to funguje</a>
  <a href="#vystupy">Ukázky</a>
  <a href="#sluzby">Služby a ceny</a>
  <a href="#reference">Reference</a>
  <a href="#pro-fotografy" hidden>Pro fotografy</a>
  <a href="/vanocni-vecirky">Vánoce &amp; plesy</a>
  <a href="#kontakt">Kontakt</a>
  <a class="btn btn-primary" href="#kontakt">Nezávazně poptat →</a>
</div>

<!-- ===================== 1 · HERO ===================== -->
<header class="hero" id="top" data-screen-label="Hero">
  <div class="wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="hero-badge reveal"><span class="live"></span>Fotograf · Fotostudio · AI · Tisk — vše v jednom</span>
        <h1 class="reveal" data-d="1">
          <span class="ln">Fotky z akce</span>
          <span class="ln">v mobilu hostů.</span>
          <span class="ln grad-text">Ještě ten večer.</span>
        </h1>
        <p class="sub reveal" data-d="2">Fotograf, interaktivní fotostudio, AI proměny i tisk na místě od jednoho týmu. Všechny fotografie v jedné galerii přístupné všem hostům. Bez aplikace a bez registrace.</p>
        <div class="hero-actions reveal" data-d="3">
          <a class="btn btn-primary" href="#kontakt">Nezávazně poptat <span class="arr">→</span></a>
          <a class="btn btn-ghost" href="#jak-to-funguje">Jak to funguje</a>
        </div>
      </div>

      <div class="hero-visual reveal" data-d="2">
        <div class="collage" id="collage" style="max-width:564px">
          <div class="ph p1" data-par="22"><img src="/lp-assets/hero-01.png" alt="Foto z eventu"></div>
          <div class="ph p2" data-par="-30"><img src="/lp-assets/hero-portrait.jpg" alt="Portrét hosta"></div>
          <div class="ph p3" data-par="14"><img src="/lp-assets/flow-04-tisk.jpeg" alt="Tisk fotek na místě"></div>
          <div class="ph p4" data-par="-18"><img src="/lp-assets/hero-event01.png" alt="Detail z akce"></div>
          <div class="live-card" data-par="40">
            <img class="thumb" src="/lp-assets/hero-live-thumb.jpg" alt="">
            <div>
              <div class="lc-t"><span class="dot"></span>Nová fotka · právě teď</div>
              <div class="lc-s">Přidáno do galerie večera · 21:12</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</header>

<!-- ===================== MARQUEE ===================== -->
<section class="marquee-band" aria-hidden="true">
  <div class="marquee-wrap">
    <div class="marquee row" style="--dur:66s">
      <div class="mq-item"><img src="/lp-assets/cat-firemni.png" alt=""><span class="tag">Firemní večírek</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-svatba.jpeg" alt=""><span class="tag">Svatba</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-konference.png" alt=""><span class="tag">Konference</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-festival.png" alt=""><span class="tag">Festival</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-galavecer.png" alt=""><span class="tag">Galavečer</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-businessgala.png" alt=""><span class="tag">Business gala</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-firemni.png" alt=""><span class="tag">Firemní večírek</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-svatba.jpeg" alt=""><span class="tag">Svatba</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-konference.png" alt=""><span class="tag">Konference</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-festival.png" alt=""><span class="tag">Festival</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-galavecer.png" alt=""><span class="tag">Galavečer</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-businessgala.png" alt=""><span class="tag">Business gala</span></div>
    </div>
  </div>
  <div class="marquee-wrap">
    <div class="marquee row rev" style="--dur:78s">
      <div class="mq-item"><img src="/lp-assets/cat-afterparty.png" alt=""><span class="tag">After party</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-openair.png" alt=""><span class="tag">Open air</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-hostvecera.png" alt=""><span class="tag">Host večera</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-raut.png" alt=""><span class="tag">Raut</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-teambuilding.png" alt=""><span class="tag">Teambuilding</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-ples.png" alt=""><span class="tag">Ples</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-afterparty.png" alt=""><span class="tag">After party</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-openair.png" alt=""><span class="tag">Open air</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-hostvecera.png" alt=""><span class="tag">Host večera</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-raut.png" alt=""><span class="tag">Raut</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-teambuilding.png" alt=""><span class="tag">Teambuilding</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-ples.png" alt=""><span class="tag">Ples</span></div>
    </div>
  </div>
</section>

<!-- ===================== 2 · PATTERN INTERRUPT ===================== -->
<section class="section" id="problem" data-screen-label="Problém">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="title">Znáte to?</h2>
      <p class="prob-sub">Akce za statisíce. <span class="grad-pink">Fotky za dva týdny v odkazu, který nikdo neotevře.</span></p>
      <p class="lead">Hosté se baví teď. Fotky ale dorazí, až je po všem, a pak už je nikdo nesdílí.</p>
    </div>
    <div class="prob-grid">
      <article class="prob-card reveal" data-d="1">
        <span class="blob"></span>
        <div class="n">01</div>
        <h3>Čtyři dodavatelé místo jednoho</h3>
        <p>Fotograf, fotokoutek, tisk, galerie. Čtyři domluvy, čtyři faktury a nikdo neručí za celek.</p>
      </article>
      <article class="prob-card reveal" data-d="2">
        <span class="blob"></span>
        <div class="n">02</div>
        <h3>Fotky přijdou pozdě</h3>
        <p>Za týden už nikdo nehledá sám sebe mezi 500 cizími fotkami.</p>
      </article>
      <article class="prob-card reveal" data-d="3">
        <span class="blob"></span>
        <div class="n">03</div>
        <h3>Akce zmizí ze sítí</h3>
        <p>Co se nesdílí během večera, nesdílí se vůbec. Vaše značka přijde o dosah zdarma.</p>
      </article>
    </div>
    <p class="prob-kicker reveal">Proto jsme vytvořili <span class="grad-text">Piclio.</span></p>
  </div>
</section>


<!-- ===================== JAK TO FUNGUJE ===================== -->
<section class="section" id="jak-to-funguje" data-screen-label="Jak to funguje">
  <div class="wrap">
    <div class="sec-head reveal" style="margin-bottom:40px">
      <h2 class="title">Jak to funguje</h2>
      <p class="prob-sub">Jeden tým. Jedna galerie. <span class="grad-pink">Fotky hned.</span></p>
      <p class="lead">Vy se staráte o hosty. My o všechno kolem fotek.</p>
    </div>
    <div class="flow-wrap reveal">
      <div class="flow four">
        <article class="flow-card">
          <div class="flow-photo"><span class="flow-num">1</span><img src="/lp-uploads/01zachyceni.jpeg" alt="Fotíme"></div>
          <div class="flow-ic"><img src="/lp-assets/ic-camera.png" alt=""></div>
          <div class="flow-body"><h3>Fotíme</h3><p>Fotograf v centru dění, fotostudio nebo AI koutek. Klidně všechno najednou.</p></div>
        </article>
        <article class="flow-card">
          <div class="flow-photo"><span class="flow-num">2</span><img src="/lp-assets/flow-02.jpeg" alt="Poznáme hosta"></div>
          <div class="flow-ic"><img src="/lp-assets/ic-star.png" alt=""></div>
          <div class="flow-body"><h3>Poznáme hosta</h3><p>Kdo chce, udělá při příchodu jedno selfie a uvidí rovnou jen své fotky. Ostatní mají celou galerii večera.</p></div>
        </article>
        <article class="flow-card">
          <div class="flow-photo"><span class="flow-num">3</span><img src="/lp-assets/flow-03.jpeg" alt="Doručíme"></div>
          <div class="flow-ic"><img src="/lp-assets/ic-share.png" alt=""></div>
          <div class="flow-body"><h3>Doručíme</h3><p>Nová fotka je v online galerii večera do minuty. Bez aplikace, bez registrace.</p></div>
        </article>
        <article class="flow-card">
          <div class="flow-photo"><span class="flow-num">4</span><img src="/lp-assets/flow-04-tisk.jpeg" alt="Vytiskneme"></div>
          <div class="flow-ic"><img src="/lp-assets/ic-bolt.png" alt=""></div>
          <div class="flow-body"><h3>Vytiskneme</h3><p>Fotka s vaším logem na památku, přímo na místě.</p></div>
        </article>
      </div>
      <div class="flow-hint"><span class="dots"><i></i><i></i><i></i><i></i></span>Táhněte pro další</div>
    </div>
    <div class="checks reveal"><span>Bez aplikace</span><span>Fotky do minuty</span><span>S vaším logem</span><span>V souladu s GDPR</span></div>
  </div>
</section>

<!-- ===================== 4.6 · VÝSTUPY (gallery) ===================== -->
<section class="section outputs" id="vystupy" data-screen-label="Výstupy">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="title">Co si hosté odnesou</h2>
      <p class="prob-sub">Profi fotky z večera. <span class="grad-pink">A k tomu kouzla s AI.</span></p>
      <p class="lead">V galerii večera najdou hosté své portréty<br>i AI proměny. Zobrazí se jen to, co schválí fotograf.</p>
    </div>

    <div class="bento-cq reveal">
      <div class="bento">
      <article class="bcard big" data-par="10">
        <span class="ping"></span>
        <img src="/lp-assets/out-obalka.jpg" alt="Obálka magazínu">
        <div class="meta">
          <span class="btype pink">AI · obálka</span>
          <h3>Obálka magazínu</h3>
          <p>Host jako hvězda titulní strany.</p>
        </div>
      </article>

      <article class="bcard tall" data-par="-14">
        <img src="/lp-assets/kz-portret.jpg" alt="Portrét z akce">
        <div class="meta">
          <span class="btype">Foto</span>
          <h3>Portrét z akce</h3>
          <p>Skutečná atmosféra večera, profesionálně nasvícená.</p>
        </div>
      </article>

      <article class="bcard tall" data-par="8">
        <span class="ping"></span>
        <video src="/lp-assets/anim-01.mp4" autoplay loop muted playsinline preload="metadata"></video>
        <div class="meta">
          <span class="btype lime">Animace</span>
          <h3>Živá animace</h3>
          <p>Rozpohybovaná fotka, hotová na stories.</p>
        </div>
      </article>

      <article class="bcard tall" data-par="-8">
        <img src="/lp-assets/out-film.jpg" alt="Filmový plakát">
        <div class="meta">
          <span class="btype">AI · film</span>
          <h3>Filmový plakát</h3>
          <p>Hlavní role ve vlastním blockbusteru.</p>
        </div>
      </article>

      <article class="bcard tall" data-par="-11">
        <img src="/lp-assets/kz-koncert.jpg" alt="Koncertní plakát">
        <div class="meta">
          <span class="btype">AI · koncert</span>
          <h3>Koncertní plakát</h3>
          <p>Headliner festivalu na jednu noc.</p>
        </div>
      </article>

      <article class="bcard tall" data-par="9">
        <img src="/lp-assets/out-business.jpg" alt="Business portrét">
        <div class="meta">
          <span class="btype lime">Business</span>
          <h3>Business portrét</h3>
          <p>Profilovka na LinkedIn bez ateliéru.</p>
        </div>
      </article>

      <article class="bcard tall" data-par="-9">
        <img src="/lp-assets/out-brand.jpg" alt="Fotka s vaším logem">
        <div class="meta">
          <span class="btype">Brand</span>
          <h3>Fotka s vaším logem</h3>
          <p>Každá fotka nese vaši značku.</p>
        </div>
      </article>

      <article class="bcard wide" data-par="11">
        <img src="/lp-assets/out-skupina.jpg" alt="Skupinové foto">
        <div class="meta">
          <span class="btype">Skupinové foto</span>
          <h3>Celá parta na jedné fotce</h3>
          <p>Ostré, dobře nasvícené a v galerii dřív, než parta opustí parket.</p>
        </div>
      </article>

      <article class="bcard wide" data-par="12">
        <img src="/lp-assets/out-tisk.jpg" alt="Tisk na místě">
        <div class="meta">
          <span class="btype">Tisk</span>
          <h3>Tisk na místě</h3>
          <p>Památka do ruky během minuty.</p>
        </div>
      </article>
      </div>
    </div>

    <!-- Auto-scroll caption strip -->
    <div class="strip-band reveal">
      <div class="strip-head">
        <span class="eyebrow">Naše ukázky</span>
        <h3 class="strip-title">Každou akci ladíme <span class="grad-text">k tématu.</span></h3>
        <p class="strip-sub">Gatsby, Hollywood, Casino Royale nebo vaše značka.</p>
      </div>
      <div class="strip-wrap">
        <div class="strip">
          <div class="gphoto"><video src="/lp-assets/u-video-1.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="gphoto"><video src="/lp-assets/u-video-2.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="gphoto"><video src="/lp-assets/u-video-3.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="gphoto"><img src="/lp-assets/u-koncert.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-kral.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-bobble-f.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-bobble-m.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-pohadka.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-diner-m.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-diner-f.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-01.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-02.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-03.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-04.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-05.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-06.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-07.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-08.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-09.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-10.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-11.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-12.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-13.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-14.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-15.jpg" alt="" loading="lazy"></div>
<!-- dup -->
          <div class="gphoto"><video src="/lp-assets/u-video-1.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="gphoto"><video src="/lp-assets/u-video-2.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="gphoto"><video src="/lp-assets/u-video-3.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="gphoto"><img src="/lp-assets/u-koncert.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-kral.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-bobble-f.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-bobble-m.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-pohadka.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-diner-m.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/u-diner-f.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-01.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-02.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-03.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-04.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-05.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-06.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-07.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-08.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-09.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-10.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-11.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-12.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-13.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-14.jpg" alt="" loading="lazy"></div>
          <div class="gphoto"><img src="/lp-assets/ukazka-15.jpg" alt="" loading="lazy"></div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ===================== SLUŽBY A CENY ===================== -->
<section class="section" id="sluzby" data-screen-label="Služby a ceny">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="title">Služby a ceny</h2>
      <p class="prob-sub">Vyberte si, co se hodí <span class="grad-text">na vaši akci.</span></p>
      <p class="lead">Technika, obsluha i doručení fotek do mobilů jsou vždy v ceně.</p>
    </div>
    <div class="serv-grid">
      <article class="serv reveal">
        <div class="bg"><img src="/lp-assets/atrakce-magic-corner.jpeg" alt="Staň se hvězdou — AI fotostudio"></div>
        <span class="pill hot">Bestseller</span>
        <h3>Staň se hvězdou</h3>
        <p>AI fotostudio: hosté na obálce časopisu nebo ve filmu, s tiskem na místě.</p>
        <div class="price-row"><span class="price">od 19 000 Kč</span><small>3 hodiny</small><a class="serv-link" href="/ai-experiences">Více <span class="arr">→</span></a></div>
      </article>
      <article class="serv reveal">
        <div class="bg"><img src="/lp-assets/atrakce-lovci.jpeg" alt="Fotoreportáž — fotograf na akci"></div>
        <span class="pill alt">Fotograf</span>
        <h3>Fotoreportáž</h3>
        <p>Fotograf zachytí celou akci, hosté mají fotky v mobilu i na plátně.</p>
        <div class="price-row"><span class="price">od 23 000 Kč</span><small>4 hodiny</small><a class="serv-link" href="/event-photography">Více <span class="arr">→</span></a></div>
      </article>
      <article class="serv reveal">
        <div class="bg"><img src="/lp-uploads/premiova-realna-scena.jpeg" alt="Párty fotostudio — postavená scéna"></div>
        <span class="pill alt">Fotostudio</span>
        <h3>Párty fotostudio</h3>
        <p>Postavená scéna ve stylu vaší akce: Gatsby, džungle, vaše značka.</p>
        <div class="price-row"><span class="price">od 29 000 Kč</span><small>scéna na míru</small><a class="serv-link" href="/interactive-studio">Více <span class="arr">→</span></a></div>
      </article>
      <article class="serv reveal">
        <div class="bg"><img src="/lp-assets/brand-band.png" alt="Řešení na míru"></div>
        <span class="pill alt">Na míru</span>
        <h3>Na míru</h3>
        <p>Máte vlastní nápad? Postavíme ho i s technikou a scénou.</p>
        <div class="price-row"><span class="price">individuálně</span><small>podle zadání</small><a class="serv-link" href="#kontakt">Více <span class="arr">→</span></a></div>
      </article>
    </div>
    <div class="incl-band reveal">
      <div class="incl-ic">✓</div>
      <div class="incl-tx"><b>Vaše logo a barvy</b> na fotkách, tiscích i v galerii jsou v ceně.</div>
    </div>
    <div class="print-band reveal">
      <div class="print-head">
        <div class="pt">Balíčky okamžitého tisku</div>
        <div class="ps">Termosublimační tisk přímo na místě</div>
      </div>
      <div class="print-grid">
        <div class="print-card"><div class="sz">S</div><div class="meta"><div class="q">do 200 ks fotek</div><div class="pr">3 000 Kč</div></div></div>
        <div class="print-card"><div class="sz">M</div><div class="meta"><div class="q">do 500 ks fotek</div><div class="pr">6 500 Kč</div></div></div>
        <div class="print-card"><div class="sz">L</div><div class="meta"><div class="q">do 1 000 ks fotek</div><div class="pr">11 000 Kč</div></div></div>
      </div>
    </div>
  </div>
</section>

<!-- ===================== REFERENCE (case study + stats) ===================== -->
<section class="section proof" id="reference" data-screen-label="Reference">
  <div class="wrap">
    <div class="intro-center reveal" style="margin-bottom:48px">
      <h2 class="title">Reference</h2>
      <p class="prob-sub center">Už si nás pozvali <span class="grad-text">na různé akce.</span></p>
    </div>

    <div class="case-slider reveal">
      <button class="cs-arrow prev" id="caseprev" aria-label="Předchozí"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button class="cs-arrow next" id="casenext" aria-label="Další"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>

      <div class="case-viewport" id="caseViewport">
        <article class="case-card active">
          <div class="case-photo"><img src="/lp-assets/cat-firemni2.png" alt="Vánoční večírek"><span class="case-tag">Vánoční večírek</span></div>
          <div class="case-body">
            <h3>Vánoční večírek, 250+ lidí</h3>
            <p class="case-lede">Firma chtěla obsah na LinkedIn ještě týž večer, ne za týden.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Zábavný obsah pro sociální sítě bez čekání na zpracování.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">AI fotostudio s galerií v barvách firmy a sdílením přímo z mobilu.</span></div>
            </div>
            <div class="case-result">300+ fotek sdíleno na LinkedIn týž večer</div>
          </div>
        </article>

        <article class="case-card">
          <div class="case-photo"><img src="/lp-assets/cat-firemni.png" alt="Firemní akce"><span class="case-tag">Firemní akce</span></div>
          <div class="case-body">
            <h3>Letní firemní párty</h3>
            <p class="case-lede">Firma chtěla, aby se večer neomezil na pár fotek z mobilu.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Zachytit celý večer a dát lidem fotky bez čekání.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">Fotoreportáž, párty fotostudio a online galerie v barvách firmy.</span></div>
            </div>
            <div class="case-result">Fotky v galerii ještě během párty</div>
          </div>
        </article>

        <article class="case-card">
          <div class="case-photo"><img src="/lp-assets/cat-konference2.png" alt="Tech konference"><span class="case-tag">Konference</span></div>
          <div class="case-body">
            <h3>Tech konference</h3>
            <p class="case-lede">Účastníci chtěli profilovku na LinkedIn bez fronty do ateliéru.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Networking a osobní branding stovek účastníků během tří dnů.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">Profi portréty na místě s AI úpravou, rovnou v online galerii.</span></div>
            </div>
            <div class="case-result">600+ portrétů za jediný den</div>
          </div>
        </article>

        <article class="case-card">
          <div class="case-photo"><img src="/lp-assets/magic-karik-2-mv2dcf8b-r8mx.jpg" alt="Letní hudební festival"><span class="case-tag">Festival</span></div>
          <div class="case-body">
            <h3>Letní hudební festival</h3>
            <p class="case-lede">Pořadatel chtěl, aby atmosféra žila na sítích už během festivalu.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Zachytit atmosféru a rychle ji dostat na web i sítě festivalu.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">Živé promítání na LED stěnu a AI plakát pro každého návštěvníka.</span></div>
            </div>
            <div class="case-result">Dosah na Instagramu rostl už během festivalu</div>
          </div>
        </article>

        <article class="case-card">
          <div class="case-photo"><img src="/lp-assets/cat-svatba2.png" alt="Svatba"><span class="case-tag">Svatba</span></div>
          <div class="case-body">
            <h3>Svatba, 120 hostů</h3>
            <p class="case-lede">Snoubenci chtěli zabavit hosty a ukázat rodině fotky hned.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Zabavit hosty během hostiny a nenechat rodinu čekat na fotky týdny.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">Interaktivní fotostudio na hostině a živá galerie sdílená s celou rodinou.</span></div>
            </div>
            <div class="case-result">Fotky v mobilu ještě před koncem hostiny</div>
          </div>
        </article>

        <article class="case-card">
          <div class="case-photo"><img src="/lp-assets/cat-galavecer.png" alt="Filmová premiéra"><span class="case-tag">Premiéra</span></div>
          <div class="case-body">
            <h3>Filmová premiéra</h3>
            <p class="case-lede">Distributor chtěl, aby si hosté odnesli víc než lístek.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Udělat z premiéry zážitek, o kterém se bude psát na sítích.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">AI fotostudio s filmovým plakátem pro každého hosta a tisk na místě.</span></div>
            </div>
            <div class="case-result">Hosté sdíleli vlastní plakát ještě před projekcí</div>
          </div>
        </article>

        <article class="case-card">
          <div class="case-photo"><img src="/lp-assets/cat-ples.png" alt="Ples"><span class="case-tag">Ples</span></div>
          <div class="case-body">
            <h3>Reprezentační ples</h3>
            <p class="case-lede">Pořadatel chtěl hostům dát památku z večera v plesovém stylu.</p>
            <div class="case-rows">
              <div class="case-row"><span class="cr-k">Výzva</span><span class="cr-v">Fotit stovky hostů v sále bez front u fotografa.</span></div>
              <div class="case-row"><span class="cr-k">Řešení</span><span class="cr-v">Fotograf v sále, fotokoutek s plesovou scénou a tisk na místě.</span></div>
            </div>
            <div class="case-result">Výtisky na památku během celého večera</div>
          </div>
        </article>
      </div>

      <div class="case-dots" id="caseDots"></div>
    </div>
    <div class="stat-row reveal" style="margin-top:56px">
      <div class="stat-cell"><div class="big" data-count="250" data-suffix="+">0</div><div class="lbl">realizovaných akcí</div></div>
      <div class="stat-cell"><div class="big" data-count="150000" data-suffix="+">0</div><div class="lbl">vyfotografovaných úsměvů</div></div>
      <div class="stat-cell"><div class="big" data-count="98" data-suffix="%">0</div><div class="lbl">spokojených klientů</div></div>
      <div class="stat-cell"><div class="big">28 let</div><div class="lbl">zkušeností s fotografií</div></div>
    </div>
  </div>
</section>

<!-- ===================== 5 · SAAS PRO FOTOGRAFY ===================== -->
<section class="section" id="pro-fotografy" data-screen-label="Pro fotografy" hidden>
  <div class="wrap">
    <div class="sec-head reveal" style="margin-bottom:56px">
      <h2 class="title">Software pro fotografy</h2>
      <p class="prob-sub">Fotografujete sami? <span class="grad-text">Piclio ušetří hodiny ruční práce.</span></p>
      <p class="lead">Nahrajte fotky — systém je roztřídí a doručí každému klientovi do osobní galerie. Konec WeTransferu a Úschovny. Klient komentuje přímo u fotek, vy reagujete přehledně na jednom místě.</p>
    </div>

    <div class="saas-grid">
      <div class="saas-visual reveal">
        <span class="glow-bg"></span>
        <div class="how-phone">
          <div class="screen">
            <div class="notch"></div>
            <img class="active" src="/lp-assets/ukazka-03.jpg" alt="Ukázka galerie v aplikaci">
            <div class="phone-toast">
              <div class="pt-ic">✦</div>
              <div>
                <div class="pt-t">Galerie aktualizována</div>
                <div class="pt-s">+3 nové fotky · sdíleno automaticky</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-rows reveal" data-d="1">
        <div class="frow">
          <div class="fi g-cool"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg></div>
          <div><h3>SmartLink &amp; Face Recognition</h3><p>Jednou se dotknete displeje a propojíte obličej hosta se systémem. AI ho pak sama celý večer sleduje a páruje.</p></div>
        </div>
        <div class="frow">
          <div class="fi g-hot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="10" height="18" rx="2"/><path d="M3 8l3 3-3 3"/><path d="M6 11h6"/></svg></div>
          <div><h3>Online galerie akce</h3><p>Jedna živě aktualizovaná galerie celé akce, nové fotky do minuty. Když klient chce, zapnete osobní galerie s registrací — host pak vidí jen své fotky.</p></div>
        </div>
        <div class="frow">
          <div class="fi g-violet"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5a2.5 2.5 0 0 1 2.5-1.5c1.4 0 2.5.9 2.5 2s-1 1.7-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2a2.5 2.5 0 0 0 2.5-1.5"/></svg></div>
          <div><h3>Monetizační modul <span class="soon">Připravujeme</span></h3><p>Přestaňte nechávat peníze na stole. Uzamkněte fotky a nabídněte hostům nákup jednotlivých snímků i celých prémiových galerií.</p></div>
        </div>
        <div style="margin-top:30px">
          <a class="btn btn-primary" href="mailto:ahoj@piclio.cz?subject=Z%C3%A1jem o beta p%C5%99%C3%ADstup Piclio SaaS">Chci beta přístup pro fotografy <span class="arr">→</span></a>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ===================== KDO ZA TÍM STOJÍ ===================== -->
<section class="section" id="o-nas" data-screen-label="Tým">
  <div class="wrap">
    <div class="sec-head center reveal" style="max-width:671px">
      <h2 class="title">Kdo za tím stojí</h2>
      <p class="prob-sub center">Studio z Kampy.<br><span class="grad-pink">Ne agentura.</span></p>
      <p class="lead">Za Picliem stojí Katarína a Luboš: 26 let ve fotografii a filmu. Spojujeme práci se světlem s možnostmi AI.</p>
    </div>
    <div class="team-grid">
      <article class="member reveal" data-d="1">
        <div class="photo sketch"><img src="/lp-assets/team-katarina.png" alt="Katarína"></div>
        <div class="info"><div class="nm">Katarína</div><div class="rl">Obraz · Strategie · AI</div><p>26 let vizuální tvorby. Propojuje fotografii s AI, aby klienti měli obsah rychleji.</p></div>
      </article>
      <article class="member reveal" data-d="2">
        <div class="photo sketch"><img src="/lp-assets/team-lubos.png" alt="Luboš"></div>
        <div class="info"><div class="nm">Luboš</div><div class="rl">Světlo · Kompozice · Technika</div><p>26 let ve fotografii a filmu. Technický expert, který ručí za to, že každý výstup vypadá profesionálně.</p></div>
      </article>
    </div>
  </div>
</section>

<!-- ===================== FAQ ===================== -->
<section class="section" id="faq" data-screen-label="FAQ">
  <div class="wrap">
    <div class="sec-head center reveal">
      <h2 class="title">Časté dotazy</h2>
      <p class="prob-sub center">Na co se nás <span class="grad-text">ptáte.</span></p>
    </div>
    <div class="faq reveal" id="faqList">
      <div class="faq-item open">
        <button class="faq-q">Musí si hosté stahovat aplikaci?<span class="pm">+</span></button>
        <div class="faq-a"><p>Ne. Všechno běží v prohlížeči v mobilu. Hosté jen načtou QR kód nebo otevřou odkaz.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Uvidí každý jen své fotky?<span class="pm">+</span></button>
        <div class="faq-a"><p>Standardně mají hosté jednu online galerii celého večera, bez registrace. Pokud chcete, za příplatek zapneme osobní galerie: host udělá při příchodu selfie a uvidí jen své fotky. V celkové galerii však zůstanou.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">A co GDPR?<span class="pm">+</span></button>
        <div class="faq-a"><p>Galerie je dostupná jen přes odkaz nebo QR kód z vaší akce. Fotky jsou šifrované a na vyžádání je kdykoli smažeme.</p></div>
      </div>
      <div class="faq-item">
        <button class="faq-q">Co když vypadne internet?<span class="pm">+</span></button>
        <div class="faq-a"><p>Fotky se uloží a odešlou, jakmile je signál zpět. Na velké akce vozíme vlastní připojení.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ===================== 10 · KONTAKT (form) ===================== -->
<section class="section" id="kontakt" data-screen-label="Kontakt">
  <div class="wrap">
    <div class="contact-grid">
      <div class="contact-aside reveal">
        <h2 class="title">Kontakt</h2>
      <p class="prob-sub">Řekněte nám, <span class="grad-pink">co plánujete.</span></p>
        <p class="lead">Do 24 hodin vám pošleme konkrétní nabídku. Praha a celá ČR.</p>
        <div class="ci-list">
          <a class="ci" href="mailto:ahoj@piclio.cz"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><div><div class="k">E-mail</div><div class="v">ahoj@piclio.cz</div></div></a>
          <a class="ci" href="tel:+420604750776"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></span><div><div class="k">Telefon</div><div class="v">+420 604 750 776</div></div></a>
          <div class="ci"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg></span><div><div class="k">Kde působíme</div><div class="v">Praha a celá ČR</div></div></div>
        </div>
      </div>

      <form class="cform reveal" data-d="1" id="poptForm" novalidate>
        <div class="form-ok" id="formOk">Děkujeme! Otevřeli jsme vám e-mail s vyplněnou poptávkou — stačí odeslat. Ozveme se do 24 hodin.</div>

        <div class="cfield">
          <label>Co vás zajímá?</label>
          <div class="pchips">
            <label class="pchip"><input type="radio" name="sluzba" value="Fotoreportáž" checked><span class="pc-body"><span class="pc-t"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg></span>Fotoreportáž</span><span class="pc-p">od 23 000 Kč</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Staň se hvězdou"><span class="pc-body"><span class="pc-t"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><path d="M12 5v4M9 13h.01M15 13h.01"/><path d="M3 13h2M19 13h2"/></svg></span>Staň se hvězdou</span><span class="pc-p">od 19 000 Kč</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Párty fotostudio"><span class="pc-body"><span class="pc-t"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg></span>Párty fotostudio</span><span class="pc-p">od 29 000 Kč</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Na míru"><span class="pc-body"><span class="pc-t"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z"/><path d="M19 15l.8 2.4L22 18l-2.2.6L19 21l-.8-2.4L16 18l2.2-.6L19 15z"/></svg></span>Na míru</span><span class="pc-p">individuálně</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Nevím, poraďte"><span class="pc-body"><span class="pc-t"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17h.01"/></svg></span>Nevím, poraďte</span><span class="pc-p">zdarma</span></span></label>
            <label class="pchip" hidden><input type="radio" name="sluzba" value="Software pro fotografy"><span class="pc-body"><span class="pc-t"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg></span>Software pro fotografy</span><span class="pc-p">beta</span></span></label>
          </div>
        </div>

        <div class="cform-row">
          <div class="cfield"><label for="jmeno">Jméno a příjmení *</label><input id="jmeno" name="jmeno" type="text" placeholder="Jan Novák" required></div>
          <div class="cfield"><label for="firma">Firma / akce</label><input id="firma" name="firma" type="text" placeholder="Název firmy nebo akce"></div>
        </div>
        <div class="cform-row">
          <div class="cfield"><label for="email">E-mail *</label><input id="email" name="email" type="email" placeholder="jan@firma.cz" required></div>
          <div class="cfield"><label for="tel">Telefon</label><input id="tel" name="tel" type="tel" placeholder="+420 …"></div>
        </div>
        <div class="cform-row">
          <div class="cfield"><label for="datum">Termín akce</label><input id="datum" name="datum" type="text" placeholder="např. 14. 9. 2026"></div>
          <div class="cfield">
            <label for="hoste">Počet hostů</label>
            <select id="hoste" name="hoste">
              <option value="">Vyberte…</option>
              <option>do 50</option>
              <option>50–150</option>
              <option>150–300</option>
              <option>300–500</option>
              <option>500+</option>
            </select>
          </div>
        </div>
        <div class="cfield"><label for="zprava">Co plánujete?</label><textarea id="zprava" name="zprava" placeholder="Krátce popište svou akci a představu…"></textarea></div>

        <button type="submit" class="btn btn-primary">Odeslat nezávaznou poptávku <span class="arr">→</span></button>
        <p class="cform-note">Odesláním souhlasíte se zpracováním údajů dle <a href="/ochrana-osobnich-udaju" style="color:var(--muted);text-decoration:underline">zásad ochrany osobních údajů</a>. Nezávazné, bez automatů.</p>
      </form>
    </div>
  </div>
</section>


<!-- ===================== FOOTER ===================== -->
<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <a class="brand" href="#top"><img src="/lp-assets/piclio-logo.png" alt="Piclio"></a>
      <ul class="f-links">
        <li><a href="#jak-to-funguje">Jak to funguje</a></li>
        <li><a href="#vystupy">Ukázky</a></li>
        <li><a href="#sluzby">Služby a ceny</a></li>
        <li><a href="#reference">Reference</a></li>
        <li hidden><a href="#pro-fotografy">Pro fotografy</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="/vanocni-vecirky">Vánoce &amp; plesy</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
      </ul>
    </div>
    <div class="copy">© 2026 Studio Lucifera · Piclio · Kampa, Praha · <a href="/obchodni-podminky">Obchodní podmínky</a> · <a href="/ochrana-osobnich-udaju">Zásady ochrany osobních údajů</a></div>
  </div>
</footer>

<script src="/lp-motion.js"></script>
</body>
</html>` }} />
  )
}
