import type { API } from '@/data/mock/flowc-data'
import { mockGateways, mockListeners, mockEnvironments } from '@/data/mock/flowc-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Rocket, Shield, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface DeployAPIDialogProps {
  api: API
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeployAPIDialog({
  api,
  open,
  onOpenChange,
}: DeployAPIDialogProps) {
  const [selectedGateway, setSelectedGateway] = useState<string>('')
  const [selectedPort, setSelectedPort] = useState<string>('')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('')
  const [isDeploying, setIsDeploying] = useState(false)

  // Get listeners for selected gateway
  const availableListeners = selectedGateway
    ? mockListeners.filter((l) => l.gatewayId === selectedGateway)
    : []

  // Get environments for selected gateway and port
  const availableEnvironments =
    selectedGateway && selectedPort
      ? mockEnvironments.filter(
          (e) => e.gatewayId === selectedGateway && e.port === Number(selectedPort)
        )
      : []

  const handleDeploy = () => {
    setIsDeploying(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Deploying API:', {
        apiId: api.id,
        gateway: selectedGateway,
        port: selectedPort,
        environment: selectedEnvironment,
      })
      setIsDeploying(false)
      onOpenChange(false)
      // Reset form
      setSelectedGateway('')
      setSelectedPort('')
      setSelectedEnvironment('')
    }, 2000)
  }

  const canDeploy =
    selectedGateway && selectedPort && selectedEnvironment && !isDeploying

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Rocket className='h-5 w-5' />
            Deploy API: {api.displayName}
          </DialogTitle>
          <DialogDescription>
            Select the target environment to deploy this API. Policies will be
            applied based on the environment configuration and API-specific
            overrides.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Target Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Target Environment</CardTitle>
              <CardDescription>
                Choose where to deploy this API
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4'>
                {/* Gateway Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='gateway'>Gateway</Label>
                  <Select
                    value={selectedGateway}
                    onValueChange={(value) => {
                      setSelectedGateway(value)
                      setSelectedPort('')
                      setSelectedEnvironment('')
                    }}
                  >
                    <SelectTrigger id='gateway'>
                      <SelectValue placeholder='Select a gateway' />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGateways
                        .filter((g) => g.status === 'online')
                        .map((gateway) => (
                          <SelectItem key={gateway.id} value={gateway.id}>
                            {gateway.name} ({gateway.region})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Listener/Port Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='port'>Listener (Port)</Label>
                  <Select
                    value={selectedPort}
                    onValueChange={(value) => {
                      setSelectedPort(value)
                      setSelectedEnvironment('')
                    }}
                    disabled={!selectedGateway}
                  >
                    <SelectTrigger id='port'>
                      <SelectValue placeholder='Select a listener' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableListeners.map((listener) => (
                        <SelectItem
                          key={listener.port}
                          value={String(listener.port)}
                        >
                          {listener.port} ({listener.protocol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Environment Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='environment'>Environment</Label>
                  <Select
                    value={selectedEnvironment}
                    onValueChange={setSelectedEnvironment}
                    disabled={!selectedPort}
                  >
                    <SelectTrigger id='environment'>
                      <SelectValue placeholder='Select an environment' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEnvironments.map((env) => (
                        <SelectItem key={env.name} value={env.name}>
                          {env.name} ({env.hostname})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Preview */}
          {selectedEnvironment && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Policy Chain Preview
                </CardTitle>
                <CardDescription>
                  Final policy execution order for this deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {api.policyChain.length > 0 ? (
                  <div className='space-y-2'>
                    {api.policyChain
                      .filter((p) => p.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((policy, index) => (
                        <div
                          key={policy.id}
                          className='flex items-center gap-3 rounded-lg border p-3'
                        >
                          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
                            {index + 1}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium'>
                                {policy.policyType
                                  .split('-')
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(' ')}
                              </span>
                              <Badge
                                variant={
                                  policy.inheritanceMode === 'inherit'
                                    ? 'secondary'
                                    : policy.inheritanceMode === 'override'
                                      ? 'default'
                                      : policy.inheritanceMode === 'add'
                                        ? 'default'
                                        : 'destructive'
                                }
                              >
                                {policy.inheritanceMode}
                              </Badge>
                            </div>
                          </div>
                          <CheckCircle2 className='h-4 w-4 text-success' />
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground text-center py-4'>
                    No policies configured for this API. Environment default
                    policies will be used.
                  </p>
                )}

                {/* Info Box */}
                <div className='mt-4 rounded-lg bg-muted p-3 text-sm'>
                  <p className='text-muted-foreground'>
                    <strong>Note:</strong> Policies marked as{' '}
                    <Badge variant='secondary' className='mx-1'>
                      inherit
                    </Badge>
                    will use the environment's default configuration. Policies
                    marked as{' '}
                    <Badge variant='default' className='mx-1'>
                      override
                    </Badge>
                    will use API-specific settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deployment Summary */}
          {selectedGateway && selectedPort && selectedEnvironment && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>API</dt>
                    <dd className='font-medium'>{api.displayName}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Version</dt>
                    <dd className='font-medium'>{api.version}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Gateway</dt>
                    <dd className='font-medium'>
                      {
                        mockGateways.find((g) => g.id === selectedGateway)
                          ?.name
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Port</dt>
                    <dd className='font-medium'>{selectedPort}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Environment</dt>
                    <dd className='font-medium'>{selectedEnvironment}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Context Path</dt>
                    <dd className='font-medium font-mono'>{api.context}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeploy} disabled={!canDeploy}>
            <Rocket className='mr-2 h-4 w-4' />
            {isDeploying ? 'Deploying...' : 'Deploy API'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
