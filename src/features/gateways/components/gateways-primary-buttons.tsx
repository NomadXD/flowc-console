import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGateways } from './gateways-provider'

export function GatewaysPrimaryButtons() {
  const { setOpen } = useGateways()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Gateway</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
