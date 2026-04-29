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
      `}</style>
      <div style={{ columns: '3 180px', columnGap: 8 }}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => onPhotoClick(index)}
            style={{
              breakInside: 'avoid',
              marginBottom: 8,
              cursor: 'pointer',
              borderRadius: 8,
              overflow: 'hidden',
              animation: newPhotoIds?.has(photo.id) ? 'piclio-fadein 0.5s ease' : 'none',
            }}
          >
            <img
              src={photo.url}
              alt={photo.filename}
              loading="lazy"
              style={{ width: '100%', display: 'block', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            />
          </div>
        ))}
      </div>
    </>
  )
}
