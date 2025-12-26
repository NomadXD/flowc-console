import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEnvironments } from './environments-provider'

export function EnvironmentsPrimaryButtons() {
  const { setOpen } = useEnvironments()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Environment</span> <PlusCircle size={18} />
      </Button>
    </div>
  )
}
