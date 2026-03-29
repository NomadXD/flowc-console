'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { GatewayResponse } from '@/lib/api/openapi/types'
import { usePutGateway } from '@/hooks/use-gateways'
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

const gatewayFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  nodeId: z.string().min(1, 'Node ID is required'),
})

type GatewayForm = z.infer<typeof gatewayFormSchema>

type GatewayActionDialogProps = {
  currentRow?: GatewayResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GatewayActionDialog({
  currentRow,
  open,
  onOpenChange,
}: GatewayActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: putGateway, isPending } = usePutGateway()

  const form = useForm<GatewayForm>({
    resolver: zodResolver(gatewayFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.metadata.name,
          nodeId: currentRow.spec.nodeId,
        }
      : {
          name: '',
          nodeId: '',
        },
  })

  const onSubmit = (values: GatewayForm) => {
    putGateway(
      {
        name: values.name,
        body: {
          spec: {
            nodeId: values.nodeId,
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
            {isEdit ? 'Edit Gateway' : 'Create New Gateway'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the gateway here. '
              : 'Create a new gateway here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
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
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='gateway-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Create Gateway'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
