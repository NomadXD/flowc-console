import type { APIResponse } from '@/lib/api/openapi/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Server,
  Route,
  Network,
  Clock,
  Calendar,
  FileCode,
} from 'lucide-react'

interface APIOverviewProps {
  api: APIResponse
}

export function APIOverview({ api }: APIOverviewProps) {
  const phase = api.status?.phase || 'unknown'

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileCode className='h-5 w-5' />
            Basic Information
          </CardTitle>
          <CardDescription>API metadata and identification</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Name</p>
            <p className='text-base'>{api.metadata.name}</p>
          </div>
          {api.spec.displayName && (
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Display Name
              </p>
              <p className='text-base'>{api.spec.displayName}</p>
            </div>
          )}
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Version</p>
            <p className='text-base'>{api.spec.version}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Context Path
            </p>
            <p className='text-base font-mono'>{api.spec.context}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Status</p>
            <Badge
              variant={
                phase === 'deployed' || phase === 'ready'
                  ? 'default'
                  : phase === 'deprecated'
                    ? 'outline'
                    : 'secondary'
              }
            >
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upstream Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Server className='h-5 w-5' />
            Upstream Configuration
          </CardTitle>
          <CardDescription>Backend service details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Host</p>
            <p className='text-base font-mono'>{api.spec.upstream.host}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Port</p>
            <p className='text-base'>{api.spec.upstream.port}</p>
          </div>
          {api.spec.upstream.scheme && (
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Scheme
              </p>
              <Badge variant='outline'>
                {api.spec.upstream.scheme.toUpperCase()}
              </Badge>
            </div>
          )}
          {api.spec.upstream.timeout && (
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Timeout
              </p>
              <p className='text-base'>{api.spec.upstream.timeout}</p>
            </div>
          )}
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Full URL
            </p>
            <p className='text-sm font-mono text-muted-foreground break-all'>
              {api.spec.upstream.scheme || 'http'}://{api.spec.upstream.host}:
              {api.spec.upstream.port}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Routing Configuration */}
      {api.spec.routing && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Route className='h-5 w-5' />
              Routing Configuration
            </CardTitle>
            <CardDescription>Request routing strategy</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {api.spec.routing.matchType && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Match Type
                </p>
                <Badge variant='outline'>
                  {api.spec.routing.matchType.charAt(0).toUpperCase() +
                    api.spec.routing.matchType.slice(1)}
                </Badge>
              </div>
            )}
            {api.spec.routing.caseSensitive !== undefined && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Case Sensitive
                </p>
                <p className='text-base'>
                  {api.spec.routing.caseSensitive ? 'Yes' : 'No'}
                </p>
              </div>
            )}
            {api.spec.routing.loadBalancing && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Load Balancing
                </p>
                <Badge variant='outline'>
                  {api.spec.routing.loadBalancing
                    .split('-')
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(' ')}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Network className='h-5 w-5' />
            Metadata
          </CardTitle>
          <CardDescription>Creation and update information</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-start gap-2'>
            <Calendar className='h-4 w-4 mt-0.5 text-muted-foreground' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-muted-foreground'>
                Created At
              </p>
              <p className='text-sm'>
                {new Date(api.metadata.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <Clock className='h-4 w-4 mt-0.5 text-muted-foreground' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-muted-foreground'>
                Updated At
              </p>
              <p className='text-sm'>
                {new Date(api.metadata.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          {api.metadata.managedBy && (
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Managed By
              </p>
              <p className='text-sm'>{api.metadata.managedBy}</p>
            </div>
          )}
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Revision
            </p>
            <p className='text-sm font-mono'>{api.metadata.revision}</p>
          </div>
        </CardContent>
      </Card>

      {/* Parsed OpenAPI Spec Info (if available) */}
      {api.status?.parsedInfo && (
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileCode className='h-5 w-5' />
              OpenAPI Specification
            </CardTitle>
            <CardDescription>Parsed from uploaded spec</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-3'>
              {api.status.parsedInfo.title && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Title
                  </p>
                  <p className='text-base'>{api.status.parsedInfo.title}</p>
                </div>
              )}
              {api.status.parsedInfo.version && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Version
                  </p>
                  <p className='text-base'>{api.status.parsedInfo.version}</p>
                </div>
              )}
              {api.status.parsedInfo.paths && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Paths
                  </p>
                  <p className='text-base'>
                    {api.status.parsedInfo.paths.length}
                  </p>
                </div>
              )}
            </div>
            {api.status.parsedInfo.servers &&
              api.status.parsedInfo.servers.length > 0 && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2'>
                    Servers
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {api.status.parsedInfo.servers.map((server, idx) => (
                      <Badge key={idx} variant='secondary'>
                        {server}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
