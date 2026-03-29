import React, { useState } from 'react'
import type { GatewayResponse } from '@/lib/api/openapi/types'
import useDialogState from '@/hooks/use-dialog-state'

type GatewaysDialogType = 'create' | 'edit' | 'delete'

type GatewaysContextType = {
  open: GatewaysDialogType | null
  setOpen: (str: GatewaysDialogType | null) => void
  currentRow: GatewayResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<GatewayResponse | null>>
}

const GatewaysContext = React.createContext<GatewaysContextType | null>(null)

export function GatewaysProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<GatewaysDialogType>(null)
  const [currentRow, setCurrentRow] = useState<GatewayResponse | null>(null)

  return (
    <GatewaysContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </GatewaysContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGatewaysContext = () => {
  const gatewaysContext = React.useContext(GatewaysContext)

  if (!gatewaysContext) {
    throw new Error('useGatewaysContext has to be used within <GatewaysProvider>')
  }

  return gatewaysContext
}
