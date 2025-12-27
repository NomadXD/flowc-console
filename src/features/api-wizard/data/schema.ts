import { z } from 'zod'

// ============================================================================
// Source Selection Schema
// ============================================================================
export const sourceTypeSchema = z.enum(['openapi', 'scratch'])

// ============================================================================
// API Information Schema
// ============================================================================
export const apiInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'API name must be at least 2 characters')
    .max(50, 'API name must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Name must contain only lowercase letters, numbers, and hyphens'
    ),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z (e.g., 1.0.0)'),
  context: z
    .string()
    .min(1, 'Context path is required')
    .regex(
      /^\/[a-z0-9-/]*$/,
      'Context must start with / and contain only lowercase letters, numbers, hyphens, and slashes'
    ),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
})

// ============================================================================
// Deployment Target Schema
// ============================================================================
export const deploymentTargetSchema = z.object({
  gatewayId: z.string().min(1, 'Gateway is required'),
  port: z.number().int().min(1).max(65535),
  environmentName: z.string().min(1, 'Environment is required'),
})

// ============================================================================
// Upstream Configuration Schema
// ============================================================================
export const upstreamSchemeSchema = z.enum(['http', 'https'])

export const upstreamConfigSchema = z.object({
  host: z
    .string()
    .min(1, 'Upstream host is required')
    .regex(
      /^[a-zA-Z0-9.-]+$/,
      'Host must be a valid hostname or IP address'
    ),
  port: z
    .number()
    .int()
    .min(1, 'Port must be at least 1')
    .max(65535, 'Port must be at most 65535'),
  scheme: upstreamSchemeSchema,
  timeout: z
    .string()
    .regex(/^\d+[smh]$/, 'Timeout must be in format: 30s, 5m, or 1h'),
  tlsVerify: z.boolean().optional().default(true),
})

// ============================================================================
// Strategy Options Schema
// ============================================================================
export const routeMatchingTypeSchema = z.enum(['prefix', 'exact', 'regex'])
export const loadBalancingTypeSchema = z.enum([
  'round-robin',
  'random',
  'least-connections',
])

export const strategyOptionsSchema = z.object({
  deployment: z.object({
    type: z.literal('basic'),
  }),
  routeMatching: z.object({
    type: routeMatchingTypeSchema,
    caseSensitive: z.boolean(),
  }),
  loadBalancing: z.object({
    type: loadBalancingTypeSchema,
  }),
})

// ============================================================================
// OpenAPI File Schema (for validation)
// ============================================================================
export const openApiFileSchema = z.object({
  fileName: z.string(),
  fileContent: z.string(),
  parsedSpec: z
    .object({
      title: z.string().optional(),
      version: z.string().optional(),
      description: z.string().optional(),
      servers: z
        .array(
          z.object({
            url: z.string(),
            description: z.string().optional(),
          })
        )
        .optional(),
      pathCount: z.number(),
    })
    .optional(),
})

// ============================================================================
// Complete Wizard Form Schema
// ============================================================================
export const apiWizardFormSchema = z.object({
  // Source selection
  sourceType: sourceTypeSchema,

  // OpenAPI file (optional, only for 'openapi' source)
  openApiFile: openApiFileSchema.optional(),

  // API information
  apiInfo: apiInfoSchema,

  // Deployment target
  deploymentTarget: deploymentTargetSchema,

  // Upstream configuration
  upstream: upstreamConfigSchema,

  // Strategy options
  strategy: strategyOptionsSchema,
})

// ============================================================================
// Step-specific Validation Schemas
// ============================================================================
export const step0Schema = z.object({
  sourceType: sourceTypeSchema,
})

export const step1ASchema = z.object({
  openApiFile: openApiFileSchema.refine(
    (file) => file.parsedSpec !== undefined,
    'Please upload a valid OpenAPI specification'
  ),
})

export const step1BSchema = z.object({
  apiInfo: apiInfoSchema,
})

export const step2Schema = z.object({
  apiInfo: apiInfoSchema,
})

export const step3Schema = z.object({
  deploymentTarget: deploymentTargetSchema,
})

export const step4Schema = z.object({
  upstream: upstreamConfigSchema,
})

export const step5Schema = z.object({
  strategy: strategyOptionsSchema,
})

// ============================================================================
// Type Exports
// ============================================================================
export type SourceType = z.infer<typeof sourceTypeSchema>
export type ApiInfo = z.infer<typeof apiInfoSchema>
export type DeploymentTarget = z.infer<typeof deploymentTargetSchema>
export type UpstreamConfig = z.infer<typeof upstreamConfigSchema>
export type StrategyOptions = z.infer<typeof strategyOptionsSchema>
export type OpenApiFile = z.infer<typeof openApiFileSchema>
export type ApiWizardFormData = z.infer<typeof apiWizardFormSchema>
export type RouteMatchingType = z.infer<typeof routeMatchingTypeSchema>
export type LoadBalancingType = z.infer<typeof loadBalancingTypeSchema>
export type UpstreamScheme = z.infer<typeof upstreamSchemeSchema>
