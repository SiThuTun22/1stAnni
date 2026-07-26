import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './Lightbox.css'

type LightboxProps = {
  open: boolean
  images: { id: string; url: string }[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function Lightbox({
  open,
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        onIndexChange((index + 1) % images.length)
      }
      if (e.key === 'ArrowLeft') {
        onIndexChange((index - 1 + images.length) % images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, index, images.length, onClose, onIndexChange])

  const current = images[index]

  return (
    <AnimatePresence>
      {open && current ? (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="lightbox__backdrop"
            aria-label="Close photo"
            onClick={onClose}
          />
          <motion.img
            key={current.id}
            className="lightbox__image"
            src={current.url}
            alt=""
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                aria-label="Previous photo"
                onClick={() =>
                  onIndexChange((index - 1 + images.length) % images.length)
                }
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                aria-label="Next photo"
                onClick={() => onIndexChange((index + 1) % images.length)}
              >
                ›
              </button>
            </>
          ) : null}
          <p className="lightbox__count">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            className="lightbox__close"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
