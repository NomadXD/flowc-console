import { FileCode } from 'lucide-react'

interface YamlPreviewProps {
  yaml: string
  title?: string
}

export function YamlPreview({ yaml, title = 'flowc.yaml' }: YamlPreviewProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2 text-sm font-medium'>
        <FileCode className='h-4 w-4' />
        {title}
      </div>
      <div className='relative'>
        <pre className='rounded-lg bg-muted p-4 overflow-x-auto text-xs'>
          <code>{yaml}</code>
        </pre>
      </div>
    </div>
  )
}
