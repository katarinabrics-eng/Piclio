import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { photoId, guestId } = await req.json()
  if (!photoId || !guestId) {
    return NextResponse.json({ error: 'photoId and guestId are required' }, { status: 400 })
  }

  const { error: pgError } = await supabaseAdmin
    .from('photo_guests')
    .upsert({ photo_id: photoId, guest_id: guestId }, { onConflict: 'photo_id,guest_id' })

  if (pgError) return NextResponse.json({ error: pgError.message }, { status: 500 })

  const { error: statusError } = await supabaseAdmin
    .from('photos')
    .update({ status: 'matched' })
    .eq('id', photoId)

  if (statusError) return NextResponse.json({ error: statusError.message }, { status: 500 })

  const { error: rpcError } = await supabaseAdmin.rpc('increment_photo_count', { guest_id_arg: guestId })
  if (rpcError) {
    const { data: guestData } = await supabaseAdmin
      .from('guests')
      .select('photo_count')
      .eq('id', guestId)
      .single()
    if (guestData) {
      await supabaseAdmin
        .from('guests')
        .update({ photo_count: (guestData.photo_count ?? 0) + 1 })
        .eq('id', guestId)
    }
  }

  return NextResponse.json({ success: true })
}
