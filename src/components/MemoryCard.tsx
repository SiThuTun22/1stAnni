import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import type { Memory } from '../types'
import { PhotoFrames } from './PhotoFrames'
import './MemoryCard.css'

type MemoryCardProps = {
  memory: Memory
  index: number
  onOpenPhoto: (memoryId: string, photoIndex: number) => void
  onEdit: (memory: Memory) => void
  onDelete: (id: string) => void
}

export function MemoryCard({
  memory,
  index,
  onOpenPhoto,
  onEdit,
  onDelete,
}: MemoryCardProps) {
  const dateLabel = format(parseISO(memory.date), 'MMMM d, yyyy')
  const flipped = index % 2 === 1

  return (
    <motion.article
      className={`memory-card ${flipped ? 'memory-card--flip' : ''}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="memory-card__media">
        <PhotoFrames
          photos={memory.photos}
          onOpen={(photoIndex) => onOpenPhoto(memory.id, photoIndex)}
        />
      </div>

      <div className="memory-card__copy">
        <p className="memory-card__date">{dateLabel}</p>
        {memory.title ? (
          <h3 className="memory-card__title">{memory.title}</h3>
        ) : null}
        <p className="memory-card__description">{memory.description}</p>
        <p className="memory-card__count">
          {memory.photos.length}{' '}
          {memory.photos.length === 1 ? 'photo' : 'photos'}
        </p>
        <div className="memory-card__actions">
          <button
            type="button"
            className="memory-card__action"
            onClick={() => onEdit(memory)}
          >
            Edit
          </button>
          <button
            type="button"
            className="memory-card__action"
            onClick={() => {
              if (
                window.confirm(
                  'Remove this memory? Photos will be deleted from this device.',
                )
              ) {
                onDelete(memory.id)
              }
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  )
}
