import React, { useState } from 'react'
import { type Environment } from '@/data/mock/flowc-data'
import useDialogState from '@/hooks/use-dialog-state'

type EnvironmentsDialogType = 'create' | 'edit' | 'delete'

type EnvironmentsContextType = {
  open: EnvironmentsDialogType | null
  setOpen: (str: EnvironmentsDialogType | null) => void
  currentRow: Environment | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Environment | null>>
}

const EnvironmentsContext = React.createContext<EnvironmentsContextType | null>(
  null
)

export function EnvironmentsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<EnvironmentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Environment | null>(null)

  return (
    <EnvironmentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EnvironmentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEnvironments = () => {
  const environmentsContext = React.useContext(EnvironmentsContext)

  if (!environmentsContext) {
    throw new Error(
      'useEnvironments has to be used within <EnvironmentsProvider>'
    )
  }

  return environmentsContext
}
