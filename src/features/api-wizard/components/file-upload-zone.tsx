import React, { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../data/constants'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  error?: string | null
  uploadedFileName?: string
}

export function FileUploadZone({
  onFileSelect,
  isLoading = false,
  error = null,
  uploadedFileName,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    const fileName = file.name.toLowerCase()
    const isValidType = ACCEPTED_FILE_TYPES.some((ext) =>
      fileName.endsWith(ext)
    )

    if (!isValidType) {
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return
    }

    onFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='space-y-4'>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer',
          {
            'border-primary bg-primary/5': isDragging,
            'border-muted-foreground/25 hover:border-primary/50':
              !isDragging && !uploadedFileName,
            'border-green-500 bg-green-50 dark:bg-green-950/20':
              uploadedFileName && !error,
            'border-destructive bg-destructive/5': error,
          }
        )}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleFileInput}
          className='hidden'
          disabled={isLoading}
        />

        <div className='flex flex-col items-center justify-center space-y-4'>
          {isLoading ? (
            <>
              <div className='h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent' />
              <p className='text-sm text-muted-foreground'>
                Parsing specification...
              </p>
            </>
          ) : uploadedFileName && !error ? (
            <>
              <CheckCircle2 className='h-12 w-12 text-green-500' />
              <div className='text-center'>
                <p className='font-medium'>File uploaded successfully</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {uploadedFileName}
                </p>
              </div>
              <Button variant='outline' size='sm' type='button'>
                <Upload className='mr-2 h-4 w-4' />
                Upload different file
              </Button>
            </>
          ) : (
            <>
              <div
                className={cn(
                  'rounded-full p-4',
                  error ? 'bg-destructive/10' : 'bg-muted'
                )}
              >
                {error ? (
                  <AlertCircle className='h-8 w-8 text-destructive' />
                ) : (
                  <FileText className='h-8 w-8 text-muted-foreground' />
                )}
              </div>
              <div className='text-center'>
                <p className='font-medium'>
                  Drop your OpenAPI spec here, or click to browse
                </p>
                <p className='text-sm text-muted-foreground mt-2'>
                  Supports .yaml, .yml, and .json files (max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
