export type EventStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived'

export interface PiclioEvent {
  id: string
  name: string
  slug: string
  date: string
  location: string | null
  status: EventStatus
  max_guests: number
  client_name: string | null
  client_logo_url: string | null
  brand_color: string
}

export interface Guest {
  id: string
  event_id: string
  email: string
  name: string | null
  badge_number: number | null
  gallery_token: string
  photo_count: number
  email_sent_at: string | null
  registered_at: string
}

export interface GalleryPhoto {
  id: string
  url: string
  filename: string
  taken_at: string | null
  uploaded_at: string
}

export interface EventWithStats extends PiclioEvent {
  guestCount: number
  photoCount: number
  unmatchedCount: number
  deliveredCount: number
}

export interface UnmatchedPhoto {
  id: string
  url: string
  filename: string
  storage_path: string
  uploaded_at: string
  ocr_number: number | null
  event_id: string
  status: string
}
