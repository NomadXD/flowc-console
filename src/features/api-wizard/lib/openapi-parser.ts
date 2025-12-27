import * as yaml from 'js-yaml'

export interface ParsedOpenApi {
  title: string
  version: string
  description: string
  servers: Array<{ url: string; description?: string }>
  pathCount: number
  rawSpec: string
}

export async function parseOpenApiFile(
  file: File
): Promise<ParsedOpenApi | null> {
  try {
    // Read file content
    const content = await file.text()

    // Parse based on file extension
    let spec: any
    const fileName = file.name.toLowerCase()

    if (fileName.endsWith('.json')) {
      spec = JSON.parse(content)
    } else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
      spec = yaml.load(content)
    } else {
      throw new Error('Unsupported file format. Please use .yaml, .yml, or .json')
    }

    // Validate basic OpenAPI structure
    if (!spec || typeof spec !== 'object') {
      throw new Error('Invalid OpenAPI specification')
    }

    // Check for OpenAPI version
    const isOpenAPI3 = spec.openapi && spec.openapi.startsWith('3.')
    const isSwagger2 = spec.swagger && spec.swagger === '2.0'

    if (!isOpenAPI3 && !isSwagger2) {
      throw new Error(
        'Unsupported OpenAPI version. Please use OpenAPI 3.x or Swagger 2.0'
      )
    }

    // Extract information
    const info = spec.info || {}
    const title = info.title || 'Untitled API'
    const version = info.version || '1.0.0'
    const description = info.description || ''

    // Extract servers (OpenAPI 3.x) or host/basePath (Swagger 2.0)
    let servers: Array<{ url: string; description?: string }> = []

    if (isOpenAPI3 && spec.servers && Array.isArray(spec.servers)) {
      servers = spec.servers.map((server: any) => ({
        url: server.url || '',
        description: server.description,
      }))
    } else if (isSwagger2 && spec.host) {
      const schemes = spec.schemes || ['https']
      const basePath = spec.basePath || ''
      servers = schemes.map((scheme: string) => ({
        url: `${scheme}://${spec.host}${basePath}`,
      }))
    }

    // Count paths
    const pathCount = spec.paths ? Object.keys(spec.paths).length : 0

    return {
      title,
      version,
      description,
      servers,
      pathCount,
      rawSpec: content,
    }
  } catch (error) {
    console.error('Error parsing OpenAPI file:', error)
    return null
  }
}

export function extractUpstreamFromServers(
  servers: Array<{ url: string }>
): { host: string; port: number; scheme: 'http' | 'https' } | null {
  if (!servers || servers.length === 0) {
    return null
  }

  try {
    const url = new URL(servers[0].url)
    const scheme = url.protocol.replace(':', '') as 'http' | 'https'
    const host = url.hostname
    const port = url.port
      ? parseInt(url.port, 10)
      : scheme === 'https'
        ? 443
        : 80

    return { host, port, scheme }
  } catch (error) {
    console.error('Error extracting upstream:', error)
    return null
  }
}

/**
 * Sanitize a string to be valid for API name
 * - Converts to lowercase
 * - Replaces spaces and invalid characters with hyphens
 * - Removes consecutive hyphens
 * - Trims hyphens from start and end
 */
export function sanitizeApiName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Trim hyphens from start and end
}

/**
 * Sanitize a string to be valid for context path
 * - Ensures it starts with /
 * - Converts to lowercase
 * - Replaces spaces and invalid characters with hyphens
 * - Removes consecutive hyphens and slashes
 */
export function sanitizeContextPath(input: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9-/]/g, '-') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/^-+|-+$/g, '') // Trim hyphens from start and end

  // Ensure it starts with /
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}
