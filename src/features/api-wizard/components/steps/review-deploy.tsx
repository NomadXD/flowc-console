import { useMemo } from 'react'
import {
  Server,
  Radio,
  Globe,
  ArrowRight,
  Package,
  Info,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { YamlPreview } from '../yaml-preview'
import { useApiWizard } from '../../context/wizard-context'
import {
  generateFlowcYaml,
  generateMinimalOpenApiSpec,
} from '../../lib/yaml-generator'
import {
  mockGateways,
  mockListeners,
  mockEnvironments,
} from '@/data/mock/flowc-data'

export function ReviewDeployStep() {
  const { form } = useApiWizard()
  const formData = form.getValues()

  // Find selected entities
  const selectedGateway = mockGateways.find(
    (g) => g.id === formData.deploymentTarget?.gatewayId
  )
  const selectedListener = mockListeners.find(
    (l) =>
      l.gatewayId === formData.deploymentTarget?.gatewayId &&
      l.port === formData.deploymentTarget?.port
  )
  const selectedEnvironment = mockEnvironments.find(
    (e) =>
      e.gatewayId === formData.deploymentTarget?.gatewayId &&
      e.port === formData.deploymentTarget?.port &&
      e.name === formData.deploymentTarget?.environmentName
  )

  // Generate YAML preview
  const generatedYaml = useMemo(() => {
    if (!formData.deploymentTarget || !selectedEnvironment) return ''
    return generateFlowcYaml(formData, selectedEnvironment.hostname)
  }, [formData, selectedEnvironment])

  // Generate minimal OpenAPI spec if starting from scratch
  const generatedOpenApiSpec = useMemo(() => {
    if (formData.sourceType === 'openapi') return null
    return generateMinimalOpenApiSpec(
      formData.apiInfo.name,
      formData.apiInfo.version,
      formData.apiInfo.description || ''
    )
  }, [formData])

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          Review & Deploy
        </h2>
        <p className='text-muted-foreground mt-2'>
          Review your configuration and deploy your API to FlowC Gateway
        </p>
      </div>

      <Alert>
        <Info className='h-4 w-4' />
        <AlertDescription>
          Make sure all the information below is correct before deploying.
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
              <div className='flex justify-between items-start gap-4'>
                <span className='text-muted-foreground shrink-0'>
                  Description:
                </span>
                <span className='font-medium text-right'>
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
          <h3 className='font-semibold mb-3'>Strategy Options</h3>
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
      </div>

      {/* Deployment Path - Full Width */}
      <Card className='p-4'>
        <h3 className='font-semibold mb-3'>Deployment Path</h3>
        <div className='flex items-center gap-2 text-sm flex-wrap'>
          <div className='flex items-center gap-2 bg-muted px-3 py-2 rounded-md'>
            <Server className='h-4 w-4' />
            <span>{selectedGateway?.name}</span>
          </div>
          <ArrowRight className='h-4 w-4 text-muted-foreground' />
          <div className='flex items-center gap-2 bg-muted px-3 py-2 rounded-md'>
            <Radio className='h-4 w-4' />
            <span>Port {selectedListener?.port}</span>
          </div>
          <ArrowRight className='h-4 w-4 text-muted-foreground' />
          <div className='flex items-center gap-2 bg-muted px-3 py-2 rounded-md'>
            <Globe className='h-4 w-4' />
            <span>{selectedEnvironment?.name}</span>
          </div>
        </div>
        {selectedEnvironment && (
          <div className='mt-3 pt-3 border-t text-sm space-y-1'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Hostname:</span>
              <span className='font-medium'>{selectedEnvironment.hostname}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>SNI:</span>
              <span className='font-medium'>{selectedEnvironment.sni}</span>
            </div>
          </div>
        )}
      </Card>

      <Separator />

      {/* Generated YAML Preview */}
      <div className='space-y-4'>
        <h3 className='font-semibold'>Generated Configuration</h3>
        <YamlPreview yaml={generatedYaml} title='flowc.yaml' />
        {generatedOpenApiSpec && (
          <YamlPreview
            yaml={generatedOpenApiSpec}
            title='openapi.yaml (generated)'
          />
        )}
      </div>

      {/* Files to be packaged */}
      <Alert>
        <Package className='h-4 w-4' />
        <AlertDescription>
          <div className='font-medium mb-1'>Files to be packaged in ZIP:</div>
          <ul className='list-disc list-inside text-sm space-y-1'>
            <li>flowc.yaml</li>
            <li>
              {formData.sourceType === 'openapi' && formData.openApiFile
                ? formData.openApiFile.fileName
                : 'openapi.yaml (generated)'}
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
