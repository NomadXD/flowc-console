import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useListeners } from './listeners-provider'

export function ListenersPrimaryButtons() {
  const { setOpen } = useListeners()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Listener</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
