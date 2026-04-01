import React, { useState } from 'react'
import type { VirtualHostResponse } from '@/lib/api/openapi/types'
import useDialogState from '@/hooks/use-dialog-state'

type VirtualHostsDialogType = 'create' | 'edit' | 'delete'

type VirtualHostsContextType = {
  open: VirtualHostsDialogType | null
  setOpen: (str: VirtualHostsDialogType | null) => void
  currentRow: VirtualHostResponse | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<VirtualHostResponse | null>
  >
}

const VirtualHostsContext = React.createContext<VirtualHostsContextType | null>(
  null
)

export function VirtualHostsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<VirtualHostsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<VirtualHostResponse | null>(null)

  return (
    <VirtualHostsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VirtualHostsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useVirtualHostsContext = () => {
  const virtualHostsContext = React.useContext(VirtualHostsContext)

  if (!virtualHostsContext) {
    throw new Error(
      'useVirtualHostsContext has to be used within <VirtualHostsProvider>'
    )
  }

  return virtualHostsContext
}
