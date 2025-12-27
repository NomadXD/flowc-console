import { Info } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useApiWizard } from '../../context/wizard-context'
import { UPSTREAM_SCHEME_OPTIONS } from '../../data/constants'

export function UpstreamConfigStep() {
  const { form } = useApiWizard()
  const openApiFile = form.watch('openApiFile')
  const scheme = form.watch('upstream.scheme')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Upstream Configuration
        </h2>
        <p className='text-muted-foreground mt-2'>
          Configure the backend service that your API will proxy to
        </p>
      </div>

      {openApiFile?.parsedSpec?.servers && openApiFile.parsedSpec.servers.length > 0 && (
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            These values were extracted from your OpenAPI spec's servers configuration.
            You can edit them if needed.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='upstream.host'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upstream Host</FormLabel>
                <FormControl>
                  <Input
                    placeholder='backend.example.com'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The hostname or IP address of your backend service
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='upstream.port'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='443'
                      autoComplete='off'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === '' ? '' : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>Backend port (1-65535)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='upstream.scheme'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheme</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select scheme'
                    items={UPSTREAM_SCHEME_OPTIONS}
                    isControlled={true}
                  />
                  <FormDescription>HTTP or HTTPS</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='upstream.timeout'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeout</FormLabel>
                <FormControl>
                  <Input
                    placeholder='30s'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Request timeout (e.g., 30s, 5m, 1h)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {scheme === 'https' && (
            <FormField
              control={form.control}
              name='upstream.tlsVerify'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      TLS Verification
                    </FormLabel>
                    <FormDescription>
                      Verify SSL/TLS certificates when connecting to upstream
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
      </Form>
    </div>
  )
}
