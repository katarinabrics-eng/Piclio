'use client'

import type { GalleryPhoto } from '@/lib/types'

interface PhotoGridProps {
  photos: GalleryPhoto[]
  onPhotoClick: (index: number) => void
  newPhotoIds?: Set<string>
}

export function PhotoGrid({ photos, onPhotoClick, newPhotoIds }: PhotoGridProps) {
  return (
    <>
      <style>{`
        @keyframes piclio-fadein {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 600px) {
          .piclio-photo-item img { height: 180px !important; }
        }
      `}</style>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start' }}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="piclio-photo-item"
            onClick={() => onPhotoClick(index)}
            style={{
              cursor: 'pointer',
              animation: newPhotoIds?.has(photo.id) ? 'piclio-fadein 0.5s ease' : 'none',
              borderRadius: 8,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={photo.url}
              alt={photo.filename}
              loading="lazy"
              style={{ height: 340, width: 'auto', display: 'block', borderRadius: 8, transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            />
          </div>
        ))}
      </div>
    </>
  )
}
