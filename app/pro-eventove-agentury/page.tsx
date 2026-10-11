import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piclio pro eventové agentury a hotely',
  description: 'Fotografická a technická produkce pro eventové agentury a hotely. Dodáváme fotografický servis, interaktivní fotostudia a AI zážitky pod vaší značkou.',
}

export default function ProEventoveAgenturyPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Piclio pro eventové agentury a hotely — produkční partner pro fotografii</title>
<meta name="description" content="Rozšiřte nabídku svých eventů o fotografické zážitky. Piclio zajistí fotografii, online galerii, projekci, tisk a AI zážitky pro vaše klienty.">
<meta property="og:title" content="Piclio pro eventové agentury a hotely">
<meta property="og:description" content="Vy máte klienta a řídíte event. My zajistíme fotografickou a technologickou produkci.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/lp-styles.css">
<link rel="stylesheet" href="/lp-sections.css">
<link rel="stylesheet" href="/lp-concept.css">
</head>
<body>

<div class="aura" aria-hidden="true"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>

<nav class="nav" id="nav">
  <a class="brand" href="/"><img src="/lp-assets/piclio-logo.png" alt="Piclio"></a>
  <ul class="nav-links">
    <li><a href="#vyhody">Výhody</a></li>
    <li><a href="#spoluprace">Spolupráce</a></li>
    <li><a href="#nabidka">Co nabídnete</a></li>
    <li><a href="#podminky">Podmínky</a></li>
    <li><a href="#kontakt">Kontakt</a></li>
  </ul>
  <div class="nav-cta">
    <a class="btn btn-primary" href="#kontakt">Domluvit spolupráci <span class="arr">→</span></a>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="#vyhody">Výhody</a>
  <a href="#spoluprace">Spolupráce</a>
  <a href="#nabidka">Co nabídnete</a>
  <a href="#podminky">Podmínky</a>
  <a href="#kontakt">Kontakt</a>
  <a class="btn btn-primary" href="#kontakt">Domluvit spolupráci →</a>
</div>

<header class="subhero" data-screen-label="Agentury hero">
  <div class="wrap">
    <div class="subhero-grid">
      <div>
        <span class="eyebrow reveal">Piclio pro eventové agentury a hotely</span>
        <h1 class="reveal" data-d="1">Rozšiřte nabídku svých eventů <span class="grad-text">o fotografické zážitky.</span></h1>
        <p class="sub reveal" data-d="2"><b>Vy máte klienta a řídíte event. My zajistíme fotografickou a technologickou produkci.</b></p>
        <p class="sub sub-2 reveal" data-d="2">Fotografie, online galerie, živá projekce, tisk a AI zážitky v jednom řešení. Spolupracujeme s agenturami, hotely a produkčními týmy na firemních večírcích, konferencích i plesech.</p>
        <div class="hero-actions reveal" data-d="3">
          <a class="btn btn-primary" href="#kontakt">Domluvit partnerskou spolupráci <span class="arr">→</span></a>
          <a class="btn btn-ghost" href="#spoluprace">Jak spolupráce funguje</a>
        </div>
      </div>
      <div class="subhero-visual reveal" data-d="2" style="aspect-ratio:896/1200;max-width:440px;justify-self:end;width:100%">
        <img src="/lp-assets/hf_20261011_115216_432d87fe-e66a-4914-82-mv3rn435-utu2.png" alt="Fotograf Piclio na firemní akci" style="width:100%;height:100%;object-fit:cover">
      </div>
    </div>
  </div>
</header>

<section class="section" id="vyhody" data-screen-label="Výhody">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="title">Jeden dodavatel navíc</h2>
      <p class="prob-sub">Více možností <span class="grad-pink">pro vaše klienty.</span></p>
      <p class="lead">Fotografování, galerie, tisk i interaktivní zážitek bez hledání čtyř dodavatelů. Piclio služby propojí do jednoho řešení, které zařadíte do vlastních balíčků.</p>
    </div>
    <div class="prob-grid four">
      <article class="prob-card ag-card reveal" data-d="1"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></div><h3>Rozšíříte svou nabídku</h3><p>Od fotoreportáže po AI fotostudio, tisk a projekci. Pro komorní večírky i velké eventy.</p></article>
      <article class="prob-card ag-card reveal" data-d="2"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg></div><h3>Získáte produkční zázemí</h3><p>Zajistíme domluvenou realizaci. Rozsah, techniku a odpovědnosti vyjasníme předem.</p></article>
      <article class="prob-card ag-card reveal" data-d="3"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z"/></svg></div><h3>Nabídnete vlastní branding</h3><p>Galerii i výstupy sladíme s konceptem, který pro klienta připravujete.</p></article>
      <article class="prob-card ag-card reveal" data-d="4"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg></div><h3>Máte jednoho partnera</h3><p>Fotografie, galerie, tisk, projekce a AI v rámci jednoho domluveného řešení.</p></article>
    </div>
  </div>
</section>

<section class="section" id="spoluprace" data-screen-label="Modely spolupráce">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="title">Jak může spolupráce fungovat?</h2>
      <p class="prob-sub">Tři modely. <span class="grad-text">Vyberete si ten, který vám sedí.</span></p>
    </div>
    <div class="models">
      <article class="model reveal" data-d="1"><span class="model-n">01</span><h3>Piclio jako váš produkční partner</h3><p>Službu nabídnete klientovi pod značkou vaší agentury, my ji v pozadí zrealizujeme. Rozsah, cenu, termíny, komunikaci i odpovědnosti nastavíme předem.</p></article>
      <article class="model reveal" data-d="2"><span class="model-n">02</span><h3>Doporučení klienta</h3><p>Pokud klient poptává fotografický servis přímo, doporučíte nás. Obchodní podmínky a případnou provizi domluvíme individuálně.</p></article>
      <article class="model reveal" data-d="3"><span class="model-n">03</span><h3>Společné řešení na míru</h3><p>U větších akcí připravíme kombinaci fotografování, AI fotostudia, tisku a projekce podle konceptu eventu.</p></article>
    </div>
  </div>
</section>

<section class="section" id="nabidka" data-screen-label="Co nabídnete">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2 class="title">Co můžete klientům nabídnout?</h2>
      <p class="prob-sub">Služby, které <span class="grad-pink">zapojí hosty.</span></p>
    </div>
    <div class="prob-grid">
      <article class="prob-card ag-card reveal" data-d="1"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg></div><h3>Eventovou fotografii</h3><p>Profesionální zachycení atmosféry, lidí a důležitých okamžiků.</p></article>
      <article class="prob-card ag-card reveal" data-d="2"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg></div><h3>Online galerii během akce</h3><p>Fotky průběžně dostupné hostům přes QR kód nebo odkaz.</p></article>
      <article class="prob-card ag-card reveal" data-d="3"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><h3>Živou projekci</h3><p>Vybrané fotky na obrazovce nebo plátně, v grafice akce.</p></article>
      <article class="prob-card ag-card reveal" data-d="1"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg></div><h3>Tisk fotografií</h3><p>Fyzické vzpomínky pro hosty, připravené přímo na místě.</p></article>
      <article class="prob-card ag-card reveal" data-d="2"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><path d="M12 5v4M9 13h.01M15 13h.01"/></svg></div><h3>AI fotostudio</h3><p>Tematické portréty a interaktivní proměny, které hosty baví.</p></article>
      <article class="prob-card ag-card reveal" data-d="3"><div class="ag-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg></div><h3>Řešení na míru</h3><p>Kombinace služeb podle programu, počtu hostů a požadavků klienta.</p></article>
    </div>
    <div class="dgal reveal" style="margin-top:36px">
      <div class="g wide"><img src="/lp-assets/lovec-foceni-mv3regx0-7pnh.jpeg" alt=""><span class="cap">Fotograf v dění</span></div>
      <div class="g"><img src="/lp-assets/kz-portret.jpg" alt=""><span class="cap">Portrét z akce</span></div>
      <div class="g"><img src="/lp-assets/flow-04-tisk.jpeg" alt=""><span class="cap">Tisk na místě</span></div>
      <div class="g"><img src="/lp-assets/hf_20261011_115125_00b33f31-2494-4193-9b-mv3rpygq-oa61.png" alt=""><span class="cap">Online galerie</span></div>
      <div class="g"><img src="/lp-assets/xmas-party-mv3r91xu-4mvs.jpg" alt=""><span class="cap">Zábavné scény</span></div>
    </div>
  </div>
</section>

<section class="section" id="podminky" data-screen-label="Podmínky">
  <div class="wrap">
    <div class="agency reveal">
      <div class="sec-head">
        <h2 class="title">Partnerské podmínky</h2>
        <p class="prob-sub">Model, který funguje <span class="grad-text">pro obě strany.</span></p>
        <p class="lead">Každá agentura pracuje jinak. Proto nejdřív domluvíme model spolupráce. Pokud chcete službu prodávat pod vlastní značkou, nastavíme i pravidla pro prezentaci Piclio, reference a ochranu vašeho vztahu s klientem.</p>
      </div>
      <div class="agency-card">
        <div class="ag-t">Co si předem nastavíme</div>
        <ul class="ag-list">
          <li>Partnerské ceny podle rozsahu a typu zakázek</li>
          <li>Jasně definované služby a technické požadavky</li>
          <li>Způsob komunikace s klientem</li>
          <li>Branding podle konceptu akce</li>
          <li>Fakturaci, změny a storno podmínky</li>
        </ul>
        <a class="btn btn-primary" href="#kontakt">Chci probrat partnerské ceny <span class="arr">→</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section" id="pilot" data-screen-label="První akce" style="padding-top:0">
  <div class="wrap">
    <div class="pilot reveal">
      <h2 class="title">Začněme jednou akcí</h2>
      <p class="prob-sub center">Bez rozsáhlých smluv. <span class="grad-pink">Ověřte si nás v praxi.</span></p>
      <p class="lead">Připravíme společně jednu zakázku, vyzkoušíme si průběh a podle zkušenosti se domluvíme na dalších. Máte v plánu vánoční večírek, konferenci nebo firemní akci? Projdeme s vámi možnosti.</p>
      <a class="btn btn-primary" href="#kontakt">Představit nám svou akci <span class="arr">→</span></a>
    </div>
  </div>
</section>

<section class="section" id="o-nas" data-screen-label="Tým" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head center reveal" style="max-width:720px">
      <h2 class="title">Kdo stojí za Piclio?</h2>
      <p class="lead" style="margin-inline:auto">Katarína a Luboš: dlouholetá fotografická a vizuální produkce. Propojujeme fotografii, světlo, kompozici a techniku s digitálními fotografickými zážitky. Naším úkolem je dodat domluvené řešení tak, aby zapadlo do celé produkce vaší akce.</p>
    </div>
    <div class="team-grid">
      <article class="member reveal" data-d="1">
        <div class="photo sketch"><img src="/lp-assets/team-katarina.png" alt="Katarína"></div>
        <div class="info"><div class="nm">Katarína</div><div class="rl">Obraz · Strategie · AI</div><p>Fotografie, obraz a vizuální pojetí projektů.</p></div>
      </article>
      <article class="member reveal" data-d="2">
        <div class="photo sketch"><img src="/lp-assets/team-lubos.png" alt="Luboš"></div>
        <div class="info"><div class="nm">Luboš</div><div class="rl">Světlo · Kompozice · Technika</div><p>Fotografická a filmová produkce, světlo a technická realizace.</p></div>
      </article>
    </div>
  </div>
</section>

<section class="section" id="kontakt" data-screen-label="Kontakt">
  <div class="wrap">
    <div class="contact-grid">
      <div class="contact-aside reveal">
        <h2 class="title">Pojďme se poznat</h2>
        <p class="prob-sub">Hledáte dodavatele, nebo chcete <span class="grad-pink">rozšířit nabídku?</span></p>
        <p class="lead">Napište nám pár informací. Ozveme se a probereme, jak by spolupráce mohla fungovat.</p>
        <div class="ci-list">
          <a class="ci" href="mailto:ahoj@piclio.cz"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><div><div class="k">E-mail</div><div class="v">ahoj@piclio.cz</div></div></a>
          <a class="ci" href="tel:+420604750776"><span class="em"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></span><div><div class="k">Telefon</div><div class="v">+420 604 750 776</div></div></a>
        </div>
      </div>
      <form class="cform reveal" data-d="1" id="poptForm" novalidate>
        <div class="form-ok" id="formOk">Děkujeme! Otevřeli jsme vám e-mail s vyplněnou zprávou — stačí odeslat. Ozveme se co nejdřív.</div>
        <div class="cfield">
          <label>O jakou spolupráci máte zájem?</label>
          <div class="pchips">
            <label class="pchip"><input type="radio" name="sluzba" value="Partnerská spolupráce — produkční partner" checked><span class="pc-body"><span class="pc-t">Produkční partner</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Partnerská spolupráce — doporučení klienta"><span class="pc-body"><span class="pc-t">Doporučení klienta</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Partnerská spolupráce — konkrétní akce"><span class="pc-body"><span class="pc-t">Konkrétní akce</span></span></label>
            <label class="pchip"><input type="radio" name="sluzba" value="Partnerská spolupráce — zatím nevím"><span class="pc-body"><span class="pc-t">Zatím nevím</span></span></label>
          </div>
        </div>
        <div class="cform-row">
          <div class="cfield"><label for="jmeno">Jméno a příjmení *</label><input id="jmeno" name="jmeno" type="text" placeholder="Jan Novák" required></div>
          <div class="cfield"><label for="firma">Firma a web</label><input id="firma" name="firma" type="text" placeholder="Agentura, www…"></div>
        </div>
        <div class="cform-row">
          <div class="cfield"><label for="email">E-mail *</label><input id="email" name="email" type="email" placeholder="jan@agentura.cz" required></div>
          <div class="cfield"><label for="tel">Telefon</label><input id="tel" name="tel" type="tel" placeholder="+420 …"></div>
        </div>
        <input type="hidden" name="datum" value=""><input type="hidden" name="hoste" value="">
        <div class="cfield"><label for="zprava">Poznámka nebo připravovaná akce</label><textarea id="zprava" name="zprava" placeholder="Typ akce, termín, počet hostů, co klient chce…"></textarea></div>
        <button type="submit" class="btn btn-primary">Domluvit nezávaznou schůzku <span class="arr">→</span></button>
        <p class="cform-note">Odesláním souhlasíte se zpracováním údajů dle <a href="/ochrana-osobnich-udaju" style="color:var(--muted);text-decoration:underline">zásad ochrany osobních údajů</a>.</p>
      </form>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <a class="brand" href="/"><img src="/lp-assets/piclio-logo.png" alt="Piclio"></a>
      <ul class="f-links">
        <li><a href="/">Hlavní stránka</a></li>
        <li><a href="/vanocni-vecirky">Vánoce &amp; plesy</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
      </ul>
    </div>
    <div class="copy">Piclio · Fotografická a technologická produkce pro eventy · © 2026 Studio Lucifera · <a href="/obchodni-podminky">Obchodní podmínky</a> · <a href="/ochrana-osobnich-udaju">Zásady ochrany osobních údajů</a></div>
  </div>
</footer>

<script src="/lp-motion.js"></script>
</body>
</html>` }} />
  )
}
