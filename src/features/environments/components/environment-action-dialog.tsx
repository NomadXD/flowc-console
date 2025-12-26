'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type Environment,
  mockGateways,
  mockListeners,
} from '@/data/mock/flowc-data'
import {
  environmentFormSchema,
  type EnvironmentCreate,
} from '@/data/schemas/flowc-schemas'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

type EnvironmentForm = EnvironmentCreate

type EnvironmentActionDialogProps = {
  currentRow?: Environment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnvironmentActionDialog({
  currentRow,
  open,
  onOpenChange,
}: EnvironmentActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<EnvironmentForm>({
    resolver: zodResolver(environmentFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          gatewayId: currentRow.gatewayId,
          port: currentRow.port,
          hostname: currentRow.hostname,
          sni: currentRow.sni,
          tlsConfig: currentRow.tlsConfig,
          policies: currentRow.policies,
        }
      : {
          name: '',
          gatewayId: '',
          port: 443,
          hostname: '',
          sni: '',
          tlsConfig: undefined,
          policies: [],
        },
  })

  // Watch gatewayId to filter available listeners/ports
  const selectedGatewayId = useWatch({
    control: form.control,
    name: 'gatewayId',
  })

  // Build gateway options
  const gatewayOptions = mockGateways.map((gateway) => ({
    label: gateway.name,
    value: gateway.id,
  }))

  // Build port/listener options based on selected gateway
  const availablePorts = selectedGatewayId
    ? mockListeners
        .filter((l) => l.gatewayId === selectedGatewayId)
        .map((listener) => ({
          label: `${listener.port} (${listener.protocol})`,
          value: listener.port.toString(),
        }))
    : []

  // Track whether TLS should be shown
  const [showTLS, setShowTLS] = useState(
    isEdit ? !!currentRow.tlsConfig : false
  )

  const onSubmit = (values: EnvironmentForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        setShowTLS(false)
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Environment' : 'Create New Environment'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the environment configuration here. '
              : 'Create a new environment here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='environment-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Environment Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='production'
                        className='col-span-4'
                        autoComplete='off'
                        disabled={isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      {isEdit
                        ? 'Environment name cannot be changed after creation'
                        : 'Lowercase letters, numbers, and hyphens only'}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gatewayId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Gateway
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        // Reset port when gateway changes
                        form.setValue('port', 443)
                      }}
                      placeholder='Select gateway'
                      items={gatewayOptions}
                      className='col-span-4'
                      disabled={isEdit}
                      isControlled={true}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                    {isEdit && (
                      <FormDescription className='col-span-4 col-start-3 text-xs'>
                        Gateway cannot be changed after creation
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='port'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Listener Port
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value?.toString() || ''}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder={
                        selectedGatewayId
                          ? 'Select listener port'
                          : 'Select gateway first'
                      }
                      items={availablePorts}
                      className='col-span-4'
                      disabled={!selectedGatewayId || isEdit}
                      isControlled={true}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      {isEdit
                        ? 'Listener port cannot be changed after creation'
                        : 'Choose an existing listener on the selected gateway'}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='hostname'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Hostname
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='api.example.com'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      The hostname for this environment
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='sni'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>SNI</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='api.example.com'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      Server Name Indication (leave empty for HTTP)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-6 items-center gap-x-4'>
                <div className='col-span-2' />
                <div className='col-span-4'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setShowTLS(!showTLS)}
                  >
                    {showTLS ? 'Remove TLS Config' : 'Add TLS Config'}
                  </Button>
                </div>
              </div>

              {showTLS && (
                <>
                  <FormField
                    control={form.control}
                    name='tlsConfig.certPath'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Certificate Path
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='/etc/certs/api.example.com.crt'
                            className='col-span-4'
                            autoComplete='off'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='tlsConfig.keyPath'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Key Path
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='/etc/certs/api.example.com.key'
                            className='col-span-4'
                            autoComplete='off'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type='submit' form='environment-form'>
            {isEdit ? 'Save Changes' : 'Create Environment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
