import { Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useApiWizard } from '../../context/wizard-context'

export function PoliciesConfigStep() {
  const { form } = useApiWizard()
  const policyChain = form.watch('policies.policyChain')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Configure Policies
        </h2>
        <p className='text-muted-foreground mt-2'>
          Add mediation policies to your API (optional)
        </p>
      </div>

      <Alert>
        <Info className='h-4 w-4' />
        <AlertDescription>
          Policy configuration is optional. You can skip this step and configure
          policies later from the API detail page.
        </AlertDescription>
      </Alert>

      <div className='rounded-lg border border-dashed p-8 text-center'>
        <p className='text-sm text-muted-foreground'>
          {policyChain.length === 0 ? (
            <>
              No policies configured yet.
              <br />
              Click <strong>Continue</strong> to proceed without policies, or configure them
              later from the API detail page.
            </>
          ) : (
            <>
              {policyChain.length} {policyChain.length === 1 ? 'policy' : 'policies'} configured.
            </>
          )}
        </p>
      </div>

      {/* TODO: Add policy chain editor component here in future enhancement */}
      {/* <PolicyChainEditor
        policies={policyChain}
        onChange={(policies) => form.setValue('policies.policyChain', policies)}
      /> */}
    </div>
  )
}
