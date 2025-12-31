import type { API } from '@/data/mock/flowc-data'
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
  User,
  Calendar,
  FileCode,
} from 'lucide-react'

interface APIOverviewProps {
  api: API
}

export function APIOverview({ api }: APIOverviewProps) {
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
            <p className='text-base'>{api.name}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Display Name
            </p>
            <p className='text-base'>{api.displayName}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Version</p>
            <p className='text-base'>{api.version}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Context Path</p>
            <p className='text-base font-mono'>{api.context}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Status</p>
            <Badge
              variant={
                api.status === 'deployed'
                  ? 'default'
                  : api.status === 'ready'
                    ? 'default'
                    : api.status === 'deprecated'
                      ? 'outline'
                      : 'secondary'
              }
            >
              {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
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
            <p className='text-base font-mono'>{api.upstream.host}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Port</p>
            <p className='text-base'>{api.upstream.port}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Scheme</p>
            <Badge variant='outline'>
              {api.upstream.scheme.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Timeout</p>
            <p className='text-base'>{api.upstream.timeout}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Full URL
            </p>
            <p className='text-sm font-mono text-muted-foreground break-all'>
              {api.upstream.scheme}://{api.upstream.host}:{api.upstream.port}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Routing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Route className='h-5 w-5' />
            Routing Configuration
          </CardTitle>
          <CardDescription>Request routing strategy</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Match Type
            </p>
            <Badge variant='outline'>
              {api.routing.matchType.charAt(0).toUpperCase() +
                api.routing.matchType.slice(1)}
            </Badge>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Case Sensitive
            </p>
            <p className='text-base'>
              {api.routing.caseSensitive ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Load Balancing
            </p>
            <Badge variant='outline'>
              {api.routing.loadBalancing
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

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
                {new Date(api.createdAt).toLocaleString()}
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
                {new Date(api.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <User className='h-4 w-4 mt-0.5 text-muted-foreground' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-muted-foreground'>
                Created By
              </p>
              <p className='text-sm'>{api.createdBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OpenAPI Spec Info (if available) */}
      {api.spec && api.spec.parsedInfo && (
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileCode className='h-5 w-5' />
              OpenAPI Specification
            </CardTitle>
            <CardDescription>
              Imported from {api.spec.fileName}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-3'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Title
                </p>
                <p className='text-base'>{api.spec.parsedInfo.title}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Version
                </p>
                <p className='text-base'>{api.spec.parsedInfo.version}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Paths
                </p>
                <p className='text-base'>{api.spec.parsedInfo.paths.length}</p>
              </div>
            </div>
            {api.spec.parsedInfo.servers &&
              api.spec.parsedInfo.servers.length > 0 && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2'>
                    Servers
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {api.spec.parsedInfo.servers.map((server, idx) => (
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
