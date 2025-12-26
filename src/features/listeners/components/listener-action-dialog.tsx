'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Listener, mockGateways } from '@/data/mock/flowc-data'
import {
  listenerFormSchema,
  type ListenerCreate,
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
import { Switch } from '@/components/ui/switch'
import { SelectDropdown } from '@/components/select-dropdown'
import { protocolOptions } from '../data/constants'

type ListenerForm = ListenerCreate

type ListenerActionDialogProps = {
  currentRow?: Listener
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ListenerActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ListenerActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<ListenerForm>({
    resolver: zodResolver(listenerFormSchema),
    defaultValues: isEdit
      ? {
          port: currentRow.port,
          protocol: currentRow.protocol,
          gatewayId: currentRow.gatewayId,
          tlsEnabled: currentRow.tlsEnabled,
        }
      : {
          port: 443,
          protocol: 'HTTPS',
          gatewayId: '',
          tlsEnabled: true,
        },
  })

  // Build gateway options
  const gatewayOptions = mockGateways.map((gateway) => ({
    label: gateway.name,
    value: gateway.id,
  }))

  const onSubmit = (values: ListenerForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Listener' : 'Create New Listener'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the listener configuration here. '
              : 'Create a new listener here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='listener-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
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
                      onValueChange={field.onChange}
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
                    <FormLabel className='col-span-2 text-end'>Port</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='443'
                        className='col-span-4'
                        autoComplete='off'
                        disabled={isEdit}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === '' ? '' : Number(value))
                        }}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      {isEdit
                        ? 'Port cannot be changed after creation'
                        : 'Valid port range: 1-65535'}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='protocol'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Protocol
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select protocol'
                      items={protocolOptions}
                      className='col-span-4'
                      isControlled={true}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tlsEnabled'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      TLS Enabled
                    </FormLabel>
                    <FormControl>
                      <div className='col-span-4 flex items-center'>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className='ml-3 text-sm text-muted-foreground'>
                          {field.value ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      Enable TLS/SSL encryption for this listener
                    </FormDescription>
                  </FormItem>
                )}
              />
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
          <Button type='submit' form='listener-form'>
            {isEdit ? 'Save Changes' : 'Create Listener'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
