import { z } from 'zod'

// ============================================================================
// Gateway Schema
// ============================================================================

export const gatewayStatusSchema = z.enum(['online', 'offline', 'degraded'])

export const gatewaySchema = z.object({
  id: z.string(),
  nodeId: z.string().min(1, 'Node ID is required'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Name must contain only lowercase letters, numbers, and hyphens'
    ),
  status: gatewayStatusSchema,
  region: z.string().min(1, 'Region is required'),
  createdAt: z.string(),
  updatedAt: z.string(),
  listenerCount: z.number().int().nonnegative(),
  apiCount: z.number().int().nonnegative(),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z'),
  ipAddress: z
    .string()
    .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Must be a valid IP address'),
})

export const gatewayCreateSchema = gatewaySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  listenerCount: true,
  apiCount: true,
})

export const gatewayUpdateSchema = gatewayCreateSchema.partial()

export type Gateway = z.infer<typeof gatewaySchema>
export type GatewayCreate = z.infer<typeof gatewayCreateSchema>
export type GatewayUpdate = z.infer<typeof gatewayUpdateSchema>
export type GatewayStatus = z.infer<typeof gatewayStatusSchema>

// ============================================================================
// Listener Schema
// ============================================================================

export const listenerProtocolSchema = z.enum(['HTTP', 'HTTPS', 'TCP'])

export const listenerSchema = z.object({
  port: z
    .number()
    .int()
    .min(1, 'Port must be at least 1')
    .max(65535, 'Port must be at most 65535'),
  protocol: listenerProtocolSchema,
  gatewayId: z.string().min(1, 'Gateway ID is required'),
  gatewayName: z.string(),
  tlsEnabled: z.boolean(),
  environmentCount: z.number().int().nonnegative(),
  apiCount: z.number().int().nonnegative(),
  createdAt: z.string(),
})

export const listenerCreateSchema = listenerSchema.omit({
  gatewayName: true,
  environmentCount: true,
  apiCount: true,
  createdAt: true,
})

export const listenerUpdateSchema = listenerCreateSchema
  .omit({
    port: true,
    gatewayId: true,
  })
  .partial()

export type Listener = z.infer<typeof listenerSchema>
export type ListenerCreate = z.infer<typeof listenerCreateSchema>
export type ListenerUpdate = z.infer<typeof listenerUpdateSchema>
export type ListenerProtocol = z.infer<typeof listenerProtocolSchema>

// ============================================================================
// Environment Schema
// ============================================================================

export const tlsConfigSchema = z.object({
  certPath: z.string().min(1, 'Certificate path is required'),
  keyPath: z.string().min(1, 'Key path is required'),
})

export const environmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Environment name is required')
    .max(50, 'Environment name must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Name must contain only lowercase letters, numbers, and hyphens'
    ),
  gatewayId: z.string().min(1, 'Gateway ID is required'),
  gatewayName: z.string(),
  port: z
    .number()
    .int()
    .min(1, 'Port must be at least 1')
    .max(65535, 'Port must be at most 65535'),
  hostname: z.string().min(1, 'Hostname is required'),
  sni: z.string(),
  tlsConfig: tlsConfigSchema.optional(),
  apiCount: z.number().int().nonnegative(),
  policies: z.array(z.string()),
  createdAt: z.string(),
})

export const environmentCreateSchema = environmentSchema.omit({
  gatewayName: true,
  apiCount: true,
  createdAt: true,
})

export const environmentUpdateSchema = environmentCreateSchema
  .omit({
    name: true,
    gatewayId: true,
    port: true,
  })
  .partial()

export type Environment = z.infer<typeof environmentSchema>
export type EnvironmentCreate = z.infer<typeof environmentCreateSchema>
export type EnvironmentUpdate = z.infer<typeof environmentUpdateSchema>
export type TLSConfig = z.infer<typeof tlsConfigSchema>

// ============================================================================
// Deployment Schema
// ============================================================================

export const deploymentStatusSchema = z.enum([
  'active',
  'inactive',
  'error',
  'deploying',
])

export const deploymentSchema = z.object({
  id: z.string(),
  apiName: z
    .string()
    .min(1, 'API name is required')
    .max(100, 'API name must be less than 100 characters'),
  version: z
    .string()
    .regex(/^v?\d+\.\d+\.\d+$/, 'Version must be in format vX.Y.Z or X.Y.Z'),
  gatewayId: z.string().min(1, 'Gateway ID is required'),
  gatewayName: z.string(),
  port: z
    .number()
    .int()
    .min(1, 'Port must be at least 1')
    .max(65535, 'Port must be at most 65535'),
  environment: z.string().min(1, 'Environment is required'),
  status: deploymentStatusSchema,
  deployedAt: z.string(),
  deployedBy: z.string(),
  specFile: z.string().min(1, 'Spec file is required'),
  enabledPolicies: z.array(z.string()),
})

export const deploymentCreateSchema = deploymentSchema.omit({
  id: true,
  gatewayName: true,
  deployedAt: true,
  status: true,
})

export const deploymentUpdateSchema = deploymentCreateSchema
  .omit({
    gatewayId: true,
    port: true,
    environment: true,
  })
  .partial()

export type Deployment = z.infer<typeof deploymentSchema>
export type DeploymentCreate = z.infer<typeof deploymentCreateSchema>
export type DeploymentUpdate = z.infer<typeof deploymentUpdateSchema>
export type DeploymentStatus = z.infer<typeof deploymentStatusSchema>

// ============================================================================
// Mediation Policy Schema
// ============================================================================

export const policyTypeSchema = z.enum([
  'rate-limit',
  'cors',
  'jwt-auth',
  'request-transform',
  'response-transform',
  'logging',
])

export const policyAttachmentSchema = z.enum(['gateway', 'environment'])

// Rate limit policy config
export const rateLimitConfigSchema = z.object({
  requestsPerMinute: z.number().int().positive(),
  burstSize: z.number().int().positive(),
})

// CORS policy config
export const corsConfigSchema = z.object({
  allowedOrigins: z.array(z.string()),
  allowedMethods: z.array(z.string()),
  allowedHeaders: z.array(z.string()),
  maxAge: z.number().int().positive(),
})

// JWT auth policy config
export const jwtAuthConfigSchema = z.object({
  issuer: z.string(),
  audience: z.string(),
  publicKeyUrl: z.string(),
})

// Request transform policy config
export const requestTransformConfigSchema = z.object({
  addHeaders: z.record(z.string(), z.string()),
  removeHeaders: z.array(z.string()).optional(),
})

// Response transform policy config
export const responseTransformConfigSchema = z.object({
  addHeaders: z.record(z.string(), z.string()).optional(),
  removeHeaders: z.array(z.string()),
})

// Logging policy config
export const loggingConfigSchema = z.object({
  logLevel: z.enum(['debug', 'info', 'warn', 'error']),
  logHeaders: z.boolean(),
  logBody: z.boolean(),
  destinations: z.array(z.string()),
})

export const policyConfigSchema = z.union([
  rateLimitConfigSchema,
  corsConfigSchema,
  jwtAuthConfigSchema,
  requestTransformConfigSchema,
  responseTransformConfigSchema,
  loggingConfigSchema,
  z.record(z.string(), z.unknown()), // fallback for unknown configs
])

export const mediationPolicySchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  type: policyTypeSchema,
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters'),
  attachedTo: policyAttachmentSchema,
  attachedToId: z.string().min(1, 'Attached to ID is required'),
  attachedToName: z.string(),
  config: policyConfigSchema,
  appliedToApis: z.number().int().nonnegative(),
  createdAt: z.string(),
  enabled: z.boolean(),
})

export const policyCreateSchema = mediationPolicySchema.omit({
  id: true,
  attachedToName: true,
  appliedToApis: true,
  createdAt: true,
})

export const policyUpdateSchema = policyCreateSchema
  .omit({
    attachedTo: true,
    attachedToId: true,
  })
  .partial()

export type MediationPolicy = z.infer<typeof mediationPolicySchema>
export type PolicyCreate = z.infer<typeof policyCreateSchema>
export type PolicyUpdate = z.infer<typeof policyUpdateSchema>
export type PolicyType = z.infer<typeof policyTypeSchema>
export type PolicyAttachment = z.infer<typeof policyAttachmentSchema>
export type RateLimitConfig = z.infer<typeof rateLimitConfigSchema>
export type CORSConfig = z.infer<typeof corsConfigSchema>
export type JWTAuthConfig = z.infer<typeof jwtAuthConfigSchema>
export type RequestTransformConfig = z.infer<
  typeof requestTransformConfigSchema
>
export type ResponseTransformConfig = z.infer<
  typeof responseTransformConfigSchema
>
export type LoggingConfig = z.infer<typeof loggingConfigSchema>

// ============================================================================
// Deployment Stats Schema
// ============================================================================

export const deploymentStatsByEnvSchema = z.object({
  env: z.string(),
  count: z.number().int().nonnegative(),
})

export const deploymentStatsByGatewaySchema = z.object({
  gateway: z.string(),
  count: z.number().int().nonnegative(),
})

export const deploymentActivitySchema = z.object({
  timestamp: z.string(),
  count: z.number().int().nonnegative(),
})

export const deploymentStatsSchema = z.object({
  totalDeployments: z.number().int().nonnegative(),
  activeDeployments: z.number().int().nonnegative(),
  failedDeployments: z.number().int().nonnegative(),
  deploymentsToday: z.number().int().nonnegative(),
  deploymentsThisWeek: z.number().int().nonnegative(),
  deploymentsByEnvironment: z.array(deploymentStatsByEnvSchema),
  deploymentsByGateway: z.array(deploymentStatsByGatewaySchema),
  recentActivity: z.array(deploymentActivitySchema),
})

export type DeploymentStats = z.infer<typeof deploymentStatsSchema>
export type DeploymentStatsByEnv = z.infer<typeof deploymentStatsByEnvSchema>
export type DeploymentStatsByGateway = z.infer<
  typeof deploymentStatsByGatewaySchema
>
export type DeploymentActivity = z.infer<typeof deploymentActivitySchema>

// ============================================================================
// API Schema
// ============================================================================

export const apiStatusSchema = z.enum(['draft', 'ready', 'deployed', 'deprecated'])

export const policyTypeExtendedSchema = z.enum([
  'rate-limit',
  'cors',
  'jwt-auth',
  'api-key',
  'rbac',
  'request-transform',
  'response-transform',
  'logging',
  'ip-filter',
  'custom',
])

export const inheritanceModeSchema = z.enum(['inherit', 'override', 'disable', 'add'])

export const policyInstanceSchema = z.object({
  id: z.string(),
  policyType: policyTypeExtendedSchema,
  order: z.number().int().positive(),
  enabled: z.boolean(),
  inheritanceMode: inheritanceModeSchema,
  config: z.record(z.string(), z.unknown()),
  customPolicyId: z.string().optional(),
})

export const openAPISpecSchema = z.object({
  content: z.string(),
  fileName: z.string(),
  parsedInfo: z.object({
    title: z.string(),
    version: z.string(),
    paths: z.array(z.string()),
    servers: z.array(z.string()).optional(),
  }).optional(),
})

export const upstreamConfigSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().int().min(1).max(65535),
  scheme: z.enum(['http', 'https']),
  timeout: z.string().regex(/^\d+[smh]$/, 'Timeout must be in format like 30s, 5m, 1h'),
})

export const routingConfigSchema = z.object({
  matchType: z.enum(['prefix', 'exact', 'regex']),
  caseSensitive: z.boolean(),
  loadBalancing: z.enum(['round-robin', 'random', 'least-conn']),
})

export const apiSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Name must contain only lowercase letters, numbers, and hyphens'),
  version: z.string().regex(/^v?\d+\.\d+\.\d+$/, 'Version must be in format vX.Y.Z or X.Y.Z'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  context: z.string().regex(/^\/[a-z0-9-/]*$/, 'Context must start with / and contain only lowercase letters, numbers, hyphens, and slashes'),
  status: apiStatusSchema,
  spec: openAPISpecSchema.optional(),
  upstream: upstreamConfigSchema,
  routing: routingConfigSchema,
  policyChain: z.array(policyInstanceSchema),
  deployments: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
})

export const apiCreateSchema = apiSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deployments: true,
})

export const apiUpdateSchema = apiCreateSchema.partial()

export type API = z.infer<typeof apiSchema>
export type APICreate = z.infer<typeof apiCreateSchema>
export type APIUpdate = z.infer<typeof apiUpdateSchema>
export type APIStatus = z.infer<typeof apiStatusSchema>
export type PolicyInstance = z.infer<typeof policyInstanceSchema>
export type InheritanceMode = z.infer<typeof inheritanceModeSchema>
export type OpenAPISpec = z.infer<typeof openAPISpecSchema>
export type UpstreamConfig = z.infer<typeof upstreamConfigSchema>
export type RoutingConfig = z.infer<typeof routingConfigSchema>
export type PolicyTypeExtended = z.infer<typeof policyTypeExtendedSchema>

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validates gateway data and returns parsed result
 */
export function validateGateway(data: unknown) {
  return gatewaySchema.parse(data)
}

/**
 * Validates listener data and returns parsed result
 */
export function validateListener(data: unknown) {
  return listenerSchema.parse(data)
}

/**
 * Validates environment data and returns parsed result
 */
export function validateEnvironment(data: unknown) {
  return environmentSchema.parse(data)
}

/**
 * Validates deployment data and returns parsed result
 */
export function validateDeployment(data: unknown) {
  return deploymentSchema.parse(data)
}

/**
 * Validates mediation policy data and returns parsed result
 */
export function validatePolicy(data: unknown) {
  return mediationPolicySchema.parse(data)
}

/**
 * Validates deployment stats data and returns parsed result
 */
export function validateDeploymentStats(data: unknown) {
  return deploymentStatsSchema.parse(data)
}

/**
 * Validates API data and returns parsed result
 */
export function validateAPI(data: unknown) {
  return apiSchema.parse(data)
}

// ============================================================================
// Form Schemas (for React Hook Form)
// ============================================================================

// These schemas are used with React Hook Form for form validation
export const gatewayFormSchema = gatewayCreateSchema
export const listenerFormSchema = listenerCreateSchema
export const environmentFormSchema = environmentCreateSchema
export const deploymentFormSchema = deploymentCreateSchema
export const policyFormSchema = policyCreateSchema
export const apiFormSchema = apiCreateSchema
