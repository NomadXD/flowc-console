import { useState } from 'react'
import { CheckCircle2, Copy, Container, Server } from 'lucide-react'
import type { GatewayResponse } from '@/lib/api/openapi/types'
import { useListeners } from '@/hooks/use-listeners'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GatewaySetupTabProps {
  gateway: GatewayResponse
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      className='absolute top-3 right-3'
      onClick={handleCopy}
    >
      {copied ? (
        <CheckCircle2 className='h-4 w-4 text-green-500' />
      ) : (
        <Copy className='h-4 w-4' />
      )}
    </Button>
  )
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className='relative'>
      <CopyButton text={code} />
      <pre className='overflow-x-auto rounded-lg bg-muted/50 p-4 pr-12'>
        <code className={`font-mono text-sm ${language ? `language-${language}` : ''}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

export function GatewaySetupTab({ gateway }: GatewaySetupTabProps) {
  const { data: listenersData } = useListeners({
    gatewayRef: gateway.metadata.name,
  })
  const listeners = listenersData?.items || []

  const gatewayName = gateway.metadata.name
  const nodeId = gateway.spec.nodeId

  // Build port mappings from listeners
  const portMappings = listeners
    .map((l) => `-p ${l.spec.port}:${l.spec.port}`)
    .join(' \\\n  ')

  const portMappingsShort = listeners
    .map((l) => `${l.spec.port}:${l.spec.port}`)
    .join(', ')

  // Docker command
  const dockerCommand = `docker run -d \\
  --name ${gatewayName} \\
  ${portMappings || '-p 8080:8080'} \\
  -e FLOWC_GATEWAY_NAME=${gatewayName} \\
  -e FLOWC_NODE_ID=${nodeId} \\
  -e FLOWC_CONTROL_PLANE=<CONTROL_PLANE_HOST>:18000 \\
  ghcr.io/flowc-labs/flowc-gateway:latest`

  // Docker compose
  const dockerCompose = `version: '3.8'
services:
  ${gatewayName}:
    image: ghcr.io/flowc-labs/flowc-gateway:latest
    container_name: ${gatewayName}
    ports:
${listeners.length > 0 ? listeners.map((l) => `      - "${l.spec.port}:${l.spec.port}"`).join('\n') : '      - "8080:8080"'}
    environment:
      FLOWC_GATEWAY_NAME: ${gatewayName}
      FLOWC_NODE_ID: ${nodeId}
      FLOWC_CONTROL_PLANE: <CONTROL_PLANE_HOST>:18000
    restart: unless-stopped`

  // Kubernetes CRD
  const k8sCrd = `apiVersion: gateway.flowc.io/v1alpha1
kind: Gateway
metadata:
  name: ${gatewayName}
  namespace: flowc-system
spec:
  nodeId: ${nodeId}${gateway.spec.profileRef ? `\n  profileRef: ${gateway.spec.profileRef}` : ''}
  replicas: 1
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 256Mi`

  // Helm values
  const helmValues = `# values.yaml
gateway:
  name: ${gatewayName}
  nodeId: ${nodeId}${gateway.spec.profileRef ? `\n  profileRef: ${gateway.spec.profileRef}` : ''}
  replicas: 1
  image:
    repository: ghcr.io/flowc-labs/flowc-gateway
    tag: latest
  resources:
    requests:
      cpu: 100m
      memory: 128Mi`

  const helmCommand = `helm install ${gatewayName} flowc/flowc-gateway \\
  -f values.yaml \\
  -n flowc-system --create-namespace`

  return (
    <div className='space-y-6'>
      {/* Status banner */}
      <Card className='border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20'>
        <CardContent className='flex items-start gap-3 pt-6'>
          <CheckCircle2 className='mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400' />
          <div>
            <p className='font-medium'>
              Gateway <span className='font-mono'>{gatewayName}</span> created
              successfully
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Follow the instructions below to connect a gateway data plane
              instance to the flowc control plane.
              {listeners.length > 0 && (
                <>
                  {' '}
                  Your gateway has {listeners.length} listener
                  {listeners.length > 1 ? 's' : ''} configured
                  {portMappingsShort && ` (ports: ${portMappingsShort})`}.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deployment options */}
      <Tabs defaultValue='docker' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='docker' className='flex items-center gap-2'>
            <Container className='h-4 w-4' />
            Docker / VM
          </TabsTrigger>
          <TabsTrigger value='kubernetes' className='flex items-center gap-2'>
            <Server className='h-4 w-4' />
            Kubernetes
          </TabsTrigger>
        </TabsList>

        {/* Docker Tab */}
        <TabsContent value='docker' className='mt-4 space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <CardTitle>Docker Run</CardTitle>
                <Badge variant='secondary'>Quickstart</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Run the gateway as a standalone Docker container. Replace{' '}
                <code className='rounded bg-muted px-1 py-0.5 font-mono text-xs'>
                  &lt;CONTROL_PLANE_HOST&gt;
                </code>{' '}
                with your flowc control plane address.
              </p>
              <CodeBlock code={dockerCommand} language='bash' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <CardTitle>Docker Compose</CardTitle>
                <Badge variant='outline'>Recommended for VMs</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Add this service to your <code className='rounded bg-muted px-1 py-0.5 font-mono text-xs'>docker-compose.yml</code> for a
                production-ready VM deployment with automatic restarts.
              </p>
              <CodeBlock code={dockerCompose} language='yaml' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verify Connection</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                After starting the container, verify it connects to the control
                plane:
              </p>
              <CodeBlock
                code={`# Check container status\ndocker logs ${gatewayName}\n\n# Verify gateway is receiving configuration\ncurl http://localhost:${listeners[0]?.spec.port || 8080}/healthz`}
                language='bash'
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kubernetes Tab */}
        <TabsContent value='kubernetes' className='mt-4 space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <CardTitle>Custom Resource</CardTitle>
                <Badge variant='secondary'>Quickstart</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Apply the Gateway custom resource to your Kubernetes cluster.
                The flowc operator will provision the data plane automatically.
              </p>
              <CodeBlock code={k8sCrd} language='yaml' />
              <div className='mt-3'>
                <p className='mb-2 text-sm font-medium'>Apply the resource:</p>
                <CodeBlock
                  code={`kubectl apply -f ${gatewayName}-gateway.yaml`}
                  language='bash'
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <CardTitle>Helm Chart</CardTitle>
                <Badge variant='outline'>Recommended for production</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Use the flowc Helm chart for production deployments with
                full lifecycle management.
              </p>
              <CodeBlock code={helmValues} language='yaml' />
              <div className='mt-3'>
                <p className='mb-2 text-sm font-medium'>Install with Helm:</p>
                <CodeBlock code={helmCommand} language='bash' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verify Deployment</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Check that the gateway pod is running and connected:
              </p>
              <CodeBlock
                code={`# Check pod status\nkubectl get pods -n flowc-system -l app.kubernetes.io/name=${gatewayName}\n\n# Check gateway resource status\nkubectl get gateway ${gatewayName} -n flowc-system\n\n# View logs\nkubectl logs -n flowc-system -l app.kubernetes.io/name=${gatewayName} -f`}
                language='bash'
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
