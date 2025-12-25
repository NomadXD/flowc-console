import { mockPolicies } from '@/data/mock/flowc-data'
import { Shield, Plus, AlertCircle, CheckCircle2, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface GatewayPoliciesTabProps {
  gatewayId: string
}

const policyTypeColors: Record<string, string> = {
  'rate-limit': 'bg-blue-500/10 text-blue-700 border-blue-200',
  cors: 'bg-purple-500/10 text-purple-700 border-purple-200',
  'jwt-auth': 'bg-green-500/10 text-green-700 border-green-200',
  'request-transform': 'bg-orange-500/10 text-orange-700 border-orange-200',
  'response-transform': 'bg-pink-500/10 text-pink-700 border-pink-200',
  logging: 'bg-gray-500/10 text-gray-700 border-gray-200',
}

export function GatewayPoliciesTab({ gatewayId }: GatewayPoliciesTabProps) {
  // Get policies attached to this gateway
  const gatewayPolicies = mockPolicies.filter(
    (p) => p.attachedTo === 'gateway' && p.attachedToId === gatewayId
  )

  const enabledCount = gatewayPolicies.filter((p) => p.enabled).length
  const totalApplied = gatewayPolicies.reduce(
    (sum, p) => sum + p.appliedToApis,
    0
  )

  return (
    <div className='space-y-4'>
      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>
              Total Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{gatewayPolicies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {enabledCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium'>
              Applied to APIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalApplied}</div>
          </CardContent>
        </Card>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Gateway-Level Policies</CardTitle>
          <Button size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            Add Policy
          </Button>
        </CardHeader>
        <CardContent>
          {gatewayPolicies.length === 0 ? (
            <div className='py-8 text-center'>
              <Shield className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
              <p className='mb-4 text-muted-foreground'>
                No policies configured for this gateway
              </p>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add Your First Policy
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Applied to APIs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gatewayPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className='font-medium'>{policy.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={policyTypeColors[policy.type]}
                      >
                        {policy.type}
                      </Badge>
                    </TableCell>
                    <TableCell className='max-w-md text-sm text-muted-foreground'>
                      {policy.description}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <span className='font-medium'>
                          {policy.appliedToApis}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                          APIs
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Switch checked={policy.enabled} />
                        {policy.enabled ? (
                          <div className='flex items-center gap-1 text-green-600'>
                            <CheckCircle2 className='h-4 w-4' />
                            <span className='text-sm'>Enabled</span>
                          </div>
                        ) : (
                          <div className='flex items-center gap-1 text-muted-foreground'>
                            <AlertCircle className='h-4 w-4' />
                            <span className='text-sm'>Disabled</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='sm'>
                          <Settings className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          Edit
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600'
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Policy Configuration Details */}
      {gatewayPolicies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Policy Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {gatewayPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className='space-y-2 rounded-lg border p-4'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-medium'>{policy.name}</h4>
                      <Badge
                        variant='outline'
                        className={policyTypeColors[policy.type]}
                      >
                        {policy.type}
                      </Badge>
                    </div>
                    <Button variant='outline' size='sm'>
                      View Details
                    </Button>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {policy.description}
                  </p>
                  <div className='rounded bg-muted/50 p-3'>
                    <p className='font-mono text-xs'>
                      {JSON.stringify(policy.config, null, 2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
