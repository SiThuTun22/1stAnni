import { useCallback, useEffect, useState } from 'react'
import {
  deleteMemory as dbDelete,
  listMemories,
  saveMemory,
} from '../lib/db'
import { isSupabaseConfigured } from '../lib/supabase'
import type { Memory, MemoryInput } from '../types'

function uid() {
  return crypto.randomUUID()
}

function toStoredPhotos(input: MemoryInput) {
  return input.photos.map((photo) => ({
    id: photo.id ?? uid(),
    blob: photo.blob,
    path: photo.path,
  }))
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError(
        'Cloud storage is not set up yet. Add Supabase keys to your .env file.',
      )
      setMemories([])
      setLoading(false)
      return
    }

    try {
      const next = await listMemories()
      setMemories(next)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not load memories from the cloud. Check your Supabase setup.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addMemory = useCallback(
    async (input: MemoryInput) => {
      await saveMemory({
        id: uid(),
        date: input.date,
        title: input.title.trim(),
        description: input.description.trim(),
        createdAt: Date.now(),
        photos: toStoredPhotos(input),
      })
      await refresh()
    },
    [refresh],
  )

  const updateMemory = useCallback(
    async (id: string, input: MemoryInput) => {
      const existing = memories.find((m) => m.id === id)
      await saveMemory({
        id,
        date: input.date,
        title: input.title.trim(),
        description: input.description.trim(),
        createdAt: existing?.createdAt ?? Date.now(),
        photos: toStoredPhotos(input),
      })
      await refresh()
    },
    [memories, refresh],
  )

  const removeMemory = useCallback(
    async (id: string) => {
      await dbDelete(id)
      await refresh()
    },
    [refresh],
  )

  return { memories, loading, error, addMemory, updateMemory, removeMemory }
}
