import * as yaml from 'js-yaml'
import type { ApiWizardFormData } from '../data/schema'

interface FlowcConfig {
  name: string
  version: string
  description: string
  context: string
  upstream: {
    host: string
    port: number
    scheme: string
    timeout: string
  }
  strategy: {
    deployment: {
      type: string
    }
    route_matching: {
      type: string
      case_sensitive: boolean
    }
    load_balancing: {
      type: string
    }
  }
}

// Note: This function is currently not used in the new API creation flow
// It's kept for potential future use when deploying APIs
export function generateFlowcYaml(
  formData: ApiWizardFormData,
  _environmentHostname?: string
): string {
  const config: FlowcConfig = {
    name: formData.apiInfo.name,
    version: formData.apiInfo.version,
    description: formData.apiInfo.description || '',
    context: formData.apiInfo.context,
    upstream: {
      host: formData.upstream.host,
      port: formData.upstream.port,
      scheme: formData.upstream.scheme,
      timeout: formData.upstream.timeout,
    },
    strategy: {
      deployment: {
        type: formData.strategy.deployment.type,
      },
      route_matching: {
        type: formData.strategy.routeMatching.type,
        case_sensitive: formData.strategy.routeMatching.caseSensitive,
      },
      load_balancing: {
        type: formData.strategy.loadBalancing.type,
      },
    },
  }

  return yaml.dump(config, {
    indent: 2,
    lineWidth: 120,
    quotingType: '"',
  })
}

export function generateMinimalOpenApiSpec(
  apiName: string,
  version: string,
  description: string
): string {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: apiName,
      version: version,
      description: description || `${apiName} API`,
    },
    paths: {
      '/*': {
        get: {
          summary: 'Catch-all route',
          description: 'Proxies all GET requests to the upstream service',
          responses: {
            '200': {
              description: 'Successful response',
            },
          },
        },
        post: {
          summary: 'Catch-all route',
          description: 'Proxies all POST requests to the upstream service',
          responses: {
            '200': {
              description: 'Successful response',
            },
          },
        },
        put: {
          summary: 'Catch-all route',
          description: 'Proxies all PUT requests to the upstream service',
          responses: {
            '200': {
              description: 'Successful response',
            },
          },
        },
        delete: {
          summary: 'Catch-all route',
          description: 'Proxies all DELETE requests to the upstream service',
          responses: {
            '200': {
              description: 'Successful response',
            },
          },
        },
        patch: {
          summary: 'Catch-all route',
          description: 'Proxies all PATCH requests to the upstream service',
          responses: {
            '200': {
              description: 'Successful response',
            },
          },
        },
      },
    },
  }

  return yaml.dump(spec, {
    indent: 2,
    lineWidth: 120,
  })
}
