import { mockPolicies, type Environment } from '@/data/mock/flowc-data'
import {
  Shield,
  CheckCircle2,
  XCircle,
  Server,
  Globe,
  Info,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/flowc'

interface VirtualHostPoliciesTabProps {
  environment: Environment
}

const policyTypeConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  'rate-limit': { label: 'Rate Limit', variant: 'default' },
  cors: { label: 'CORS', variant: 'secondary' },
  'jwt-auth': { label: 'JWT Auth', variant: 'default' },
  'request-transform': { label: 'Request Transform', variant: 'outline' },
  'response-transform': { label: 'Response Transform', variant: 'outline' },
  logging: { label: 'Logging', variant: 'secondary' },
}

export function VirtualHostPoliciesTab({
  environment,
}: VirtualHostPoliciesTabProps) {
  // Get gateway-level policies (inherited)
  const gatewayPolicies = mockPolicies.filter(
    (p) =>
      p.attachedTo === 'gateway' && p.attachedToId === environment.gatewayId
  )

  // Get virtual host-specific policies
  const virtualHostPolicies = mockPolicies.filter(
    (p) =>
      p.attachedTo === 'environment' &&
      p.attachedToId ===
        `${environment.gatewayId}:${environment.port}:${environment.name}`
  )

  const allPolicies = [...gatewayPolicies, ...virtualHostPolicies]

  if (allPolicies.length === 0) {
    return (
      <EmptyState
        icon={Shield}
        title='No policies applied'
        description='Add mediation policies to control API behavior.'
      />
    )
  }

  return (
    <div className='space-y-4'>
      {/* Info Alert */}
      <Alert>
        <Info className='h-4 w-4' />
        <AlertTitle>Policy Inheritance</AlertTitle>
        <AlertDescription>
          Policies can be applied at the gateway level (inherited by all
          virtual hosts) or at the virtual host level (specific to this
          virtual host).
        </AlertDescription>
      </Alert>

      {/* Gateway-Level Policies */}
      {gatewayPolicies.length > 0 && (
        <Card>
          <CardHeader className='flex flex-row items-center gap-2'>
            <Server className='h-5 w-5 text-muted-foreground' />
            <CardTitle>
              Gateway-Level Policies ({gatewayPolicies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-sm text-muted-foreground'>
              These policies are inherited from the gateway and apply to all
              virtual hosts.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gatewayPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className='font-medium'>{policy.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          policyTypeConfig[policy.type]?.variant || 'default'
                        }
                      >
                        {policyTypeConfig[policy.type]?.label || policy.type}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {policy.description}
                    </TableCell>
                    <TableCell>
                      {policy.enabled ? (
                        <div className='flex items-center gap-1 text-green-600'>
                          <CheckCircle2 className='h-4 w-4' />
                          <span className='text-sm'>Enabled</span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1 text-muted-foreground'>
                          <XCircle className='h-4 w-4' />
                          <span className='text-sm'>Disabled</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {policy.appliedToApis} APIs
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Virtual Host-Level Policies */}
      {virtualHostPolicies.length > 0 ? (
        <Card>
          <CardHeader className='flex flex-row items-center gap-2'>
            <Globe className='h-5 w-5 text-muted-foreground' />
            <CardTitle>
              Virtual Host-Specific Policies ({virtualHostPolicies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-sm text-muted-foreground'>
              These policies are specific to this virtual host only.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {virtualHostPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className='font-medium'>{policy.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          policyTypeConfig[policy.type]?.variant || 'default'
                        }
                      >
                        {policyTypeConfig[policy.type]?.label || policy.type}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {policy.description}
                    </TableCell>
                    <TableCell>
                      {policy.enabled ? (
                        <div className='flex items-center gap-1 text-green-600'>
                          <CheckCircle2 className='h-4 w-4' />
                          <span className='text-sm'>Enabled</span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1 text-muted-foreground'>
                          <XCircle className='h-4 w-4' />
                          <span className='text-sm'>Disabled</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {policy.appliedToApis} APIs
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className='flex flex-row items-center gap-2'>
            <Globe className='h-5 w-5 text-muted-foreground' />
            <CardTitle>Virtual Host-Specific Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='py-4 text-center text-sm text-muted-foreground'>
              No virtual host-specific policies configured. Using gateway-level
              policies only.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
