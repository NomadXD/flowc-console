import type { API } from '@/data/mock/flowc-data'
import { mockDeployments } from '@/data/mock/flowc-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rocket, ExternalLink, MapPin, Shield, Clock } from 'lucide-react'
import { EmptyState, StatusBadge } from '@/components/flowc'
import { Link } from '@tanstack/react-router'

interface APIDeploymentsTabProps {
  api: API
}

export function APIDeploymentsTab({ api }: APIDeploymentsTabProps) {
  // Get all deployments for this API
  const apiDeployments = mockDeployments.filter((deployment) =>
    api.deployments.includes(deployment.id)
  )

  if (apiDeployments.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <EmptyState
            icon={Rocket}
            title='No deployments yet'
            description='This API has not been deployed to any environment. Deploy it to make it available.'
            action={{
              label: 'Deploy Now',
              onClick: () => {},
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Active Deployments</CardTitle>
          <CardDescription>
            Environments where this API is currently deployed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {apiDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className='flex items-start gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors'
              >
                <div className='flex-1 space-y-3'>
                  {/* Header */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-semibold'>
                        {deployment.environment}
                      </h4>
                      <StatusBadge status={deployment.status} />
                    </div>
                    <Link to='/deployments'>
                      <Button variant='ghost' size='sm'>
                        View Details
                        <ExternalLink className='ml-2 h-3 w-3' />
                      </Button>
                    </Link>
                  </div>

                  {/* Details Grid */}
                  <div className='grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4'>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-muted-foreground' />
                      <div>
                        <p className='text-muted-foreground text-xs'>Gateway</p>
                        <p className='font-medium'>{deployment.gatewayName}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Rocket className='h-4 w-4 text-muted-foreground' />
                      <div>
                        <p className='text-muted-foreground text-xs'>Port</p>
                        <p className='font-medium'>{deployment.port}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Shield className='h-4 w-4 text-muted-foreground' />
                      <div>
                        <p className='text-muted-foreground text-xs'>
                          Policies
                        </p>
                        <p className='font-medium'>
                          {deployment.enabledPolicies.length} enabled
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <div>
                        <p className='text-muted-foreground text-xs'>
                          Deployed
                        </p>
                        <p className='font-medium'>
                          {new Date(deployment.deployedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deployed By */}
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>Deployed by {deployment.deployedBy}</span>
                    <span>•</span>
                    <span>
                      {new Date(deployment.deployedAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Spec File */}
                  {deployment.specFile && (
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline'>{deployment.specFile}</Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment History (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment History</CardTitle>
          <CardDescription>
            Past deployments and changes to this API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-sm text-muted-foreground'>
              Deployment history will be shown here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
