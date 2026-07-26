import { motion } from 'framer-motion'
import './PhotoFrames.css'

type FramePhoto = {
  id: string
  url: string
  alt?: string
}

type PhotoFramesProps = {
  photos: FramePhoto[]
  onOpen?: (index: number) => void
  interactive?: boolean
}

export function PhotoFrames({
  photos,
  onOpen,
  interactive = true,
}: PhotoFramesProps) {
  const count = Math.min(Math.max(photos.length, 1), 5)

  return (
    <div
      className={`photo-frames photo-frames--${count}`}
      data-count={count}
    >
      {photos.slice(0, 5).map((photo, index) => (
        <motion.figure
          key={photo.id}
          className={`photo-frames__item photo-frames__item--${index + 1}`}
          initial={{ opacity: 0, y: 18, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {interactive && onOpen ? (
            <button
              type="button"
              className="photo-frames__button"
              onClick={() => onOpen(index)}
              aria-label={`Open photo ${index + 1}`}
            >
              <img src={photo.url} alt={photo.alt ?? ''} />
            </button>
          ) : (
            <img src={photo.url} alt={photo.alt ?? ''} />
          )}
        </motion.figure>
      ))}
    </div>
  )
}
