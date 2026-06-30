import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function POST(
  req: NextRequest,
  { params }: { params: { photoId: string } }
) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { direction } = await req.json() as { direction: 'left' | 'right' }
  if (direction !== 'left' && direction !== 'right') {
    return NextResponse.json({ error: 'Invalid direction' }, { status: 400 })
  }

  const { data: photo } = await supabaseAdmin
    .from('photos')
    .select('storage_path')
    .eq('id', params.photoId)
    .single()

  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

  const { data: fileData, error: dlError } = await supabaseAdmin.storage
    .from('photos')
    .download(photo.storage_path)

  if (dlError || !fileData) return NextResponse.json({ error: 'Download failed' }, { status: 500 })

  const degrees = direction === 'right' ? 90 : -90
  const inputBuffer = Buffer.from(await fileData.arrayBuffer())
  const rotatedBuffer = await sharp(inputBuffer).rotate(degrees).toBuffer()

  const { error: upError } = await supabaseAdmin.storage
    .from('photos')
    .upload(photo.storage_path, rotatedBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (upError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
