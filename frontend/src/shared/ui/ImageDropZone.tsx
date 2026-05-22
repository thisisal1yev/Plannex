import { useState, useRef, useEffect } from 'react'
import { Upload, X, AlertCircle, LoaderCircle } from 'lucide-react'
import { uploadToImgbb } from '@shared/api/imgbbService'

type ImageEntry = {
  id: string
  previewUrl: string
  uploadedUrl?: string
  uploading: boolean
  error?: string
}

interface ImageDropZoneProps {
  onChange: (urls: string[]) => void
  onUploadingChange?: (isUploading: boolean) => void
  maxImages?: number
  className?: string
  initialUrls?: string[]
}

export function ImageDropZone({
  onChange,
  onUploadingChange,
  maxImages = 8,
  className = '',
  initialUrls,
}: ImageDropZoneProps) {
  const [entries, setEntries] = useState<ImageEntry[]>(() =>
    (initialUrls ?? []).map((url) => ({
      id: `init-${url}`,
      previewUrl: url,
      uploadedUrl: url,
      uploading: false,
    })),
  )
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const onChangeRef = useRef(onChange)
  const onUploadingChangeRef = useRef(onUploadingChange)
  onChangeRef.current = onChange
  onUploadingChangeRef.current = onUploadingChange

  const blobsRef = useRef<string[]>([])
  const entriesRef = useRef<ImageEntry[]>(
    (initialUrls ?? []).map((url) => ({
      id: `init-${url}`,
      previewUrl: url,
      uploadedUrl: url,
      uploading: false,
    })),
  )

  function applyEntries(updater: (prev: ImageEntry[]) => ImageEntry[]) {
    const next = updater(entriesRef.current)
    entriesRef.current = next
    setEntries(next)
    const urls = next.filter((e) => e.uploadedUrl && !e.error).map((e) => e.uploadedUrl!)
    onChangeRef.current(urls)
    onUploadingChangeRef.current?.(next.some((e) => e.uploading))
  }

  useEffect(() => () => {
    blobsRef.current.forEach(URL.revokeObjectURL)
  }, [])

  async function processFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, maxImages - entries.length)
    if (!imageFiles.length) return

    const newEntries: ImageEntry[] = imageFiles.map(file => {
      const previewUrl = URL.createObjectURL(file)
      blobsRef.current.push(previewUrl)
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        previewUrl,
        uploading: true,
      }
    })

    applyEntries(prev => [...prev, ...newEntries])

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const id = newEntries[i].id
      try {
        if (file.size > 32 * 1024 * 1024) throw new Error('Fayl 32 MB dan oshmasligi kerak')
        const { url } = await uploadToImgbb(file)
        applyEntries(prev =>
          prev.map(e => (e.id === id ? { ...e, uploadedUrl: url, uploading: false } : e)),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Xatolik yuz berdi'
        applyEntries(prev =>
          prev.map(e => (e.id === id ? { ...e, uploading: false, error: message } : e)),
        )
      }
    }
  }

  function removeEntry(id: string) {
    applyEntries(prev => prev.filter(e => e.id !== id))
  }

  const canAddMore = entries.length < maxImages

  return (
    <div
      className={className}
      onDragOver={canAddMore ? e => { e.preventDefault(); setIsDragging(true) } : undefined}
      onDragLeave={canAddMore ? () => setIsDragging(false) : undefined}
      onDrop={
        canAddMore
          ? e => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files) }
          : undefined
      }
    >
      {entries.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <img src={entry.previewUrl} alt="" className="h-full w-full object-cover" />

              {entry.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <LoaderCircle className="h-6 w-6 animate-spin text-white" />
                </div>
              )}

              {entry.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/70 p-2 text-center">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <p className="text-xs leading-tight text-red-300">{entry.error}</p>
                </div>
              )}

              {!entry.uploading && (
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                  aria-label="O'chirish"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {entry.uploadedUrl && !entry.error && (
                <div className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
              )}
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-muted/40'
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
              isDragging ? 'bg-primary/15' : 'bg-muted'
            }`}
          >
            <Upload
              className={`h-5 w-5 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}
            />
          </div>
          <div className="text-center">
            <p className="text-foreground text-sm font-medium">
              {isDragging ? "Rasmlarni qo'ying" : 'Rasmlarni bu yerga tashlang'}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              yoki{' '}
              <span className="text-primary font-medium">tanlash uchun bosing</span>
              {' '}— PNG, JPG, WEBP · 32 MB gacha
            </p>
          </div>
          <span className="text-muted-foreground tabular-nums text-xs">
            {entries.length} / {maxImages} rasm yuklangan
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          processFiles(e.target.files ?? [])
          e.target.value = ''
        }}
      />
    </div>
  )
}
