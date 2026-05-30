export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { photoId: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { photoId } = params

  const { data: photo, error: fetchError } = await supabaseAdmin
    .from('photos')
    .select('storage_path, filename')
    .eq('id', photoId)
    .single()

  if (fetchError || !photo) {
    return NextResponse.json({ success: true })
  }

  // Soft delete — nemaž řádek, jen označ jako smazaný
  await supabaseAdmin
    .from('photos')
    .update({ is_deleted: true })
    .eq('id', photoId)

  // Přidej do blacklistu
  await supabaseAdmin
    .from('deleted_photos')
    .upsert({ storage_path: photo.storage_path })

  // Smaž ze Storage (best-effort)
  await supabaseAdmin.storage
    .from('photos')
    .remove([photo.storage_path])

  // Smaž fyzický soubor z backendu (best-effort)
  try {
    await fetch(`https://piclio-backend.fly.dev/photos/${photoId}`, { method: 'DELETE' })
  } catch (e) {
    console.error('Backend delete failed:', e)
  }

  return NextResponse.json({ success: true })
}
