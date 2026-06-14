import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://piclio.vercel.app'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { guestId } = await req.json()
  if (!guestId) return NextResponse.json({ error: 'Missing guestId' }, { status: 400 })

  const { data: guest, error: guestError } = await supabaseAdmin
    .from('guests')
    .select('id, email, badge_number, gallery_token, event_id')
    .eq('id', guestId)
    .single()

  if (guestError || !guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('name')
    .eq('id', guest.event_id)
    .single()

  const eventName = event?.name ?? 'akci'
  const galleryUrl = `${APP_URL}/gallery/${guest.gallery_token}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Piclio <noreply@piclio.cz>',
    to: [guest.email],
    subject: `Vaše fotografie z akce ${eventName}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: #1a1225; padding: 32px; text-align: center; }
    .logo { color: #b7e94c; font-size: 24px; font-weight: 500; letter-spacing: -0.5px; }
    .logo-sub { color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
    .body { padding: 32px; }
    .title { font-size: 20px; color: #1a1225; margin: 0 0 8px; }
    .subtitle { color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
    .badge-box { background: #f9fafb; border: 2px solid #b7e94c; border-radius: 10px; padding: 16px 24px; text-align: center; margin-bottom: 24px; }
    .badge-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge-number { font-size: 40px; font-weight: 900; color: #1a1225; line-height: 1.1; }
    .btn { display: block; background: #b7e94c; color: #1a1225; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: 600; text-align: center; font-size: 15px; }
    .footer { padding: 20px 32px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Piclio</div>
      <div class="logo-sub">by Lucifera Studio</div>
    </div>
    <div class="body">
      <h2 class="title">Vítejte na ${eventName}!</h2>
      <p class="subtitle">Byli jste zaregistrováni pod číslem odznaku:</p>
      <div class="badge-box">
        <div class="badge-label">Číslo vašeho odznaku</div>
        <div class="badge-number">${guest.badge_number}</div>
      </div>
      <p class="subtitle">
        Všechny vaše fotografie z večera najdete na tomto odkazu.
        Galerie se automaticky doplňuje v průběhu celé akce.
      </p>
      <a href="${galleryUrl}" class="btn">Otevřít moji galerii &rarr;</a>
    </div>
    <div class="footer">Piclio by Lucifera Studio</div>
  </div>
</body>
</html>`,
  })

  await supabaseAdmin
    .from('guests')
    .update({ email_sent_at: new Date().toISOString() })
    .eq('id', guestId)

  return NextResponse.json({ sent: true })
}
