import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { photoIds } = await req.json() as { photoIds: string[] }
  if (!photoIds?.length) return NextResponse.json({ error: 'No photos selected' }, { status: 400 })

  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('id, event_id')
    .eq('gallery_token', params.token)
    .single()

  if (!guest) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabaseAdmin.from('orders').insert({
    guest_id: guest.id,
    event_id: guest.event_id,
    photo_ids: photoIds,
    status: 'pending',
  })

  return NextResponse.json({ ok: true })
}
