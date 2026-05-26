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
          .piclio-grid { columns: 2 !important; }
        }
      `}</style>
      <div
        className="piclio-grid"
        style={{ columns: 3, columnGap: 8 }}
      >
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
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 8,
              aspectRatio: '3/2',
            }}
          >
            <img
              src={photo.url}
              alt={photo.filename}
              loading="lazy"
              onLoad={e => {
                const img = e.currentTarget
                const isPortrait = img.naturalHeight > img.naturalWidth
                if (img.parentElement) img.parentElement.style.aspectRatio = isPortrait ? '2/3' : '3/2'
              }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 8, transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            />
          </div>
        ))}
      </div>
    </>
  )
}
