import type { APIResponse } from '@/lib/api/openapi/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import { EmptyState } from '@/components/flowc'

interface APIDeploymentsTabProps {
  api: APIResponse
}

export function APIDeploymentsTab({ api: _api }: APIDeploymentsTabProps) {
  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='p-6'>
          <EmptyState
            icon={Rocket}
            title='Deployments'
            description='Deploy this API to an environment to make it available. Use the Deploy button above.'
            action={{
              label: 'Deploy Now',
              onClick: () => {},
            }}
          />
        </CardContent>
      </Card>

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
              Deployment history will be available once the API is deployed.
            </p>
            <Button variant='outline' size='sm' className='mt-4' disabled>
              <Rocket className='mr-2 h-4 w-4' />
              View All Deployments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
