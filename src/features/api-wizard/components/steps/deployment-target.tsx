import { useEffect } from 'react'
import { Server, Radio, Globe } from 'lucide-react'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/flowc/status-badge'
import { useApiWizard } from '../../context/wizard-context'
import { useCascadingSelectors } from '../../hooks/use-cascading-selectors'

export function DeploymentTargetStep() {
  const { form } = useApiWizard()

  const gatewayId = form.watch('deploymentTarget.gatewayId')
  const port = form.watch('deploymentTarget.port')
  const environmentName = form.watch('deploymentTarget.environmentName')

  const { gateways, listeners, environments } = useCascadingSelectors(
    gatewayId || null,
    port || null
  )

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (gatewayId) {
      // Check if current port is valid for selected gateway
      const validPort = listeners.find((l) => l.port === port)
      if (!validPort) {
        form.setValue('deploymentTarget.port', 0 as any)
        form.setValue('deploymentTarget.environmentName', '')
      }
    }
  }, [gatewayId, listeners, port, form])

  useEffect(() => {
    if (port) {
      // Check if current environment is valid for selected gateway + port
      const validEnv = environments.find((e) => e.name === environmentName)
      if (!validEnv) {
        form.setValue('deploymentTarget.environmentName', '')
      }
    }
  }, [port, environments, environmentName, form])

  // Find selected entities for display
  const selectedGateway = gateways.find((g) => g.id === gatewayId)
  const selectedListener = listeners.find((l) => l.port === port)
  const selectedEnvironment = environments.find((e) => e.name === environmentName)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Deployment Target
        </h2>
        <p className='text-muted-foreground mt-2'>
          Select where to deploy your API (Gateway → Listener → Environment)
        </p>
      </div>

      <Form {...form}>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='deploymentTarget.gatewayId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <Server className='h-4 w-4' />
                  Gateway
                </FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Select gateway'
                  items={gateways.map((g) => ({
                    label: `${g.name} (${g.region})`,
                    value: g.id,
                  }))}
                  isControlled={true}
                />
                <FormDescription>
                  The FlowC gateway instance to deploy to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedGateway && (
            <Card className='p-3 bg-muted/50'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Gateway Status:</span>
                <StatusBadge status={selectedGateway.status} />
              </div>
            </Card>
          )}

          <FormField
            control={form.control}
            name='deploymentTarget.port'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <Radio className='h-4 w-4' />
                  Listener
                </FormLabel>
                <SelectDropdown
                  defaultValue={field.value ? String(field.value) : ''}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder={
                    gatewayId
                      ? 'Select listener'
                      : 'Select a gateway first'
                  }
                  items={listeners.map((l) => ({
                    label: `Port ${l.port} (${l.protocol}${l.tlsEnabled ? ' + TLS' : ''})`,
                    value: String(l.port),
                  }))}
                  disabled={!gatewayId || listeners.length === 0}
                  isControlled={true}
                />
                <FormDescription>
                  The listener port on the selected gateway
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedListener && (
            <Card className='p-3 bg-muted/50'>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Protocol:</span>{' '}
                  <span className='font-medium'>{selectedListener.protocol}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>TLS:</span>{' '}
                  <span className='font-medium'>
                    {selectedListener.tlsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <FormField
            control={form.control}
            name='deploymentTarget.environmentName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <Globe className='h-4 w-4' />
                  Environment
                </FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={
                    port
                      ? 'Select environment'
                      : 'Select a listener first'
                  }
                  items={environments.map((e) => ({
                    label: `${e.name} (${e.hostname})`,
                    value: e.name,
                  }))}
                  disabled={!port || environments.length === 0}
                  isControlled={true}
                />
                <FormDescription>
                  The environment within the listener
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedEnvironment && (
            <Card className='p-3 bg-muted/50'>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Hostname:</span>
                  <span className='font-medium'>{selectedEnvironment.hostname}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>SNI:</span>
                  <span className='font-medium'>{selectedEnvironment.sni}</span>
                </div>
                {selectedEnvironment.policies.length > 0 && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Attached Policies:</span>
                    <span className='font-medium'>{selectedEnvironment.policies.length}</span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </Form>
    </div>
  )
}
