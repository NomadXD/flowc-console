'use client'

import { useState } from 'react'
import type { ListenerResponse } from '@/lib/api/openapi/types'
import { AlertTriangle } from 'lucide-react'
import { useDeleteListener } from '@/hooks/use-listeners'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type ListenerDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ListenerResponse
}

export function ListenerDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ListenerDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [force, setForce] = useState(false)
  const { mutate: deleteListener, isPending } = useDeleteListener()

  const listenerName = currentRow.metadata.name

  const handleDelete = () => {
    if (!force && value.trim() !== listenerName) return

    deleteListener(
      {
        name: listenerName,
        ifMatch: currentRow.metadata.revision,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setValue('')
          setForce(false)
        },
      }
    )
  }

  const isDeleteEnabled =
    !isPending && (force || value.trim() === listenerName)

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        if (!state) {
          setValue('')
          setForce(false)
        }
      }}
      handleConfirm={handleDelete}
      disabled={!isDeleteEnabled}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Listener
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete listener{' '}
            <span className='font-bold'>{listenerName}</span> (port{' '}
            <span className='font-bold'>{currentRow.spec.port}</span>) from
            gateway{' '}
            <span className='font-bold'>{currentRow.spec.gatewayRef}</span>?
            <br />
            This action will permanently remove the listener. This cannot be
            undone.
          </p>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='force-delete'
              checked={force}
              onCheckedChange={(checked) => setForce(checked === true)}
            />
            <Label
              htmlFor='force-delete'
              className='cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Force delete (bypass confirmation)
            </Label>
          </div>

          {!force && (
            <Label className='my-2'>
              Listener Name:
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Enter listener name to confirm deletion.'
              />
            </Label>
          )}

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? 'Deleting...' : 'Delete Listener'}
      destructive
    />
  )
}
