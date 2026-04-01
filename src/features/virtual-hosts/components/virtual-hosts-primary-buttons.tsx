import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVirtualHostsContext } from './virtual-hosts-provider'

export function VirtualHostsPrimaryButtons() {
  const { setOpen } = useVirtualHostsContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Virtual Host</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
