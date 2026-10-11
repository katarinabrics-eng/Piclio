import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vánoční večírky a plesy — Piclio fotografie',
  description: 'Profesionální fotografický servis a AI zážitky pro vánoční večírky, firemní party a plesy. Praha a celá ČR.',
}

export default function VanocniVecirkyPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vánoční večírky a plesy — fotografický servis Piclio</title>
<meta name="description" content="Profesionální fotografie, online galerie, tisk a AI zážitky na vánoční večírek, ples nebo galavečer. Vše propojené do jednoho fotografického servisu.">
<meta property="og:title" content="Vánoční večírky a plesy s Piclio">
<meta property="og:description" content="Zvýhodněné balíčky na vánoční večírky a plesy. Jedna online galerie celého večera, nové fotky v ní do minuty.">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/lp-styles.css">
<link rel="stylesheet" href="/lp-sections.css">
<link rel="stylesheet" href="/lp-concept.css">
<link rel="stylesheet" href="/lp-xmas.css">
</head>
<body>
<div class="aura" aria-hidden="true"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>

<nav class="nav" id="nav">
  <a class="brand" href="/"><img src="/lp-assets/piclio-logo.png" alt="Piclio"></a>
  <ul class="nav-links">
    <li><a href="#balicky">Balíčky</a></li>
    <li><a href="#sezona">Večírky &amp; plesy</a></li>
    <li><a href="#motivy">Vánoční motivy</a></li>
    <li><a href="#bonusy">Bonusy</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="/">Piclio</a></li>
  </ul>
  <div class="nav-cta">
    <a class="btn btn-primary" href="#rezervace">Rezervovat termín <span class="arr">→</span></a>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="#balicky">Balíčky</a>
  <a href="#sezona">Večírky &amp; plesy</a>
  <a href="#motivy">Vánoční motivy</a>
  <a href="#faq">FAQ</a>
  <a href="/">Piclio</a>
  <a class="btn btn-primary" href="#rezervace">Rezervovat termín →</a>
</div>

<!-- HERO -->
<header class="xhero" id="top" data-screen-label="Vánoce hero">
  <div class="bokeh" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="wrap">
    <div class="xhero-grid">
      <div>
        <span class="eyebrow reveal">Piclio · Vánoční večírky</span>
        <h1 class="reveal" data-d="1">Vánoční večírek, na kterém jsou fotky <span class="grad-text">součástí zábavy.</span></h1>
        <p class="sub reveal" data-d="2"><b>Profesionální fotografie, online galerie, tisk a AI zážitky.</b> Vše propojené do jednoho fotografického servisu pro váš firemní večírek.</p>
        <p class="sub sub-2 reveal" data-d="2">Nové snímky průběžně zpřístupňujeme v online galerii. Vybrané mohou ožít na projekci, skončit v rukou hostů jako výtisk nebo se proměnit v AI portréty. Vy si užíváte večer se svým týmem, o fotky se postaráme my.</p>
        <div class="hero-actions reveal" data-d="3">
          <a class="btn btn-primary" href="#balicky">Vybrat vánoční balíček <span class="arr">→</span></a>
          <a class="btn btn-ghost" href="#rezervace">Ověřit termín</a>
        </div>
        <div class="season-pills reveal" data-d="4">
          <span><b>Lis–Pro</b> vánoční večírky</span>
          <span><b>Led–Úno</b> plesy a novoroční akce</span>
        </div>
      </div>
      <div class="xhero-visual reveal" data-d="2">
        <div class="ph x1"><img src="/lp-assets/cat-galavecer.png" alt="Galavečer"></div>
        <div class="ph x2"><img src="/lp-assets/cat-ples.png" alt="Ples"></div>
        <div class="ph x3"><img src="/lp-assets/out-tisk.jpg" alt="Okamžitý tisk"></div>
        <div class="xhero-badge"><div class="t">Prosincové pátky</div><div class="v">mizí jako první</div><div class="s">Rezervujte s předstihem</div></div>
      </div>
    </div>
  </div>
</header>

<!-- EARLY BIRD -->
<section class="wrap reveal" style="margin-bottom:clamp(40px,6vw,72px)">
  <div class="eb-bar">
    <div class="eb-l">
      <div class="eb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1.5S9.5 8 12 8zM12 8c2-4 6-4 6-1.5S14.5 8 12 8z"/></svg></div>
      <div><div class="eb-t">Rezervace do 31. 10. = tisk fotek zdarma</div><div class="eb-s">Ke každému balíčku objednanému do konce října přidáme balíček tisku S (hodnota 3 000 Kč).</div></div>
    </div>
    <div class="eb-count" id="ebCount"><div><b id="ebD">–</b><span>dní</span></div><div><b id="ebH">–</b><span>hodin</span></div><div><b id="ebM">–</b><span>minut</span></div></div>
  </div>
</section>

<!-- MARQUEE -->
<section class="marquee-band" aria-hidden="true" style="padding-top:0">
  <div class="marquee-wrap">
    <div class="marquee row" style="--dur:70s">
      <div class="mq-item"><img src="/lp-assets/cat-firemni.png" alt=""><span class="tag">Vánoční večírek</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-ples.png" alt=""><span class="tag">Ples</span></div>
      <div class="mq-item portrait"><img src="/lp-assets/kz-portret.jpg" alt=""><span class="tag">Portrét večera</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-galavecer.png" alt=""><span class="tag">Galavečer</span></div>
      <div class="mq-item"><img src="/lp-assets/out-skupina.jpg" alt=""><span class="tag">Celý tým</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-raut.png" alt=""><span class="tag">Raut</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-afterparty.png" alt=""><span class="tag">After party</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-firemni.png" alt=""><span class="tag">Vánoční večírek</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-ples.png" alt=""><span class="tag">Ples</span></div>
      <div class="mq-item portrait"><img src="/lp-assets/kz-portret.jpg" alt=""><span class="tag">Portrét večera</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-galavecer.png" alt=""><span class="tag">Galavečer</span></div>
      <div class="mq-item"><img src="/lp-assets/out-skupina.jpg" alt=""><span class="tag">Celý tým</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-raut.png" alt=""><span class="tag">Raut</span></div>
      <div class="mq-item"><img src="/lp-assets/cat-afterparty.png" alt=""><span class="tag">After party</span></div>
    </div>
  </div>
</section>

<!-- WHY -->
<section class="section" data-screen-label="Proč">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Proč Piclio</span>
      <h2 class="title">Fotky, které vznikají <span class="grad-pink">přímo během večírku.</span></h2>
      <p class="lead">Vánoční večírek je nejsilnější moment firemní kultury. S Piclio z něj nezůstane jen vzpomínka, ale obsah, který tým sdílí a HR i marketing použijí celý rok.</p>
    </div>
    <div class="why-grid four">
      <article class="why reveal" data-d="1"><div class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/></svg></div><h3>Hosté nemusí čekat do příštího týdne</h3><p>Nové snímky se v galerii objevují průběžně, zpravidla do jedné minuty. Hosté je otevřou přes QR kód v mobilu a mohou je sdílet.</p></article>
      <article class="why reveal" data-d="2"><div class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 2 6 5.5"/></svg></div><h3>Zábava, do které se zapojí celý tým</h3><p>AI proměny a tematické portréty. Z kolegů se stanou filmové hvězdy, hrdinové vánočního příběhu nebo tváře magazínu.</p></article>
      <article class="why reveal" data-d="3"><div class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg></div><h3>Vzpomínka, kterou si odnesou domů</h3><p>Vybrané fotky vytiskneme přímo na místě. Během večera se mohou objevit i na projekci v grafice vaší firmy.</p></article>
      <article class="why reveal" data-d="4"><div class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z"/><path d="M19 15l.8 2.4L22 18l-2.2.6L19 21l-.8-2.4L16 18l2.2-.6L19 15z"/></svg></div><h3>Employer branding zdarma</h3><p>Zaměstnanci sdílí fotky na LinkedIn a Instagram. Vaše firma ukazuje kulturu, kterou si lidé přejí zažít.</p></article>
    </div>
  </div>
</section>

<!-- PACKAGES -->
<section class="section" id="balicky" data-screen-label="Balíčky" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Sezónní balíčky</span>
      <h2 class="title">Vyberte si balíček <span class="grad-text">pro svůj večírek.</span></h2>
      <p class="lead">Přijedeme, postavíme, fotíme a doručíme fotky každému hostu. Systém Piclio, obsluha i doprava po Praze jsou v ceně.</p>
    </div>
    <div class="pk-grid">
      <article class="pk reveal" data-d="1">
        <div class="pk-ph"><img src="/lp-assets/xmas-pripitek.png?v=2" alt="Fotokoutek na vánočním večírku" style="object-position:center 30%"><span class="pk-flag alt">Pro menší týmy</span></div>
        <div class="pk-body">
          <div class="pk-name">Přípitek</div>
          <div class="pk-for">Až 80 hostů · 3 hodiny</div>
          <div class="pk-tag">Pro menší týmy a komornější večírky</div>
          <div class="pk-price"><b>16 900 Kč</b></div>
          <span class="pk-save">Tisk S zdarma při rezervaci do 31. 10.</span>
          <ul class="pk-list">
            <li>Fotoreport — 1 fotograf</li>
            <li>AI Magic Corner bez obsluhy (fotograf pomůže, když je potřeba)</li>
            <li>Vánoční AI motivy na míru tématu</li>
            <li>Online galerie celého večera, fotky zpravidla do minuty</li>
            <li>Galerie dostupná 30 dní</li>
          </ul>
          <a class="btn btn-ghost pick" href="#rezervace" data-pk="Přípitek">Poptat balíček Přípitek <span class="arr">→</span></a>
        </div>
      </article>

      <article class="pk hot reveal" data-d="2">
        <div class="pk-ph"><img src="/lp-assets/xmas-bar.png" alt="Vánoční večírek u baru" style="object-position:center 40%"><span class="pk-flag hot">Nejoblíbenější</span></div>
        <div class="pk-body">
          <div class="pk-name">Vánoční večírek</div>
          <div class="pk-for">80–250 hostů · 4 hodiny</div>
          <div class="pk-tag">Pro větší firemní party, kde se pořád něco děje</div>
          <div class="pk-price"><b>29 900 Kč</b></div>
          <ul class="pk-list">
            <li>Fotoreport — 1 fotograf v centru dění</li>
            <li>AI Magic Corner s vlastní obsluhou</li>
            <li>Tematické vánoční AI proměny</li>
            <li>Okamžitý tisk — balíček S (200 fotek)</li>
            <li>Online galerie s logem vaší firmy</li>
            <li>Fotky v galerii zpravidla do minuty</li>
          </ul>
          <a class="btn btn-primary pick" href="#rezervace" data-pk="Vánoční večírek">Poptat balíček Vánoční večírek <span class="arr">→</span></a>
        </div>
      </article>

      <article class="pk reveal" data-d="3">
        <div class="pk-ph"><img src="/lp-assets/cat-ples.png" alt="Ples"><span class="pk-flag alt">Plesy &amp; galavečery</span></div>
        <div class="pk-body">
          <div class="pk-name">Plesová noc</div>
          <div class="pk-for">250+ hostů · celý večer</div>
          <div class="pk-tag">Pro velké plesy, galavečery a slavnostní akce</div>
          <div class="pk-price"><b>44 900 Kč</b></div>
          <ul class="pk-list">
            <li>1 fotograf po celý večer</li>
            <li>Fotograf v reálném fotokoutku s prémiovou scénou na míru</li>
            <li>Okamžitý tisk — balíček M (500 fotek)</li>
            <li>Živé promítání fotek na plátno</li>
            <li class="plus">Plesové AI portréty a tematické výstupy</li>
            <li class="plus">Volitelně osobní galerie s registrací</li>
          </ul>
          <a class="btn btn-ghost pick" href="#rezervace" data-pk="Plesová noc">Poptat balíček Plesová noc <span class="arr">→</span></a>
        </div>
      </article>
    </div>
    <p class="pk-note reveal">Ceny jsou včetně DPH. Akce mimo Prahu (celá ČR i SR), delší provoz nebo vlastní kombinace připravíme na míru. Zahrnuté služby potvrdíme v konkrétní nabídce.</p>
    <div class="eb-bar reveal" style="margin-top:28px">
      <div class="eb-l">
        <div class="eb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg></div>
        <div><div class="eb-t">Garance spokojenosti</div><div class="eb-s">Pokud nebudete s výsledkem spokojeni, vrátíme vám peníze. Podmínky najdete v <a href="/obchodni-podminky">obchodních podmínkách</a>.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- SEASON -->
<section class="section" id="sezona" data-screen-label="Sezóna">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Celá zimní sezóna</span>
      <h2 class="title">Od prvního přípitku <span class="grad-pink">po poslední ples.</span></h2>
    </div>
    <div class="season-grid">
      <article class="season reveal" data-d="1">
        <img src="/lp-assets/xmas-pripitek-speech.png" alt="Vánoční přípitek" style="object-position:center 30%">
        <span class="when">Listopad – prosinec</span>
        <h3>Vánoční večírky</h3>
        <p>Firemní večírky, večírky pro klienty i vánoční rauty. Vánoční AI motivy, brandovaná galerie a tisk, který si lidé odnesou domů.</p>
        <ul><li>Firemní večírky</li><li>Klientské akce</li><li>Vánoční rauty</li></ul>
      </article>
      <article class="season reveal" data-d="2">
        <img src="/lp-assets/cat-ples.png" alt="Ples">
        <span class="when">Leden – únor</span>
        <h3>Plesy a novoroční akce</h3>
        <p>Plesy, galavečery a novoroční setkání. Elegantní portréty v plesových šatech, reálná scéna a živé promítání na plátno.</p>
        <ul><li>Plesy</li><li>Galavečery</li><li>Novoroční setkání</li></ul>
      </article>
    </div>
  </div>
</section>

<!-- THEMES -->
<section class="section" id="motivy" data-screen-label="Motivy" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Co si host odnese</span>
      <h2 class="title">Profi fotky. A k tomu <span class="grad-text">sezónní AI kouzla.</span></h2>
      <p class="lead">Motivy ladíme k vašemu večírku. Hostům se zobrazí jen ty, které předem schválíte.</p>
    </div>
    <div class="theme-grid">
      <figure class="theme reveal" data-d="1"><img src="/lp-assets/kz-portret.jpg" alt="Portrét večera"><figcaption class="lab"><b>Portrét večera</b><span>Profi fotka od fotografa</span></figcaption></figure>
      <figure class="theme reveal" data-d="2"><img src="/lp-assets/o-obalka-a.jpg" alt="Vánoční obálka"><figcaption class="lab"><b>Vánoční obálka</b><span>Host na titulní straně</span></figcaption></figure>
      <figure class="theme reveal" data-d="3"><img src="/lp-assets/o-portret-b.png" alt="Plesový portrét"><figcaption class="lab"><b>Plesový portrét</b><span>Jako zarámovaná malba</span></figcaption></figure>
      <figure class="theme reveal" data-d="4"><img src="/lp-assets/xmas-plakat.png" alt="Filmový plakát"><figcaption class="lab"><b>Filmový plakát</b><span>Host jako hrdina blockbusteru</span></figcaption></figure>
      <figure class="theme reveal" data-d="1"><img src="/lp-assets/xmas-pf.png" alt="Firemní PF" style="object-position:center top"><figcaption class="lab"><b>Firemní PF</b><span>Každý si udělá PF v duchu firmy</span></figcaption></figure>
      <figure class="theme reveal" data-d="2"><img src="/lp-assets/xmas-party.jpg" alt="Party styl"><figcaption class="lab"><b>Party styl</b><span>Hollywood, retro, pink, devadesátky…</span></figcaption></figure>
      <figure class="theme reveal" data-d="3"><img src="/lp-assets/xmas-karikatura.jpg" alt="Karikatura"><figcaption class="lab"><b>Karikatura</b><span>Zábavná postavička z hosta</span></figcaption></figure>
      <figure class="theme reveal" data-d="4"><img src="/lp-assets/xmas-zamestnanec2.png" alt="Zaměstnanec roku" style="object-position:center 20%"><figcaption class="lab"><b>Zaměstnanec roku</b><span>Vtipná trofej na památku</span></figcaption></figure>
    </div>
  </div>
</section>

<!-- BONUSY -->
<section class="section" id="bonusy" data-screen-label="Bonusy" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Vánoční bonusy</span>
      <h2 class="title">Večírek ve vánočním duchu <span class="grad-pink">až do poslední fotky.</span></h2>
      <p class="lead">Ke každému balíčku přidáme sezónní grafiku, takže fotky, tisk i galerie ponesou atmosféru Vánoc a vaši značku.</p>
    </div>
    <div class="bonus-grid">
      <article class="bonus reveal" data-d="1">
        <div class="bonus-ph" style="aspect-ratio:1264/848"><img src="/lp-assets/xmas-grafika.png" alt="Vánoční grafika na výtisku" style="width:100%;height:100%;object-fit:contain"></div>
        <div class="bonus-body"><span class="bonus-tag">Bonus</span><h3>Vánoční grafika na fotkách</h3><p>Rámeček nebo overlay na každé fotce i výtisku — vánoční motiv sladěný s logem a barvami vaší firmy.</p></div>
      </article>
      <article class="bonus reveal" data-d="2">
        <div class="bonus-ph" style="aspect-ratio:1264/848"><img src="/lp-assets/xmas-galerie.png" alt="Vánoční online galerie v mobilu" style="width:100%;height:100%;object-fit:contain"></div>
        <div class="bonus-body"><span class="bonus-tag">Bonus</span><h3>Galerie ve vánočním duchu</h3><p>Online galerie večera s vánočním designem, vaším logem a úvodním přáním. Hosté ji otevřou v mobilu a sdílí dál.</p></div>
      </article>
      <article class="bonus reveal" data-d="3">
        <div class="bonus-ph" style="aspect-ratio:1264/848"><img src="/lp-assets/xmas-pf2.png" alt="Firemní PF se zaměstnanci" style="width:100%;height:100%;object-fit:contain"></div>
        <div class="bonus-body"><span class="bonus-tag">Bonus</span><h3>Firemní PF se zaměstnanci</h3><p>Z fotek večera vznikne PF pro klienty a partnery — s celým týmem a v duchu vaší firmy.</p></div>
      </article>
    </div>
  </div>
</section>

<!-- STEPS -->
<section class="section" id="prubeh" data-screen-label="Průběh" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Průběh</span>
      <h2 class="title">Jak to celé <span class="grad-text">probíhá?</span></h2>
    </div>
    <div class="xsteps">
      <div class="xstep reveal"><span class="xn">1</span><h3>Napíšete nám základní informace</h3><p>Datum, místo, počet hostů a představu o večírku.</p></div>
      <div class="xstep reveal"><span class="xn">2</span><h3>Společně vybereme řešení</h3><p>Doporučíme balíček a domluvíme grafiku, technické podmínky i rozsah služeb.</p></div>
      <div class="xstep reveal"><span class="xn">3</span><h3>Přijedeme a postaráme se o realizaci</h3><p>Fotíme, provozujeme sjednané zážitky a průběžně zpřístupňujeme fotky.</p></div>
      <div class="xstep reveal"><span class="xn">4</span><h3>Hosté si odnášejí vlastní vzpomínky</h3><p>Fotky v mobilu, výtisky a zážitky, o kterých se mluví i po večírku.</p></div>
    </div>
  </div>
</section>

<!-- BOOKING -->
<section class="section" id="rezervace" data-screen-label="Rezervace">
  <div class="wrap xform-wrap">
    <div class="xform-side reveal">
      <span class="eyebrow">Rezervace</span>
      <h2 class="title">Rezervujte si <span class="grad-pink">termín.</span></h2>
      <p class="lead">Vánoční období bývá pro firemní akce vytížené. Napište nám, kdy a kde se váš večírek koná, a ověříme dostupnost.</p>
      <ul class="pts">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>Nezávazně, bez zálohy při poptávce</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>Tisk S zdarma při rezervaci do 31. 10.</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>Garance vrácení peněz při nespokojenosti</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>Praha, celá ČR i SR</li>
      </ul>
      <p class="pts-t">Stačí uvést datum, místo, počet hostů a představu o večírku. Ozveme se do 24 hodin s návrhem řešení.</p>
    </div>
    <form class="xform reveal" id="xform" data-d="1">
      <label>Jméno<input name="jmeno" required placeholder="Jana Nováková"></label>
      <label>Firma<input name="firma" placeholder="Název firmy"></label>
      <label>E-mail<input name="email" type="email" required placeholder="jana@firma.cz"></label>
      <label>Telefon<input name="telefon" type="tel" placeholder="+420 …"></label>
      <label>Datum akce<input name="datum" type="date"></label>
      <label>Počet hostů<select name="hoste"><option>do 80</option><option selected>80–250</option><option>250+</option></select></label>
      <label class="full">Balíček<select name="balicek" id="pkSelect"><option>Přípitek</option><option selected>Vánoční večírek</option><option>Plesová noc</option><option>Nevím, poraďte mi</option></select></label>
      <label class="full">Poznámka<textarea name="pozn" placeholder="Místo konání, téma večera, cokoliv dalšího…"></textarea></label>
      <button class="btn btn-primary" type="submit">Ověřit termín a získat nabídku <span class="arr">→</span></button>
      <p class="fine">Nebo rovnou: <a href="mailto:ahoj@piclio.cz">ahoj@piclio.cz</a> · <a href="tel:+420604750776">+420 604 750 776</a></p>
    </form>
  </div>
</section>

<!-- FAQ -->
<section class="section" id="faq" data-screen-label="FAQ" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow center">Časté otázky</span>
      <h2 class="title">Než si <span class="grad-text">rezervujete.</span></h2>
    </div>
    <div class="faq reveal" id="faqList">
      <div class="faq-item open"><button class="faq-q">Musí si hosté něco instalovat?<span class="pm">+</span></button><div class="faq-a"><p>Ne. Online galerii otevřou v mobilu přes QR kód nebo odkaz.</p></div></div>
      <div class="faq-item"><button class="faq-q">Jak rychle budou fotky dostupné?<span class="pm">+</span></button><div class="faq-a"><p>Nové fotografie se v galerii objevují průběžně, zpravidla do jedné minuty od pořízení.</p></div></div>
      <div class="faq-item"><button class="faq-q">Můžeme mít vlastní grafiku a logo?<span class="pm">+</span></button><div class="faq-a"><p>Ano. Rozsah přizpůsobení se odvíjí od balíčku a domluveného řešení.</p></div></div>
      <div class="faq-item"><button class="faq-q">Můžeme balíček upravit nebo objednat jen část?<span class="pm">+</span></button><div class="faq-a"><p>Ano. Prodloužíme provoz, přidáme větší tisk, živé promítání nebo druhého fotografa. Prověříme i samostatné služby. Napište nám, co plánujete.</p></div></div>
            <div class="faq-item"><button class="faq-q">Jak dlouho dopředu je potřeba rezervovat?<span class="pm">+</span></button><div class="faq-a"><p>Na prosincové pátky a soboty doporučujeme rezervovat nejpozději v říjnu — tyto termíny se plní jako první. Na plesy v lednu a únoru stačí obvykle 4–6 týdnů předem.</p></div></div>
      <div class="faq-item"><button class="faq-q">Jezdíte i mimo Prahu?<span class="pm">+</span></button><div class="faq-a"><p>Ano, po celé ČR i na Slovensku. Doprava mimo Prahu se účtuje podle vzdálenosti a uvidíte ji v nabídce předem.</p></div></div>
      <div class="faq-item"><button class="faq-q">Jak je to s ochranou fotek a GDPR?<span class="pm">+</span></button><div class="faq-a"><p>Galerie je dostupná jen přes odkaz nebo QR kód z vaší akce a hosté nemusí zadávat žádné osobní údaje. Po dohodnuté době ji automaticky mažeme. Volitelně lze zapnout osobní galerie s registrací.</p></div></div>
      <div class="faq-item"><button class="faq-q">Můžeme vidět ukázky realizací?<span class="pm">+</span></button><div class="faq-a"><p>Ano. Některé akce nemůžeme veřejně prezentovat, proto na vyžádání poskytneme soukromé ukázky v rozsahu, který můžeme sdílet.</p></div></div>
    </div>
    <div class="faq-cta reveal"><a class="btn btn-primary" href="#rezervace">Chci vánoční nabídku Piclio <span class="arr">→</span></a></div>
  </div>
</section>

<p class="wrap" style="color:var(--muted-2);font-size:13.5px;text-align:center;padding-bottom:32px;max-width:760px;text-wrap:pretty">Některé fotografie na této stránce jsou ilustrační. Naši klienti pořádají soukromé akce a my si jejich soukromí vážíme. Pokud byste rádi viděli reference a portfolio realizací, rádi vám je zašleme — stačí napsat na <a href="mailto:ahoj@piclio.cz">ahoj@piclio.cz</a>.</p>

<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <a class="brand" href="/"><img src="/lp-assets/piclio-logo.png" alt="Piclio"></a>
      <ul class="f-links">
        <li><a href="#balicky">Balíčky</a></li>
        <li><a href="#sezona">Večírky &amp; plesy</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="/">Hlavní stránka</a></li>
      </ul>
    </div>
    <div class="copy">© 2026 Studio Lucifera · Piclio · Kampa, Praha · <a href="/obchodni-podminky">Obchodní podmínky</a> · <a href="/ochrana-osobnich-udaju">Zásady ochrany osobních údajů</a></div>
  </div>
</footer>

<script src="/lp-image-slot.js"></script>
<script src="/lp-motion.js"></script>
<script>
(function () {
  // early-bird countdown
  var end = new Date("2026-10-31T23:59:59+01:00").getTime();
  var D = document.getElementById("ebD"), H = document.getElementById("ebH"), M = document.getElementById("ebM"), box = document.getElementById("ebCount");
  function tick() {
    var ms = end - Date.now();
    if (ms <= 0) { if (box) box.style.display = "none"; return; }
    D.textContent = Math.floor(ms / 864e5);
    H.textContent = Math.floor(ms / 36e5) % 24;
    M.textContent = Math.floor(ms / 6e4) % 60;
  }
  tick(); setInterval(tick, 30000);

  // package buttons preselect form
  var sel = document.getElementById("pkSelect");
  document.querySelectorAll(".pick").forEach(function (b) {
    b.addEventListener("click", function () { if (sel) sel.value = b.getAttribute("data-pk"); });
  });

  // form -> mailto
  var f = document.getElementById("xform");
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(f), lines = [];
    d.forEach(function (v, k) { if (v) lines.push(k + ": " + v); });
    var subj = "Vánoční poptávka — " + (d.get("balicek") || "") + (d.get("firma") ? " · " + d.get("firma") : "");
    window.location.href = "mailto:ahoj@piclio.cz?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(lines.join("\n"));
  });
})();
</script>
</body>
</html>` }} />
  )
}
