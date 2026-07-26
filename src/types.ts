export type MemoryPhoto = {
  id: string
  url: string
  /** Supabase storage path; kept when editing without replacing the file */
  path: string
}

export type Memory = {
  id: string
  date: string
  title: string
  description: string
  photos: MemoryPhoto[]
  createdAt: number
}

export type MemoryPhotoInput = {
  id?: string
  /** New upload */
  blob?: Blob
  /** Existing cloud photo to keep */
  path?: string
}

export type MemoryInput = {
  date: string
  title: string
  description: string
  photos: MemoryPhotoInput[]
}

export const MIN_PHOTOS = 1
export const MAX_PHOTOS = 5
export const DEFAULT_PHOTOS = 2
