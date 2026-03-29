'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { EnvironmentResponse } from '@/lib/api/openapi/types'
import { useGateways } from '@/hooks/use-gateways'
import { usePutEnvironment } from '@/hooks/use-environments'
import { useListeners } from '@/hooks/use-listeners'
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

const environmentFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  gatewayRef: z.string().min(1, 'Gateway is required'),
  listenerRef: z.string().min(1, 'Listener is required'),
  hostname: z.string().min(1, 'Hostname is required'),
})

type EnvironmentForm = z.infer<typeof environmentFormSchema>

type EnvironmentActionDialogProps = {
  currentRow?: EnvironmentResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnvironmentActionDialog({
  currentRow,
  open,
  onOpenChange,
}: EnvironmentActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: putEnvironment, isPending } = usePutEnvironment()
  const { data: gatewaysData } = useGateways()
  const { data: listenersData } = useListeners()

  const form = useForm<EnvironmentForm>({
    resolver: zodResolver(environmentFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.metadata.name,
          gatewayRef: currentRow.spec.gatewayRef,
          listenerRef: currentRow.spec.listenerRef,
          hostname: currentRow.spec.hostname,
        }
      : {
          name: '',
          gatewayRef: '',
          listenerRef: '',
          hostname: '',
        },
  })

  // Build gateway options
  const gatewayOptions = (gatewaysData?.items || []).map((gateway) => ({
    label: gateway.metadata.name,
    value: gateway.metadata.name,
  }))

  // Build listener options
  const listenerOptions = (listenersData?.items || []).map((listener) => ({
    label: `${listener.metadata.name} (:${listener.spec.port})`,
    value: listener.metadata.name,
  }))

  const onSubmit = (values: EnvironmentForm) => {
    putEnvironment(
      {
        name: values.name,
        body: {
          spec: {
            gatewayRef: values.gatewayRef,
            listenerRef: values.listenerRef,
            hostname: values.hostname,
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
            {isEdit ? 'Edit Environment' : 'Create New Environment'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the environment configuration here. '
              : 'Create a new environment here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
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
                name='listenerRef'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Listener
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select listener'
                      items={listenerOptions}
                      className='col-span-4'
                      disabled={isEdit}
                      isControlled={true}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                    {isEdit && (
                      <FormDescription className='col-span-4 col-start-3 text-xs'>
                        Listener cannot be changed after creation
                      </FormDescription>
                    )}
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
          <Button type='submit' form='environment-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save Changes'
                : 'Create Environment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
