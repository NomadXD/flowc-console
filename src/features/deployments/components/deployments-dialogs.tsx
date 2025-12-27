import { DeploymentDeleteDialog } from './deployment-delete-dialog'
import { DeploymentDetailDialog } from './deployment-detail-dialog'
import { DeploymentPolicyManager } from './deployment-policy-manager'
import { useDeploymentsDialog } from './deployments-provider'

export function DeploymentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDeploymentsDialog()

  return (
    <>
      {currentRow && (
        <>
          <DeploymentDetailDialog
            key={`deployment-detail-${currentRow.id}`}
            open={open === 'detail'}
            onOpenChange={() => {
              setOpen('detail')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            deployment={currentRow}
          />

          <DeploymentPolicyManager
            key={`deployment-policy-${currentRow.id}`}
            open={open === 'policy'}
            onOpenChange={() => {
              setOpen('policy')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            deployment={currentRow}
          />

          <DeploymentDeleteDialog
            key={`deployment-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            deployment={currentRow}
          />
        </>
      )}
    </>
  )
}
