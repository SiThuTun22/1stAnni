import { useMemo, useState } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { AddMemoryModal } from './components/AddMemoryModal'
import { Gate } from './components/Gate'
import { Hero } from './components/Hero'
import { Lightbox } from './components/Lightbox'
import { Memories } from './components/Memories'
import { COUPLE, GATE } from './config'
import { useMemories } from './hooks/useMemories'
import type { Memory, MemoryInput } from './types'
import './App.css'

function readUnlocked() {
  try {
    return localStorage.getItem(GATE.storageKey) === '1'
  } catch {
    return false
  }
}

function App() {
  const [unlocked, setUnlocked] = useState(readUnlocked)
  const { memories, loading, error, addMemory, updateMemory, removeMemory } =
    useMemories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [lightbox, setLightbox] = useState<{
    memoryId: string
    index: number
  } | null>(null)

  const daysTogether = useMemo(() => {
    const start = parseISO(COUPLE.startDate)
    return Math.max(1, differenceInCalendarDays(new Date(), start) + 1)
  }, [])

  const activeMemory = memories.find((m) => m.id === lightbox?.memoryId)

  function scrollToMemories() {
    document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })
  }

  function closeModal() {
    setModalOpen(false)
    setEditingMemory(null)
  }

  async function handleSave(input: MemoryInput) {
    if (editingMemory) {
      await updateMemory(editingMemory.id, input)
      return
    }
    await addMemory(input)
  }

  if (!unlocked) {
    return <Gate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <div className="app">
      <Hero onExplore={scrollToMemories} daysTogether={daysTogether} />

      <Memories
        memories={memories}
        loading={loading}
        error={error}
        onAdd={() => {
          setEditingMemory(null)
          setModalOpen(true)
        }}
        onEdit={(memory) => {
          setEditingMemory(memory)
          setModalOpen(true)
        }}
        onDelete={removeMemory}
        onOpenPhoto={(memoryId, photoIndex) =>
          setLightbox({ memoryId, index: photoIndex })
        }
      />

      <footer className="site-footer">
        <p className="site-footer__brand">{COUPLE.shortBrand}</p>
        <p>
          Made with patience for {COUPLE.names} · since {COUPLE.startDate}
        </p>
      </footer>

      <AddMemoryModal
        open={modalOpen}
        memory={editingMemory}
        onClose={closeModal}
        onSave={handleSave}
      />

      <Lightbox
        open={Boolean(lightbox && activeMemory)}
        images={activeMemory?.photos ?? []}
        index={lightbox?.index ?? 0}
        onClose={() => setLightbox(null)}
        onIndexChange={(index) =>
          setLightbox((prev) => (prev ? { ...prev, index } : prev))
        }
      />
    </div>
  )
}

export default App
