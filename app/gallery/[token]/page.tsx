import { notFound } from 'next/navigation'
import { GalleryClient } from './GalleryClient'

interface Props {
  params: { token: string }
}

async function getGalleryData(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/gallery/${token}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function GalleryPage({ params }: Props) {
  const data = await getGalleryData(params.token)
  if (!data || !data.guest) notFound()

  return (
    <GalleryClient
      token={params.token}
      initialGuest={data.guest}
      initialEvent={data.event}
      initialPhotos={data.photos}
    />
  )
}

export const dynamic = 'force-dynamic'
