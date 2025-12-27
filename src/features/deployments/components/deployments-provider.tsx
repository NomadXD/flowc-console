import React, { useState } from 'react'
import { type Deployment } from '@/data/mock/flowc-data'
import useDialogState from '@/hooks/use-dialog-state'

type DeploymentsDialogType = 'detail' | 'policy' | 'delete'

type DeploymentsContextType = {
  open: DeploymentsDialogType | null
  setOpen: (str: DeploymentsDialogType | null) => void
  currentRow: Deployment | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Deployment | null>>
}

const DeploymentsContext = React.createContext<DeploymentsContextType | null>(
  null
)

export function DeploymentsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<DeploymentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Deployment | null>(null)

  return (
    <DeploymentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DeploymentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDeploymentsDialog = () => {
  const deploymentsContext = React.useContext(DeploymentsContext)

  if (!deploymentsContext) {
    throw new Error(
      'useDeploymentsDialog has to be used within <DeploymentsProvider>'
    )
  }

  const { setOpen, setCurrentRow } = deploymentsContext

  const setDetailDialog = (deployment: Deployment | null) => {
    setCurrentRow(deployment)
    setOpen('detail')
  }

  const setPolicyDialog = (deployment: Deployment | null) => {
    setCurrentRow(deployment)
    setOpen('policy')
  }

  const setDeleteDialog = (deployment: Deployment | null) => {
    setCurrentRow(deployment)
    setOpen('delete')
  }

  return {
    ...deploymentsContext,
    setDetailDialog,
    setPolicyDialog,
    setDeleteDialog,
  }
}
