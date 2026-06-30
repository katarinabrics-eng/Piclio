import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { eventSlug: string; photoId: string } }
) {
  await supabaseAdmin
    .from('photos')
    .update({ is_deleted: true })
    .eq('id', params.photoId)

  return NextResponse.json({ ok: true })
}
