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
        .piclio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 600px) {
          .piclio-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <div className="piclio-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => onPhotoClick(index)}
            style={{
              aspectRatio: '3/2',
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
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            />
          </div>
        ))}
      </div>
    </>
  )
}
