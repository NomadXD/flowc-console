import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGatewaysContext } from './gateways-provider'

export function GatewaysPrimaryButtons() {
  const { setOpen } = useGatewaysContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Gateway</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
