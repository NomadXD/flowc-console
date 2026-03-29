'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ListenerResponse } from '@/lib/api/openapi/types'
import { useGateways } from '@/hooks/use-gateways'
import { usePutListener } from '@/hooks/use-listeners'
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

const listenerFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  gatewayRef: z.string().min(1, 'Gateway is required'),
  port: z.number().min(1).max(65535),
  address: z.string(),
  tlsEnabled: z.boolean(),
})

type ListenerForm = z.infer<typeof listenerFormSchema>

type ListenerActionDialogProps = {
  currentRow?: ListenerResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ListenerActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ListenerActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: putListener, isPending } = usePutListener()
  const { data: gatewaysData } = useGateways()

  const form = useForm<ListenerForm>({
    resolver: zodResolver(listenerFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.metadata.name,
          gatewayRef: currentRow.spec.gatewayRef,
          port: currentRow.spec.port,
          address: currentRow.spec.address || '',
          tlsEnabled: !!currentRow.spec.tls,
        }
      : {
          name: '',
          gatewayRef: '',
          port: 443,
          address: '',
          tlsEnabled: false,
        },
  })

  const gatewayOptions = (gatewaysData?.items || []).map((gateway) => ({
    label: gateway.metadata.name,
    value: gateway.metadata.name,
  }))

  const onSubmit = (values: ListenerForm) => {
    putListener(
      {
        name: values.name,
        body: {
          spec: {
            gatewayRef: values.gatewayRef,
            port: values.port,
            address: values.address || undefined,
            tls: values.tlsEnabled
              ? { certPath: '', keyPath: '' }
              : undefined,
          },
        },
        ifMatch: isEdit ? currentRow.metadata.revision : undefined,
      },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
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
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='listener-https'
                        className='col-span-4'
                        autoComplete='off'
                        disabled={isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      {isEdit
                        ? 'Name cannot be changed after creation'
                        : 'Lowercase letters, numbers, and hyphens only'}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gatewayRef'
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
                      Valid port range: 1-65535
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.0.0.0'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      Bind address (defaults to 0.0.0.0)
                    </FormDescription>
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
          <Button type='submit' form='listener-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save Changes'
                : 'Create Listener'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
