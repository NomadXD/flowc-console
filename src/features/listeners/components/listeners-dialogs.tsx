import { ListenerActionDialog } from './listener-action-dialog'
import { ListenerDeleteDialog } from './listener-delete-dialog'
import { useListeners } from './listeners-provider'

export function ListenersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useListeners()
  return (
    <>
      <ListenerActionDialog
        key='listener-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ListenerActionDialog
            key={`listener-edit-${currentRow.gatewayId}-${currentRow.port}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ListenerDeleteDialog
            key={`listener-delete-${currentRow.gatewayId}-${currentRow.port}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
