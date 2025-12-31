import type { API } from '@/data/mock/flowc-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileCode, Download, Copy, Check } from 'lucide-react'
import { EmptyState } from '@/components/flowc'
import { useState } from 'react'

interface APISpecTabProps {
  api: API
}

export function APISpecTab({ api }: APISpecTabProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (api.spec?.content) {
      navigator.clipboard.writeText(api.spec.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!api.spec) {
    return (
      <Card>
        <CardContent className='p-6'>
          <EmptyState
            icon={FileCode}
            title='No OpenAPI specification'
            description='This API was created without an OpenAPI spec. You can upload one to enable enhanced validation and documentation.'
            action={{
              label: 'Upload Spec',
              onClick: () => {},
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Spec Info Card */}
      {api.spec.parsedInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Specification Details</CardTitle>
            <CardDescription>
              Information extracted from the OpenAPI specification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  File Name
                </p>
                <p className='text-base font-mono text-sm mt-1'>
                  {api.spec.fileName}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Title
                </p>
                <p className='text-base mt-1'>{api.spec.parsedInfo.title}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Version
                </p>
                <p className='text-base mt-1'>{api.spec.parsedInfo.version}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Paths
                </p>
                <p className='text-base mt-1'>
                  {api.spec.parsedInfo.paths.length} endpoints
                </p>
              </div>
            </div>

            {/* Paths List */}
            {api.spec.parsedInfo.paths.length > 0 && (
              <div className='mt-6'>
                <p className='text-sm font-medium text-muted-foreground mb-3'>
                  API Endpoints
                </p>
                <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-3'>
                  {api.spec.parsedInfo.paths.map((path, idx) => (
                    <Badge key={idx} variant='outline' className='font-mono'>
                      {path}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Servers */}
            {api.spec.parsedInfo.servers &&
              api.spec.parsedInfo.servers.length > 0 && (
                <div className='mt-6'>
                  <p className='text-sm font-medium text-muted-foreground mb-3'>
                    Servers
                  </p>
                  <div className='space-y-2'>
                    {api.spec.parsedInfo.servers.map((server, idx) => (
                      <Badge key={idx} variant='secondary' className='font-mono'>
                        {server}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Raw Spec Viewer */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Raw Specification</CardTitle>
              <CardDescription>
                View or download the complete OpenAPI specification file
              </CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className='mr-2 h-4 w-4' />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className='mr-2 h-4 w-4' />
                    Copy
                  </>
                )}
              </Button>
              <Button variant='outline' size='sm' disabled>
                <Download className='mr-2 h-4 w-4' />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg bg-muted p-4 max-h-[500px] overflow-auto'>
            <pre className='text-sm font-mono whitespace-pre-wrap break-all'>
              {api.spec.content}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
