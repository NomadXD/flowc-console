import type { APIResponse } from '@/lib/api/openapi/types'
import { useGateways } from '@/hooks/use-gateways'
import { useListeners } from '@/hooks/use-listeners'
import { useEnvironments } from '@/hooks/use-environments'
import { usePutDeployment } from '@/hooks/use-deployments'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Rocket } from 'lucide-react'
import { useState } from 'react'

interface DeployAPIDialogProps {
  api: APIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeployAPIDialog({
  api,
  open,
  onOpenChange,
}: DeployAPIDialogProps) {
  const [selectedGateway, setSelectedGateway] = useState<string>('')
  const [selectedListener, setSelectedListener] = useState<string>('')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('')

  const { data: gatewaysData } = useGateways()
  const { data: listenersData } = useListeners()
  const { data: environmentsData } = useEnvironments()
  const { mutate: putDeployment, isPending: isDeploying } = usePutDeployment()

  const gateways = gatewaysData?.items || []
  const listeners = listenersData?.items || []
  const environments = environmentsData?.items || []

  const handleDeploy = () => {
    const deploymentName = `${api.metadata.name}-${selectedEnvironment}`

    putDeployment(
      {
        name: deploymentName,
        body: {
          spec: {
            apiRef: api.metadata.name,
            gatewayRef: selectedGateway,
            listenerRef: selectedListener,
            environmentRef: selectedEnvironment,
          },
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedGateway('')
          setSelectedListener('')
          setSelectedEnvironment('')
        },
      }
    )
  }

  const canDeploy =
    selectedGateway &&
    selectedListener &&
    selectedEnvironment &&
    !isDeploying

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Rocket className='h-5 w-5' />
            Deploy API: {api.spec.displayName || api.metadata.name}
          </DialogTitle>
          <DialogDescription>
            Select the target environment to deploy this API.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
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
                      setSelectedListener('')
                      setSelectedEnvironment('')
                    }}
                  >
                    <SelectTrigger id='gateway'>
                      <SelectValue placeholder='Select a gateway' />
                    </SelectTrigger>
                    <SelectContent>
                      {gateways.map((gateway) => (
                        <SelectItem
                          key={gateway.metadata.name}
                          value={gateway.metadata.name}
                        >
                          {gateway.metadata.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Listener Selection */}
                <div className='space-y-2'>
                  <Label htmlFor='listener'>Listener</Label>
                  <Select
                    value={selectedListener}
                    onValueChange={(value) => {
                      setSelectedListener(value)
                      setSelectedEnvironment('')
                    }}
                    disabled={!selectedGateway}
                  >
                    <SelectTrigger id='listener'>
                      <SelectValue placeholder='Select a listener' />
                    </SelectTrigger>
                    <SelectContent>
                      {listeners
                        .filter(
                          (l) => l.spec.gatewayRef === selectedGateway
                        )
                        .map((listener) => (
                          <SelectItem
                            key={listener.metadata.name}
                            value={listener.metadata.name}
                          >
                            {listener.metadata.name} (port{' '}
                            {listener.spec.port})
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
                    disabled={!selectedListener}
                  >
                    <SelectTrigger id='environment'>
                      <SelectValue placeholder='Select an environment' />
                    </SelectTrigger>
                    <SelectContent>
                      {environments
                        .filter(
                          (e) =>
                            e.spec.gatewayRef === selectedGateway &&
                            e.spec.listenerRef === selectedListener
                        )
                        .map((env) => (
                          <SelectItem
                            key={env.metadata.name}
                            value={env.metadata.name}
                          >
                            {env.metadata.name} ({env.spec.hostname})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deployment Summary */}
          {canDeploy && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <dt className='text-muted-foreground'>API</dt>
                    <dd className='font-medium'>
                      {api.spec.displayName || api.metadata.name}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Version</dt>
                    <dd className='font-medium'>{api.spec.version}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Gateway</dt>
                    <dd className='font-medium'>{selectedGateway}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Listener</dt>
                    <dd className='font-medium'>{selectedListener}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Environment</dt>
                    <dd className='font-medium'>{selectedEnvironment}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>Context Path</dt>
                    <dd className='font-medium font-mono'>
                      {api.spec.context}
                    </dd>
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
