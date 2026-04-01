import { useState } from 'react'
import { Download, Copy, CheckCircle2 } from 'lucide-react'
import type { GatewayResponse } from '@/lib/api/openapi/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GatewayConfigTabProps {
  gateway: GatewayResponse
}

export function GatewayConfigTab({ gateway }: GatewayConfigTabProps) {
  const [copied, setCopied] = useState(false)

  // Show the gateway spec as JSON config
  const configData = {
    metadata: {
      name: gateway.metadata.name,
      revision: gateway.metadata.revision,
      labels: gateway.metadata.labels,
    },
    spec: gateway.spec,
    status: gateway.status,
  }

  const configJson = JSON.stringify(configData, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${gateway.metadata.name}-config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Gateway Configuration</CardTitle>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle2 className='mr-2 h-4 w-4' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='mr-2 h-4 w-4' />
                    Copy
                  </>
                )}
              </Button>
              <Button variant='outline' size='sm' onClick={handleDownload}>
                <Download className='mr-2 h-4 w-4' />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-4'>
            <div>
              <p className='text-sm font-medium'>Gateway</p>
              <p className='text-sm text-muted-foreground'>
                {gateway.metadata.name}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium'>Node ID</p>
              <p className='font-mono text-sm text-muted-foreground'>
                {gateway.spec.nodeId}
              </p>
            </div>
            {gateway.spec.profileRef && (
              <div>
                <p className='text-sm font-medium'>Profile</p>
                <Badge variant='outline'>{gateway.spec.profileRef}</Badge>
              </div>
            )}
          </div>

          {/* JSON Viewer */}
          <div className='relative'>
            <pre className='overflow-x-auto rounded-lg bg-muted/50 p-4'>
              <code className='font-mono text-sm'>{configJson}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>
              &bull; This is a read-only view of the current gateway
              configuration
            </p>
            <p>
              &bull; Configuration is generated automatically based on deployed
              APIs and policies
            </p>
            <p>
              &bull; To modify the configuration, update APIs, listeners, or
              policies through the respective management pages
            </p>
            <p>
              &bull; Configuration changes are applied automatically upon
              deployment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
