import { useState, useCallback } from 'react'
import { uploadApi } from '@/lib/api'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (
    file: File, 
    folder: string = 'general',
    bucket: string = 'uploads',
    onProgress?: (progress: number) => void
  ) => {
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 10, 90)
          onProgress?.(newProgress)
          return newProgress
        })
      }, 100)

      const result = await uploadApi.uploadFile(file, folder, bucket)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      onProgress?.(100)

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      throw err
    } finally {
      setUploading(false)
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [])

  const deleteFile = useCallback(async (path: string, bucket: string = 'uploads') => {
    try {
      setError(null)
      await uploadApi.deleteFile(path, bucket)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed'
      setError(errorMessage)
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setUploadProgress(0)
    setUploading(false)
  }, [])

  return {
    uploadFile,
    deleteFile,
    uploading,
    uploadProgress,
    error,
    reset
  }
}

// Hook for multiple file uploads
export function useMultipleFileUpload() {
  const [uploads, setUploads] = useState<Map<string, {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'completed' | 'error'
    result?: any
    error?: string
  }>>(new Map())

  const { uploadFile } = useFileUpload()

  const addFiles = useCallback((files: File[]) => {
    setUploads(prev => {
      const newUploads = new Map(prev)
      files.forEach(file => {
        const id = `${file.name}-${Date.now()}-${Math.random()}`
        newUploads.set(id, {
          file,
          progress: 0,
          status: 'pending'
        })
      })
      return newUploads
    })
  }, [])

  const uploadAll = useCallback(async (folder: string = 'general', bucket: string = 'uploads') => {
    const pendingUploads = Array.from(uploads.entries()).filter(
      ([, upload]) => upload.status === 'pending'
    )

    const uploadPromises = pendingUploads.map(async ([id, upload]) => {
      try {
        setUploads(prev => {
          const newUploads = new Map(prev)
          const currentUpload = newUploads.get(id)
          if (currentUpload) {
            newUploads.set(id, { ...currentUpload, status: 'uploading' })
          }
          return newUploads
        })

        const result = await uploadFile(upload.file, folder, bucket, (progress) => {
          setUploads(prev => {
            const newUploads = new Map(prev)
            const currentUpload = newUploads.get(id)
            if (currentUpload) {
              newUploads.set(id, { ...currentUpload, progress })
            }
            return newUploads
          })
        })

        setUploads(prev => {
          const newUploads = new Map(prev)
          const currentUpload = newUploads.get(id)
          if (currentUpload) {
            newUploads.set(id, { 
              ...currentUpload, 
              status: 'completed',
              result,
              progress: 100
            })
          }
          return newUploads
        })

        return { id, result }
      } catch (error) {
        setUploads(prev => {
          const newUploads = new Map(prev)
          const currentUpload = newUploads.get(id)
          if (currentUpload) {
            newUploads.set(id, { 
              ...currentUpload, 
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            })
          }
          return newUploads
        })
        throw error
      }
    })

    return Promise.allSettled(uploadPromises)
  }, [uploads, uploadFile])

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => {
      const newUploads = new Map(prev)
      newUploads.delete(id)
      return newUploads
    })
  }, [])

  const clearCompleted = useCallback(() => {
    setUploads(prev => {
      const newUploads = new Map()
      prev.forEach((upload, id) => {
        if (upload.status !== 'completed') {
          newUploads.set(id, upload)
        }
      })
      return newUploads
    })
  }, [])

  const reset = useCallback(() => {
    setUploads(new Map())
  }, [])

  return {
    uploads: Array.from(uploads.entries()).map(([id, upload]) => ({ id, ...upload })),
    addFiles,
    uploadAll,
    removeUpload,
    clearCompleted,
    reset
  }
}