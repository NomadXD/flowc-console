import { Package, Info, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useApiWizard } from '../../context/wizard-context'

export function ReviewSaveStep() {
  const { form } = useApiWizard()
  const formData = form.getValues()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Review & Create API
        </h2>
        <p className='text-muted-foreground mt-2'>
          Review your configuration and create your API
        </p>
      </div>

      <Alert>
        <Info className='h-4 w-4' />
        <AlertDescription>
          Your API will be created in <strong>draft</strong> status. You can deploy it to an
          environment later from the API detail page.
        </AlertDescription>
      </Alert>

      <div className='grid md:grid-cols-2 gap-4'>
        {/* API Information */}
        <Card className='p-4'>
          <h3 className='font-semibold mb-3 flex items-center gap-2'>
            <Package className='h-4 w-4' />
            API Information
          </h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Name:</span>
              <span className='font-medium'>{formData.apiInfo.name}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Display Name:</span>
              <span className='font-medium'>{formData.apiInfo.displayName}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Version:</span>
              <span className='font-medium'>{formData.apiInfo.version}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Context:</span>
              <span className='font-medium font-mono text-xs'>
                {formData.apiInfo.context}
              </span>
            </div>
            {formData.apiInfo.description && (
              <div className='flex flex-col gap-1'>
                <span className='text-muted-foreground'>Description:</span>
                <span className='font-medium text-sm'>
                  {formData.apiInfo.description}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Upstream Configuration */}
        <Card className='p-4'>
          <h3 className='font-semibold mb-3'>Upstream Configuration</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Backend URL:</span>
              <span className='font-medium font-mono text-xs'>
                {formData.upstream.scheme}://{formData.upstream.host}:
                {formData.upstream.port}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Timeout:</span>
              <span className='font-medium'>{formData.upstream.timeout}</span>
            </div>
            {formData.upstream.scheme === 'https' && (
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>TLS Verification:</span>
                <span className='font-medium'>
                  {formData.upstream.tlsVerify ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Strategy Options */}
        <Card className='p-4'>
          <h3 className='font-semibold mb-3'>Routing Strategy</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Route Matching:</span>
              <span className='font-medium capitalize'>
                {formData.strategy.routeMatching.type}
                {formData.strategy.routeMatching.caseSensitive &&
                  ' (case-sensitive)'}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Load Balancing:</span>
              <span className='font-medium capitalize'>
                {formData.strategy.loadBalancing.type.replace('-', ' ')}
              </span>
            </div>
          </div>
        </Card>

        {/* Policies Configuration */}
        <Card className='p-4'>
          <h3 className='font-semibold mb-3 flex items-center gap-2'>
            <Shield className='h-4 w-4' />
            Policies
          </h3>
          <div className='space-y-2 text-sm'>
            {formData.policies.policyChain.length === 0 ? (
              <p className='text-muted-foreground'>
                No policies configured. You can add policies later from the API detail page.
              </p>
            ) : (
              <div className='space-y-1'>
                {formData.policies.policyChain.map((policy, index) => (
                  <div key={policy.id} className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>
                      {index + 1}.
                    </span>
                    <span className='font-medium capitalize'>
                      {policy.policyType.replace('-', ' ')}
                    </span>
                    {!policy.enabled && (
                      <span className='text-xs text-muted-foreground'>(disabled)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Source Information */}
      <Alert>
        <Package className='h-4 w-4' />
        <AlertDescription>
          <div className='font-medium mb-1'>API Source:</div>
          <ul className='list-disc list-inside text-sm space-y-1'>
            {formData.sourceType === 'openapi' && formData.openApiFile ? (
              <>
                <li>OpenAPI Specification: {formData.openApiFile.fileName}</li>
                <li>{formData.openApiFile.parsedSpec?.pathCount || 0} API paths detected</li>
              </>
            ) : (
              <li>Created from scratch (minimal OpenAPI spec will be generated)</li>
            )}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
