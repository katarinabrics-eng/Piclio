import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function sendInviteEmail(
  clientEmail: string,
  clientName: string,
  eventName: string,
  slug: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const { Resend } = await import('resend')
  const resend = new Resend(key)
  const APP_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://piclio.vercel.app'
  const dashboardUrl = `${APP_URL}/dashboard/client/${slug}`

  await resend.emails.send({
    from: 'Piclio <onboarding@resend.dev>',
    to: [clientEmail],
    subject: `Byli jste přizváni ke spolupráci na eventu ${eventName}`,
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
    .title { font-size: 20px; color: #1a1225; margin: 0 0 12px; }
    .text { color: #555; font-size: 14px; line-height: 1.7; margin: 0 0 24px; }
    .btn { display: block; background: #b7e94c; color: #1a1225; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: 700; text-align: center; font-size: 15px; }
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
      <h2 class="title">Dobrý den, ${clientName}!</h2>
      <p class="text">
        Fotograf vás přizval ke spolupráci na akci <strong>${eventName}</strong>.<br>
        Kliknutím na odkaz níže získáte přístup k dashboardu, kde můžete nahrát logo,
        barvy a požadavky k akci.
      </p>
      <a href="${dashboardUrl}" class="btn">Otevřít dashboard &rarr;</a>
    </div>
    <div class="footer">Piclio by Lucifera Studio</div>
  </div>
</body>
</html>`,
  }).catch(err => console.error('Invite email failed:', err))
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, location, status, max_guests, client_name')
    .order('date', { ascending: false })

  if (!events) return NextResponse.json({ events: [] })

  const eventsWithStats = await Promise.all(events.map(async (event) => {
    const [
      { count: guestCount },
      { count: photoCount },
      { count: unmatchedCount },
      { count: deliveredCount },
    ] = await Promise.all([
      supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('event_id', event.id),
      supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id),
      supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id).eq('status', 'unmatched'),
      supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('event_id', event.id).not('email_sent_at', 'is', null),
    ])
    return { ...event, guestCount: guestCount ?? 0, photoCount: photoCount ?? 0, unmatchedCount: unmatchedCount ?? 0, deliveredCount: deliveredCount ?? 0 }
  }))

  return NextResponse.json({ events: eventsWithStats })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, date, location, maxGuests, clientName, clientEmail, brandColor } = body

  if (!name || !date || !location || !clientName || !clientEmail) {
    return NextResponse.json({ error: 'Chybí povinná pole' }, { status: 400 })
  }

  const slug = toSlug(name)

  const { data: event, error } = await supabaseAdmin
    .from('events')
    .insert({
      name,
      slug,
      date,
      location,
      max_guests: maxGuests ?? 100,
      client_name: clientName,
      client_email: clientEmail,
      brand_color: brandColor ?? '#b7e94c',
      status: 'draft',
    })
    .select('id, name, slug, date, location, status, max_guests, client_name')
    .single()

  if (error || !event) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Nepodařilo se vytvořit event' }, { status: 500 })
  }

  // Send invite email — best-effort
  sendInviteEmail(clientEmail, clientName, name, slug).catch(() => {})

  return NextResponse.json({
    event: { ...event, guestCount: 0, photoCount: 0, unmatchedCount: 0, deliveredCount: 0 },
  })
}
