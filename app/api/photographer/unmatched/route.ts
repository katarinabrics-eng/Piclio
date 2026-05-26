import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const eventId = req.nextUrl.searchParams.get('eventId')

  let query = supabaseAdmin
    .from('photos')
    .select('id, filename, storage_path, uploaded_at, ocr_number, event_id, status')
    .eq('status', 'unmatched')

  if (eventId) query = query.eq('event_id', eventId)

  const { data: photos, error } = await query.order('uploaded_at', { ascending: false })

  console.log('unmatched query — eventId:', eventId, 'count:', photos?.length ?? 0, 'error:', error?.message ?? null)

  if (error) {
    console.error('unmatched query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!photos || photos.length === 0) return NextResponse.json({ photos: [] })

  const paths = photos.map(p => p.storage_path)
  console.log('unmatched paths to sign:', paths)
  let signedUrls: { signedUrl: string | null }[] | null = null
  try {
    const { data, error: urlError } = await supabaseAdmin.storage
      .from('photos')
      .createSignedUrls(paths, 3600)
    if (urlError) console.error('createSignedUrls batch error:', urlError.message)
    console.log('batch signedUrls result:', data?.map((d, i) => ({ path: paths[i], ok: !!d.signedUrl })))
    signedUrls = data
  } catch (e) {
    console.error('createSignedUrls threw:', e)
  }
  // Fallback: individual signed URL calls for any path that got no URL
  if (!signedUrls || signedUrls.some(s => !s.signedUrl)) {
    signedUrls = await Promise.all(
      paths.map(async (path, i) => {
        if (signedUrls?.[i]?.signedUrl) return signedUrls[i]
        try {
          const { data } = await supabaseAdmin.storage
            .from('photos').createSignedUrl(path, 3600)
          console.log('individual signedUrl:', path, '->', data?.signedUrl ? 'OK' : 'MISSING')
          if (!data?.signedUrl) console.warn('no signedUrl for path:', path)
          return { signedUrl: data?.signedUrl ?? null }
        } catch (e) {
          console.error('createSignedUrl failed for', path, e)
          return { signedUrl: null }
        }
      })
    )
  }

  const photosWithUrls = photos.map((p, i) => ({
    ...p,
    url: signedUrls?.[i]?.signedUrl ?? '',
  }))

  return NextResponse.json({ photos: photosWithUrls })
}
