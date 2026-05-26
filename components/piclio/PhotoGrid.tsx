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
          columns: 3;
          column-gap: 8px;
        }
        @media (max-width: 600px) {
          .piclio-grid { columns: 2; }
        }
      `}</style>
      <div className="piclio-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => onPhotoClick(index)}
            style={{
              breakInside: 'avoid',
              marginBottom: 8,
              width: '100%',
              cursor: 'pointer',
              animation: newPhotoIds?.has(photo.id) ? 'piclio-fadein 0.5s ease' : 'none',
            }}
          >
            <img
              src={photo.url}
              alt={photo.filename}
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            />
          </div>
        ))}
      </div>
    </>
  )
}
