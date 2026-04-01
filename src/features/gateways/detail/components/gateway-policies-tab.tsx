import { Shield, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GatewayPoliciesTabProps {
  gatewayName: string
}

export function GatewayPoliciesTab({ gatewayName: _gatewayName }: GatewayPoliciesTabProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Gateway-Level Policies</CardTitle>
        <Button size='sm'>
          <Plus className='mr-2 h-4 w-4' />
          Add Policy
        </Button>
      </CardHeader>
      <CardContent>
        <div className='py-8 text-center'>
          <Shield className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
          <p className='mb-2 text-muted-foreground'>
            No policies configured for this gateway
          </p>
          <p className='mb-4 text-xs text-muted-foreground'>
            Attach policy engines from the Infrastructure &gt; Policy Engines
            page to start configuring gateway-level policies.
          </p>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add Your First Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
