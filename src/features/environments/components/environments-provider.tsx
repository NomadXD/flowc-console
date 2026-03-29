import React, { useState } from 'react'
import type { EnvironmentResponse } from '@/lib/api/openapi/types'
import useDialogState from '@/hooks/use-dialog-state'

type EnvironmentsDialogType = 'create' | 'edit' | 'delete'

type EnvironmentsContextType = {
  open: EnvironmentsDialogType | null
  setOpen: (str: EnvironmentsDialogType | null) => void
  currentRow: EnvironmentResponse | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<EnvironmentResponse | null>
  >
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
  const [currentRow, setCurrentRow] = useState<EnvironmentResponse | null>(null)

  return (
    <EnvironmentsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EnvironmentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEnvironmentsContext = () => {
  const environmentsContext = React.useContext(EnvironmentsContext)

  if (!environmentsContext) {
    throw new Error(
      'useEnvironmentsContext has to be used within <EnvironmentsProvider>'
    )
  }

  return environmentsContext
}
