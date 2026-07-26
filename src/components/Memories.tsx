import { motion } from 'framer-motion'
import type { Memory } from '../types'
import { MemoryCard } from './MemoryCard'
import './Memories.css'

type MemoriesProps = {
  memories: Memory[]
  loading: boolean
  error?: string | null
  onAdd: () => void
  onEdit: (memory: Memory) => void
  onDelete: (id: string) => void
  onOpenPhoto: (memoryId: string, photoIndex: number) => void
}

export function Memories({
  memories,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onOpenPhoto,
}: MemoriesProps) {
  return (
    <section id="memories" className="memories">
      <div className="section-shell">
        <motion.div
          className="memories__intro"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="memories__eyebrow">The scrapbook</p>
          <h2>Days we keep</h2>
          <p className="memories__lede">
            Every entry holds a date, a little story, and one to five photos —
            however many frames the day asked for.
          </p>
          <button type="button" className="memories__add" onClick={onAdd}>
            Add a memory
          </button>
        </motion.div>

        {loading ? (
          <p className="memories__status">Opening our album…</p>
        ) : error ? (
          <p className="memories__status memories__status--error">{error}</p>
        ) : memories.length === 0 ? (
          <div className="memories__empty">
            <p>No memories yet — the first page is waiting for you.</p>
            <button type="button" className="memories__add" onClick={onAdd}>
              Save our first day
            </button>
          </div>
        ) : (
          <div className="memories__list">
            {memories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenPhoto={onOpenPhoto}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
