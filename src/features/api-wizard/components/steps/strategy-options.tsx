import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SelectDropdown } from '@/components/select-dropdown'
import { Switch } from '@/components/ui/switch'
import { useApiWizard } from '../../context/wizard-context'
import {
  ROUTE_MATCHING_OPTIONS,
  LOAD_BALANCING_OPTIONS,
} from '../../data/constants'

export function StrategyOptionsStep() {
  const { form } = useApiWizard()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Strategy Options
        </h2>
        <p className='text-muted-foreground mt-2'>
          Configure routing and load balancing behavior for your API
        </p>
      </div>

      <Form {...form}>
        <div className='space-y-6'>
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Route Matching</h3>

            <FormField
              control={form.control}
              name='strategy.routeMatching.type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matching Type</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select matching type'
                    items={ROUTE_MATCHING_OPTIONS}
                    isControlled={true}
                  />
                  <FormDescription>
                    How routes should be matched against incoming requests
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='strategy.routeMatching.caseSensitive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Case Sensitive
                    </FormLabel>
                    <FormDescription>
                      Match routes with case sensitivity
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
          </div>

          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-lg font-medium'>Load Balancing</h3>

            <FormField
              control={form.control}
              name='strategy.loadBalancing.type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Load Balancing Type</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select load balancing type'
                    items={LOAD_BALANCING_OPTIONS}
                    isControlled={true}
                  />
                  <FormDescription>
                    Algorithm for distributing traffic across backend instances
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  )
}
