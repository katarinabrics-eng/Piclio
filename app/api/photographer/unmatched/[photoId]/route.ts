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

  // Fetch storage_path before deleting
  const { data: photo, error: fetchError } = await supabaseAdmin
    .from('photos')
    .select('storage_path')
    .eq('id', photoId)
    .single()

  if (fetchError || !photo) {
    // Already deleted — treat as success (idempotent)
    return NextResponse.json({ success: true })
  }

  // Remove from Storage (best-effort — don't block DB delete)
  const { error: storageError } = await supabaseAdmin.storage
    .from('photos')
    .remove([photo.storage_path])

  if (storageError) {
    console.error('Storage delete error:', storageError.message)
  }

  // Mark as deleted before removing DB row
  await supabaseAdmin.from('photos').update({ is_deleted: true }).eq('id', photoId)

  // Delete DB row
  const { error: dbError } = await supabaseAdmin
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  // Record deleted path so it never reappears
  await supabaseAdmin
    .from('deleted_photos')
    .upsert({ storage_path: photo.storage_path })

  // Smaž fyzický soubor z backendu
  try {
    await fetch(`https://piclio-backend.fly.dev/photos/${photoId}`, { method: 'DELETE' })
  } catch (e) {
    console.error('Backend delete failed:', e)
  }

  return NextResponse.json({ success: true })
}
