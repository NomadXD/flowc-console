import { EnvironmentActionDialog } from './environment-action-dialog'
import { EnvironmentDeleteDialog } from './environment-delete-dialog'
import { useEnvironments } from './environments-provider'

export function EnvironmentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useEnvironments()
  return (
    <>
      <EnvironmentActionDialog
        key='environment-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <EnvironmentActionDialog
            key={`environment-edit-${currentRow.gatewayId}-${currentRow.port}-${currentRow.name}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <EnvironmentDeleteDialog
            key={`environment-delete-${currentRow.gatewayId}-${currentRow.port}-${currentRow.name}`}
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
