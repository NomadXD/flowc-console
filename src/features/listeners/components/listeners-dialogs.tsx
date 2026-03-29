import { ListenerActionDialog } from './listener-action-dialog'
import { ListenerDeleteDialog } from './listener-delete-dialog'
import { useListenersContext } from './listeners-provider'

export function ListenersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useListenersContext()
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
            key={`listener-edit-${currentRow.metadata.name}`}
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
            key={`listener-delete-${currentRow.metadata.name}`}
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
