import * as yaml from 'js-yaml'
import JSZip from 'jszip'
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
        type: formData.strategy?.deployment.type || 'basic',
      },
      route_matching: {
        type: formData.strategy?.routeMatching.type || 'prefix',
        case_sensitive: formData.strategy?.routeMatching.caseSensitive ?? true,
      },
      load_balancing: {
        type: formData.strategy?.loadBalancing.type || 'round-robin',
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

/**
 * Generate API bundle (YAML + OpenAPI spec in ZIP)
 * This creates a ZIP file containing:
 * - flowc.yaml (FlowC configuration)
 * - openapi.yaml (OpenAPI spec - either uploaded or generated minimal spec)
 */
export async function generateAPIBundle(
  formData: ApiWizardFormData
): Promise<{ yaml: string; zip: Blob }> {
  const zip = new JSZip()

  // Generate FlowC config YAML
  const flowcYaml = generateFlowcYaml(formData)

  // Get OpenAPI spec (either uploaded or generate minimal)
  let openApiSpec: string
  if (formData.openApiFile) {
    // Use uploaded OpenAPI spec
    openApiSpec = formData.openApiFile.fileContent
  } else {
    // Generate minimal OpenAPI spec for scratch flow
    openApiSpec = generateMinimalOpenApiSpec(
      formData.apiInfo.displayName,
      formData.apiInfo.version,
      formData.apiInfo.description || ''
    )
  }

  // Add files to ZIP (backend expects 'flowc.yaml', not 'flowc-config.yaml')
  zip.file('flowc.yaml', flowcYaml)
  zip.file('openapi.yaml', openApiSpec)

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  })

  return {
    yaml: flowcYaml,
    zip: zipBlob,
  }
}
