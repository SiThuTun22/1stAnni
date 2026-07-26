import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  DEFAULT_PHOTOS,
  MAX_PHOTOS,
  MIN_PHOTOS,
  type Memory,
  type MemoryInput,
} from '../types'
import './AddMemoryModal.css'

type Slot = {
  id: string
  photoId?: string
  path?: string
  file: File | null
  blob: Blob | null
  preview: string | null
  ownedPreview: boolean
}

type AddMemoryModalProps = {
  open: boolean
  memory?: Memory | null
  onClose: () => void
  onSave: (input: MemoryInput) => Promise<void>
}

function emptySlot(): Slot {
  return {
    id: crypto.randomUUID(),
    file: null,
    blob: null,
    preview: null,
    ownedPreview: false,
  }
}

function makeSlots(count: number): Slot[] {
  return Array.from({ length: count }, () => emptySlot())
}

function slotsFromMemory(memory: Memory): Slot[] {
  return memory.photos.map((photo) => ({
    id: crypto.randomUUID(),
    photoId: photo.id,
    path: photo.path,
    file: null,
    blob: null,
    preview: photo.url,
    ownedPreview: false,
  }))
}

function revokeOwned(slots: Slot[]) {
  slots.forEach((s) => {
    if (s.ownedPreview && s.preview) URL.revokeObjectURL(s.preview)
  })
}

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function AddMemoryModal({
  open,
  memory = null,
  onClose,
  onSave,
}: AddMemoryModalProps) {
  const titleId = useId()
  const editing = Boolean(memory)
  const [date, setDate] = useState(todayISO)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [slots, setSlots] = useState<Slot[]>(() => makeSlots(DEFAULT_PHOTOS))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const slotsRef = useRef(slots)
  slotsRef.current = slots

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setError('')
    setSlots((prev) => {
      revokeOwned(prev)
      if (memory) {
        setDate(memory.date)
        setTitle(memory.title)
        setDescription(memory.description)
        return slotsFromMemory(memory)
      }
      setDate(todayISO())
      setTitle('')
      setDescription('')
      return makeSlots(DEFAULT_PHOTOS)
    })
  }, [open, memory])

  useEffect(() => {
    return () => {
      revokeOwned(slotsRef.current)
    }
  }, [])

  const filled = slots.filter((s) => s.file || s.blob || s.path)

  function addSlot() {
    if (slots.length >= MAX_PHOTOS) return
    setSlots((prev) => [...prev, emptySlot()])
  }

  function removeSlot(id: string) {
    if (slots.length <= MIN_PHOTOS) return
    setSlots((prev) => {
      const target = prev.find((s) => s.id === id)
      if (target?.ownedPreview && target.preview) {
        URL.revokeObjectURL(target.preview)
      }
      return prev.filter((s) => s.id !== id)
    })
  }

  function onPick(id: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setError('')
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        if (s.ownedPreview && s.preview) URL.revokeObjectURL(s.preview)
        return {
          ...s,
          photoId: undefined,
          path: undefined,
          file,
          blob: file,
          preview: URL.createObjectURL(file),
          ownedPreview: true,
        }
      }),
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (filled.length < MIN_PHOTOS) {
      setError(`Add at least ${MIN_PHOTOS} photo.`)
      return
    }
    if (!description.trim()) {
      setError('Write a little note for this day.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSave({
        date,
        title,
        description,
        photos: filled.map((s) => ({
          id: s.photoId,
          blob: s.file ?? s.blob ?? undefined,
          path: s.path,
        })),
      })
      onClose()
    } catch {
      setError(
        editing
          ? 'Could not update this memory. Please try again.'
          : 'Could not save this memory. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="memory-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="memory-modal__backdrop"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            className="memory-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="memory-modal__header">
              <h2 id={titleId}>
                {editing ? 'Edit memory' : 'Add a memory'}
              </h2>
              <p>1–5 photos for one day. Default frames start at 2.</p>
            </div>

            <form className="memory-modal__form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Title (optional)</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The night we walked forever"
                  maxLength={80}
                />
              </label>

              <label className="field">
                <span>Our story</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What made this day ours…"
                  rows={4}
                  required
                />
              </label>

              <div className="slots">
                <div className="slots__head">
                  <p>
                    Photo frames · {slots.length} of {MAX_PHOTOS}
                  </p>
                  <div className="slots__actions">
                    <button
                      type="button"
                      onClick={addSlot}
                      disabled={slots.length >= MAX_PHOTOS}
                    >
                      + Frame
                    </button>
                  </div>
                </div>

                <div className={`slots__grid slots__grid--${slots.length}`}>
                  {slots.map((slot, index) => (
                    <div key={slot.id} className="slot">
                      <input
                        ref={(el) => {
                          fileRefs.current[slot.id] = el
                        }}
                        type="file"
                        accept="image/*"
                        className="slot__input"
                        onChange={(e) => onPick(slot.id, e)}
                      />
                      {slot.preview ? (
                        <img src={slot.preview} alt="" />
                      ) : (
                        <button
                          type="button"
                          className="slot__empty"
                          onClick={() => fileRefs.current[slot.id]?.click()}
                        >
                          <span>Photo {index + 1}</span>
                          <small>Tap to upload</small>
                        </button>
                      )}
                      <div className="slot__tools">
                        <button
                          type="button"
                          onClick={() => fileRefs.current[slot.id]?.click()}
                        >
                          {slot.preview ? 'Change' : 'Upload'}
                        </button>
                        {slots.length > MIN_PHOTOS ? (
                          <button
                            type="button"
                            onClick={() => removeSlot(slot.id)}
                          >
                            Remove frame
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error ? <p className="memory-modal__error">{error}</p> : null}

              <div className="memory-modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={saving}
                >
                  {saving
                    ? editing
                      ? 'Updating…'
                      : 'Saving…'
                    : editing
                      ? 'Update memory'
                      : 'Save memory'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
