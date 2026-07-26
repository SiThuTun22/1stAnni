import type { Memory } from '../types'
import { getSupabase, PHOTO_BUCKET } from './supabase'

type MemoryRow = {
  id: string
  date: string
  title: string
  description: string
  photo_paths: string[]
  created_at: string
}

function extFromBlob(blob: Blob) {
  const type = blob.type || 'image/jpeg'
  if (type.includes('png')) return 'png'
  if (type.includes('webp')) return 'webp'
  if (type.includes('gif')) return 'gif'
  return 'jpg'
}

function publicUrl(path: string) {
  const { data } = getSupabase().storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

function rowToMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    description: row.description,
    createdAt: new Date(row.created_at).getTime(),
    photos: (row.photo_paths ?? []).map((path) => ({
      id: path,
      path,
      url: publicUrl(path),
    })),
  }
}

export async function listMemories(): Promise<Memory[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as MemoryRow[]).map(rowToMemory)
}

async function uploadPhoto(memoryId: string, blob: Blob, photoId: string) {
  const supabase = getSupabase()
  const path = `${memoryId}/${photoId}.${extFromBlob(blob)}`
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, {
      upsert: true,
      contentType: blob.type || 'image/jpeg',
      cacheControl: '3600',
    })
  if (error) throw error
  return path
}

export async function saveMemory(input: {
  id: string
  date: string
  title: string
  description: string
  createdAt: number
  photos: { id: string; blob?: Blob; path?: string }[]
}): Promise<void> {
  const supabase = getSupabase()

  const photoPaths: string[] = []
  for (const photo of input.photos) {
    if (photo.blob) {
      photoPaths.push(await uploadPhoto(input.id, photo.blob, photo.id))
    } else if (photo.path) {
      photoPaths.push(photo.path)
    }
  }

  const { data: existing } = await supabase
    .from('memories')
    .select('photo_paths')
    .eq('id', input.id)
    .maybeSingle()

  const previousPaths = (existing?.photo_paths as string[] | undefined) ?? []
  const removed = previousPaths.filter((p) => !photoPaths.includes(p))
  if (removed.length > 0) {
    await supabase.storage.from(PHOTO_BUCKET).remove(removed)
  }

  const { error } = await supabase.from('memories').upsert({
    id: input.id,
    date: input.date,
    title: input.title,
    description: input.description,
    photo_paths: photoPaths,
    created_at: new Date(input.createdAt).toISOString(),
  })

  if (error) throw error
}

export async function deleteMemory(id: string): Promise<void> {
  const supabase = getSupabase()

  const { data } = await supabase
    .from('memories')
    .select('photo_paths')
    .eq('id', id)
    .maybeSingle()

  const paths = (data?.photo_paths as string[] | undefined) ?? []
  if (paths.length > 0) {
    await supabase.storage.from(PHOTO_BUCKET).remove(paths)
  }

  const { error } = await supabase.from('memories').delete().eq('id', id)
  if (error) throw error
}

export function revokeMemoryUrls(_memory: Memory) {
  // Public Supabase URLs do not need revoking
}
