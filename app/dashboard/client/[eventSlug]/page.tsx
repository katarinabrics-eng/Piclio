import { notFound } from 'next/navigation'
import { ClientDashboard } from './ClientDashboard'

interface Props {
  params: { eventSlug: string }
}

async function getClientData(eventSlug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/client/${eventSlug}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function ClientDashboardPage({ params }: Props) {
  const data = await getClientData(params.eventSlug)
  if (!data || !data.event) notFound()

  return (
    <ClientDashboard
      event={data.event}
      guests={data.guests}
      stats={data.stats}
      unmatchedPhotos={data.unmatchedPhotos}
    />
  )
}

export const dynamic = 'force-dynamic'
