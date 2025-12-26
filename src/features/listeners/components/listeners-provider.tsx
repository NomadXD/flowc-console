import React, { useState } from 'react'
import { type Listener } from '@/data/mock/flowc-data'
import useDialogState from '@/hooks/use-dialog-state'

type ListenersDialogType = 'create' | 'edit' | 'delete'

type ListenersContextType = {
  open: ListenersDialogType | null
  setOpen: (str: ListenersDialogType | null) => void
  currentRow: Listener | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Listener | null>>
}

const ListenersContext = React.createContext<ListenersContextType | null>(null)

export function ListenersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ListenersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Listener | null>(null)

  return (
    <ListenersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ListenersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useListeners = () => {
  const listenersContext = React.useContext(ListenersContext)

  if (!listenersContext) {
    throw new Error('useListeners has to be used within <ListenersProvider>')
  }

  return listenersContext
}
