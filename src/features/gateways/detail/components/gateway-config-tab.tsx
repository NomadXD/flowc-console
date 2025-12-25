import { useState } from 'react'
import type { Gateway } from '@/data/mock/flowc-data'
import { Download, Copy, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GatewayConfigTabProps {
  gateway: Gateway
}

export function GatewayConfigTab({ gateway }: GatewayConfigTabProps) {
  const [copied, setCopied] = useState(false)

  // Mock Envoy configuration
  const mockEnvoyConfig = {
    node: {
      id: gateway.nodeId,
      cluster: gateway.name,
      metadata: {
        region: gateway.region,
        version: gateway.version,
        ip_address: gateway.ipAddress,
      },
    },
    static_resources: {
      listeners: [
        {
          name: 'listener_0',
          address: {
            socket_address: {
              address: '0.0.0.0',
              port_value: 443,
            },
          },
          filter_chains: [
            {
              filters: [
                {
                  name: 'envoy.filters.network.http_connection_manager',
                  typed_config: {
                    '@type':
                      'type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager',
                    stat_prefix: 'ingress_http',
                    route_config: {
                      name: 'local_route',
                      virtual_hosts: [
                        {
                          name: 'backend',
                          domains: ['*'],
                          routes: [
                            {
                              match: {
                                prefix: '/',
                              },
                              route: {
                                cluster: 'service_backend',
                              },
                            },
                          ],
                        },
                      ],
                    },
                    http_filters: [
                      {
                        name: 'envoy.filters.http.router',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      clusters: [
        {
          name: 'service_backend',
          connect_timeout: '5s',
          type: 'STRICT_DNS',
          lb_policy: 'ROUND_ROBIN',
          load_assignment: {
            cluster_name: 'service_backend',
            endpoints: [
              {
                lb_endpoints: [
                  {
                    endpoint: {
                      address: {
                        socket_address: {
                          address: 'backend.example.com',
                          port_value: 8080,
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    admin: {
      address: {
        socket_address: {
          address: '127.0.0.1',
          port_value: 9901,
        },
      },
    },
  }

  const configJson = JSON.stringify(mockEnvoyConfig, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${gateway.name}-config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-4'>
      {/* Config Info */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Gateway Configuration</CardTitle>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle2 className='mr-2 h-4 w-4' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='mr-2 h-4 w-4' />
                    Copy
                  </>
                )}
              </Button>
              <Button variant='outline' size='sm' onClick={handleDownload}>
                <Download className='mr-2 h-4 w-4' />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-4'>
            <div>
              <p className='text-sm font-medium'>Gateway</p>
              <p className='text-sm text-muted-foreground'>{gateway.name}</p>
            </div>
            <div>
              <p className='text-sm font-medium'>Node ID</p>
              <p className='font-mono text-sm text-muted-foreground'>
                {gateway.nodeId}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium'>Envoy Version</p>
              <Badge variant='outline'>{gateway.version}</Badge>
            </div>
          </div>

          {/* JSON Viewer */}
          <div className='relative'>
            <pre className='overflow-x-auto rounded-lg bg-muted/50 p-4'>
              <code className='font-mono text-sm'>{configJson}</code>
            </pre>
          </div>

          {/* Config Stats */}
          <div className='mt-4 grid gap-4 md:grid-cols-3'>
            <div className='rounded-lg border p-3'>
              <p className='text-sm font-medium'>Listeners</p>
              <p className='text-2xl font-bold'>
                {mockEnvoyConfig.static_resources.listeners.length}
              </p>
            </div>
            <div className='rounded-lg border p-3'>
              <p className='text-sm font-medium'>Clusters</p>
              <p className='text-2xl font-bold'>
                {mockEnvoyConfig.static_resources.clusters.length}
              </p>
            </div>
            <div className='rounded-lg border p-3'>
              <p className='text-sm font-medium'>Admin Port</p>
              <p className='font-mono text-2xl font-bold'>
                {mockEnvoyConfig.admin.address.socket_address.port_value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>• This is a read-only view of the current Envoy configuration</p>
            <p>
              • Configuration is generated automatically based on deployed APIs
              and policies
            </p>
            <p>
              • To modify the configuration, update APIs, listeners, or policies
              through the respective management pages
            </p>
            <p>
              • Configuration changes are applied automatically upon deployment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
