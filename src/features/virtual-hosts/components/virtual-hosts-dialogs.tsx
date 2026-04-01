import { VirtualHostActionDialog } from './virtual-host-action-dialog'
import { VirtualHostDeleteDialog } from './virtual-host-delete-dialog'
import { useVirtualHostsContext } from './virtual-hosts-provider'

export function VirtualHostsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVirtualHostsContext()
  return (
    <>
      <VirtualHostActionDialog
        key='virtual-host-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <VirtualHostActionDialog
            key={`virtual-host-edit-${currentRow.metadata.name}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <VirtualHostDeleteDialog
            key={`virtual-host-delete-${currentRow.metadata.name}`}
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
