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

  // Delete DB row
  const { error: dbError } = await supabaseAdmin
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
