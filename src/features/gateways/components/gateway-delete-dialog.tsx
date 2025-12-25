'use client'

import { useState } from 'react'
import { type Gateway } from '@/data/mock/flowc-data'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type GatewayDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Gateway
}

export function GatewayDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: GatewayDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [force, setForce] = useState(false)

  const handleDelete = () => {
    if (!force && value.trim() !== currentRow.name) return

    onOpenChange(false)
    setValue('')
    setForce(false)
    showSubmittedData(
      { ...currentRow, forceDelete: force },
      'The following gateway has been deleted:'
    )
  }

  const isDeleteEnabled = force || value.trim() === currentRow.name

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
          Delete Gateway
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete gateway{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the gateway with{' '}
            <span className='font-bold'>{currentRow.listenerCount}</span>{' '}
            listener(s) and{' '}
            <span className='font-bold'>{currentRow.apiCount}</span> deployed
            API(s) from <span className='font-bold'>{currentRow.region}</span>.
            This cannot be undone.
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
              Gateway Name:
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Enter gateway name to confirm deletion.'
              />
            </Label>
          )}

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              {currentRow.listenerCount > 0 || currentRow.apiCount > 0
                ? 'This gateway has active listeners and deployed APIs. Deleting it will remove all associated configurations and may cause service disruptions.'
                : 'Please be careful, this operation cannot be rolled back.'}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete Gateway'
      destructive
    />
  )
}
