'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Gateway } from '@/data/mock/flowc-data'
import {
  gatewayFormSchema,
  type GatewayCreate,
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
import { gatewayStatuses, regions } from '../data/constants'

type GatewayForm = GatewayCreate

type GatewayActionDialogProps = {
  currentRow?: Gateway
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GatewayActionDialog({
  currentRow,
  open,
  onOpenChange,
}: GatewayActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<GatewayForm>({
    resolver: zodResolver(gatewayFormSchema),
    defaultValues: isEdit
      ? {
          nodeId: currentRow.nodeId,
          name: currentRow.name,
          status: currentRow.status,
          region: currentRow.region,
          version: currentRow.version,
          ipAddress: currentRow.ipAddress,
        }
      : {
          nodeId: '',
          name: '',
          status: 'online',
          region: '',
          version: '',
          ipAddress: '',
        },
  })

  const onSubmit = (values: GatewayForm) => {
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
            {isEdit ? 'Edit Gateway' : 'Create New Gateway'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the gateway here. '
              : 'Create a new gateway here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='gateway-form'
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
                        placeholder='gateway-us-east-1'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      Lowercase letters, numbers, and hyphens only
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nodeId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Node ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='node-12345'
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
                name='region'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Region
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a region'
                      className='col-span-4'
                      items={regions.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='ipAddress'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      IP Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='10.0.1.100'
                        className='col-span-4 font-mono'
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
                name='version'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Version
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='1.29.0'
                        className='col-span-4 font-mono'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                    <FormDescription className='col-span-4 col-start-3 text-xs'>
                      Format: X.Y.Z
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select status'
                      className='col-span-4'
                      items={gatewayStatuses.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='gateway-form'>
            {isEdit ? 'Save changes' : 'Create Gateway'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
