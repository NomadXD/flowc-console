import { GatewayActionDialog } from './gateway-action-dialog'
import { GatewayDeleteDialog } from './gateway-delete-dialog'
import { useGateways } from './gateways-provider'

export function GatewaysDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useGateways()
  return (
    <>
      <GatewayActionDialog
        key='gateway-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <GatewayActionDialog
            key={`gateway-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <GatewayDeleteDialog
            key={`gateway-delete-${currentRow.id}`}
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
