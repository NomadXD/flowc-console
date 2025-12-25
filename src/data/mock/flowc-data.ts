import { faker } from '@faker-js/faker'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Gateway {
  id: string
  nodeId: string
  name: string
  status: 'online' | 'offline' | 'degraded'
  region: string
  createdAt: string
  updatedAt: string
  listenerCount: number
  apiCount: number
  version: string
  ipAddress: string
}

export interface Listener {
  port: number
  protocol: 'HTTP' | 'HTTPS' | 'TCP'
  gatewayId: string
  gatewayName: string
  tlsEnabled: boolean
  environmentCount: number
  apiCount: number
  createdAt: string
}

export interface Environment {
  name: string
  gatewayId: string
  gatewayName: string
  port: number
  hostname: string
  sni: string
  tlsConfig?: {
    certPath: string
    keyPath: string
  }
  apiCount: number
  policies: string[] // policy IDs
  createdAt: string
}

export interface Deployment {
  id: string
  apiName: string
  version: string
  gatewayId: string
  gatewayName: string
  port: number
  environment: string
  status: 'active' | 'inactive' | 'error' | 'deploying'
  deployedAt: string
  deployedBy: string
  specFile: string // OpenAPI spec filename
  enabledPolicies: string[] // policy IDs enabled for this API
}

export interface MediationPolicy {
  id: string
  name: string
  type:
    | 'rate-limit'
    | 'cors'
    | 'jwt-auth'
    | 'request-transform'
    | 'response-transform'
    | 'logging'
  description: string
  attachedTo: 'gateway' | 'environment'
  attachedToId: string
  attachedToName: string
  config: Record<string, unknown>
  appliedToApis: number // count
  createdAt: string
  enabled: boolean
}

export interface DeploymentStats {
  totalDeployments: number
  activeDeployments: number
  failedDeployments: number
  deploymentsToday: number
  deploymentsThisWeek: number
  deploymentsByEnvironment: { env: string; count: number }[]
  deploymentsByGateway: { gateway: string; count: number }[]
  recentActivity: { timestamp: string; count: number }[] // for charts
}

// ============================================================================
// Mock Data Generation
// ============================================================================

// Gateways
export const mockGateways: Gateway[] = [
  {
    id: 'gw-us-east-1',
    nodeId: 'node-12345',
    name: 'gateway-us-east-1',
    status: 'online',
    region: 'us-east-1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2025-01-20T14:22:00Z',
    listenerCount: 3,
    apiCount: 28,
    version: '1.29.0',
    ipAddress: '10.0.1.100',
  },
  {
    id: 'gw-us-west-2',
    nodeId: 'node-67890',
    name: 'gateway-us-west-2',
    status: 'online',
    region: 'us-west-2',
    createdAt: '2024-02-10T08:15:00Z',
    updatedAt: '2025-01-19T16:45:00Z',
    listenerCount: 2,
    apiCount: 15,
    version: '1.29.0',
    ipAddress: '10.0.2.100',
  },
  {
    id: 'gw-eu-central-1',
    nodeId: 'node-11223',
    name: 'gateway-eu-central-1',
    status: 'degraded',
    region: 'eu-central-1',
    createdAt: '2024-03-05T12:00:00Z',
    updatedAt: '2025-01-21T09:10:00Z',
    listenerCount: 2,
    apiCount: 12,
    version: '1.28.5',
    ipAddress: '10.0.3.100',
  },
  {
    id: 'gw-ap-south-1',
    nodeId: 'node-44556',
    name: 'gateway-ap-south-1',
    status: 'online',
    region: 'ap-south-1',
    createdAt: '2024-04-20T15:30:00Z',
    updatedAt: '2025-01-20T11:30:00Z',
    listenerCount: 3,
    apiCount: 18,
    version: '1.29.0',
    ipAddress: '10.0.4.100',
  },
  {
    id: 'gw-local-dev',
    nodeId: 'node-99999',
    name: 'gateway-local-dev',
    status: 'offline',
    region: 'local',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    listenerCount: 2,
    apiCount: 5,
    version: '1.29.0',
    ipAddress: '127.0.0.1',
  },
]

// Listeners
export const mockListeners: Listener[] = [
  // us-east-1 listeners
  {
    port: 443,
    protocol: 'HTTPS',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    tlsEnabled: true,
    environmentCount: 3,
    apiCount: 20,
    createdAt: '2024-01-15T10:35:00Z',
  },
  {
    port: 80,
    protocol: 'HTTP',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    tlsEnabled: false,
    environmentCount: 1,
    apiCount: 5,
    createdAt: '2024-01-15T10:40:00Z',
  },
  {
    port: 8443,
    protocol: 'HTTPS',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    tlsEnabled: true,
    environmentCount: 1,
    apiCount: 3,
    createdAt: '2024-06-10T14:20:00Z',
  },
  // us-west-2 listeners
  {
    port: 443,
    protocol: 'HTTPS',
    gatewayId: 'gw-us-west-2',
    gatewayName: 'gateway-us-west-2',
    tlsEnabled: true,
    environmentCount: 2,
    apiCount: 12,
    createdAt: '2024-02-10T08:20:00Z',
  },
  {
    port: 80,
    protocol: 'HTTP',
    gatewayId: 'gw-us-west-2',
    gatewayName: 'gateway-us-west-2',
    tlsEnabled: false,
    environmentCount: 1,
    apiCount: 3,
    createdAt: '2024-02-10T08:25:00Z',
  },
  // eu-central-1 listeners
  {
    port: 443,
    protocol: 'HTTPS',
    gatewayId: 'gw-eu-central-1',
    gatewayName: 'gateway-eu-central-1',
    tlsEnabled: true,
    environmentCount: 2,
    apiCount: 10,
    createdAt: '2024-03-05T12:10:00Z',
  },
  {
    port: 8080,
    protocol: 'HTTP',
    gatewayId: 'gw-eu-central-1',
    gatewayName: 'gateway-eu-central-1',
    tlsEnabled: false,
    environmentCount: 1,
    apiCount: 2,
    createdAt: '2024-03-05T12:15:00Z',
  },
  // ap-south-1 listeners
  {
    port: 443,
    protocol: 'HTTPS',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    tlsEnabled: true,
    environmentCount: 2,
    apiCount: 15,
    createdAt: '2024-04-20T15:35:00Z',
  },
  {
    port: 80,
    protocol: 'HTTP',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    tlsEnabled: false,
    environmentCount: 1,
    apiCount: 2,
    createdAt: '2024-04-20T15:40:00Z',
  },
  {
    port: 9090,
    protocol: 'HTTP',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    tlsEnabled: false,
    environmentCount: 1,
    apiCount: 1,
    createdAt: '2024-08-15T10:00:00Z',
  },
  // local-dev listeners
  {
    port: 8080,
    protocol: 'HTTP',
    gatewayId: 'gw-local-dev',
    gatewayName: 'gateway-local-dev',
    tlsEnabled: false,
    environmentCount: 2,
    apiCount: 4,
    createdAt: '2024-12-01T09:10:00Z',
  },
  {
    port: 8443,
    protocol: 'HTTPS',
    gatewayId: 'gw-local-dev',
    gatewayName: 'gateway-local-dev',
    tlsEnabled: true,
    environmentCount: 1,
    apiCount: 1,
    createdAt: '2024-12-01T09:15:00Z',
  },
]

// Environments
export const mockEnvironments: Environment[] = [
  // Production environments
  {
    name: 'production',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 443,
    hostname: 'api.example.com',
    sni: 'api.example.com',
    tlsConfig: {
      certPath: '/etc/certs/api.example.com.crt',
      keyPath: '/etc/certs/api.example.com.key',
    },
    apiCount: 12,
    policies: ['pol-rate-limit-prod', 'pol-cors-main', 'pol-jwt-auth'],
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    name: 'production',
    gatewayId: 'gw-us-west-2',
    gatewayName: 'gateway-us-west-2',
    port: 443,
    hostname: 'api-west.example.com',
    sni: 'api-west.example.com',
    tlsConfig: {
      certPath: '/etc/certs/api-west.example.com.crt',
      keyPath: '/etc/certs/api-west.example.com.key',
    },
    apiCount: 10,
    policies: ['pol-rate-limit-prod', 'pol-cors-main'],
    createdAt: '2024-02-10T09:00:00Z',
  },
  // Staging environments
  {
    name: 'staging',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 443,
    hostname: 'staging-api.example.com',
    sni: 'staging-api.example.com',
    tlsConfig: {
      certPath: '/etc/certs/staging-api.example.com.crt',
      keyPath: '/etc/certs/staging-api.example.com.key',
    },
    apiCount: 5,
    policies: ['pol-logging-verbose'],
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    name: 'staging',
    gatewayId: 'gw-eu-central-1',
    gatewayName: 'gateway-eu-central-1',
    port: 443,
    hostname: 'staging-eu.example.com',
    sni: 'staging-eu.example.com',
    tlsConfig: {
      certPath: '/etc/certs/staging-eu.example.com.crt',
      keyPath: '/etc/certs/staging-eu.example.com.key',
    },
    apiCount: 8,
    policies: ['pol-logging-verbose'],
    createdAt: '2024-03-05T13:00:00Z',
  },
  // Dev environments
  {
    name: 'development',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 8443,
    hostname: 'dev-api.example.com',
    sni: 'dev-api.example.com',
    tlsConfig: {
      certPath: '/etc/certs/dev-api.example.com.crt',
      keyPath: '/etc/certs/dev-api.example.com.key',
    },
    apiCount: 3,
    policies: [],
    createdAt: '2024-06-10T14:30:00Z',
  },
  {
    name: 'development',
    gatewayId: 'gw-local-dev',
    gatewayName: 'gateway-local-dev',
    port: 8080,
    hostname: 'localhost',
    sni: 'localhost',
    apiCount: 4,
    policies: [],
    createdAt: '2024-12-01T09:20:00Z',
  },
  // HTTP environments
  {
    name: 'public',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 80,
    hostname: 'public.example.com',
    sni: '',
    apiCount: 5,
    policies: ['pol-rate-limit-public'],
    createdAt: '2024-01-15T11:30:00Z',
  },
  {
    name: 'test',
    gatewayId: 'gw-us-west-2',
    gatewayName: 'gateway-us-west-2',
    port: 443,
    hostname: 'test-api.example.com',
    sni: 'test-api.example.com',
    tlsConfig: {
      certPath: '/etc/certs/test-api.example.com.crt',
      keyPath: '/etc/certs/test-api.example.com.key',
    },
    apiCount: 2,
    policies: [],
    createdAt: '2024-05-15T10:00:00Z',
  },
  {
    name: 'integration',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    port: 443,
    hostname: 'integration-api.example.com',
    sni: 'integration-api.example.com',
    tlsConfig: {
      certPath: '/etc/certs/integration-api.example.com.crt',
      keyPath: '/etc/certs/integration-api.example.com.key',
    },
    apiCount: 7,
    policies: ['pol-logging-verbose'],
    createdAt: '2024-07-20T11:00:00Z',
  },
  {
    name: 'production',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    port: 443,
    hostname: 'api-apac.example.com',
    sni: 'api-apac.example.com',
    tlsConfig: {
      certPath: '/etc/certs/api-apac.example.com.crt',
      keyPath: '/etc/certs/api-apac.example.com.key',
    },
    apiCount: 8,
    policies: ['pol-rate-limit-prod', 'pol-jwt-auth'],
    createdAt: '2024-04-20T16:00:00Z',
  },
]

// Deployments
export const mockDeployments: Deployment[] = [
  {
    id: 'dep-001',
    apiName: 'user-service',
    version: 'v2.1.0',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 443,
    environment: 'production',
    status: 'active',
    deployedAt: '2025-01-20T10:30:00Z',
    deployedBy: 'admin@example.com',
    specFile: 'user-service-openapi.yaml',
    enabledPolicies: ['pol-rate-limit-prod', 'pol-jwt-auth'],
  },
  {
    id: 'dep-002',
    apiName: 'auth-service',
    version: 'v1.5.2',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 443,
    environment: 'production',
    status: 'active',
    deployedAt: '2025-01-19T15:20:00Z',
    deployedBy: 'admin@example.com',
    specFile: 'auth-service-openapi.yaml',
    enabledPolicies: ['pol-rate-limit-prod', 'pol-cors-main'],
  },
  {
    id: 'dep-003',
    apiName: 'payment-gateway',
    version: 'v3.0.1',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 443,
    environment: 'production',
    status: 'active',
    deployedAt: '2025-01-18T09:15:00Z',
    deployedBy: 'deploy-bot@example.com',
    specFile: 'payment-gateway-openapi.yaml',
    enabledPolicies: ['pol-rate-limit-prod', 'pol-jwt-auth'],
  },
  {
    id: 'dep-004',
    apiName: 'notification-service',
    version: 'v1.2.0',
    gatewayId: 'gw-us-east-1',
    gatewayName: 'gateway-us-east-1',
    port: 443,
    environment: 'staging',
    status: 'active',
    deployedAt: '2025-01-21T11:00:00Z',
    deployedBy: 'developer@example.com',
    specFile: 'notification-service-openapi.yaml',
    enabledPolicies: ['pol-logging-verbose'],
  },
  {
    id: 'dep-005',
    apiName: 'inventory-api',
    version: 'v2.0.0',
    gatewayId: 'gw-us-west-2',
    gatewayName: 'gateway-us-west-2',
    port: 443,
    environment: 'production',
    status: 'active',
    deployedAt: '2025-01-17T14:30:00Z',
    deployedBy: 'admin@example.com',
    specFile: 'inventory-api-openapi.yaml',
    enabledPolicies: ['pol-rate-limit-prod'],
  },
  {
    id: 'dep-006',
    apiName: 'analytics-api',
    version: 'v1.8.3',
    gatewayId: 'gw-us-west-2',
    gatewayName: 'gateway-us-west-2',
    port: 443,
    environment: 'production',
    status: 'error',
    deployedAt: '2025-01-20T16:45:00Z',
    deployedBy: 'admin@example.com',
    specFile: 'analytics-api-openapi.yaml',
    enabledPolicies: ['pol-rate-limit-prod', 'pol-cors-main'],
  },
  {
    id: 'dep-007',
    apiName: 'search-service',
    version: 'v2.3.1',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    port: 443,
    environment: 'production',
    status: 'active',
    deployedAt: '2025-01-19T08:20:00Z',
    deployedBy: 'deploy-bot@example.com',
    specFile: 'search-service-openapi.yaml',
    enabledPolicies: ['pol-rate-limit-prod', 'pol-jwt-auth'],
  },
  {
    id: 'dep-008',
    apiName: 'recommendation-engine',
    version: 'v1.0.5',
    gatewayId: 'gw-ap-south-1',
    gatewayName: 'gateway-ap-south-1',
    port: 443,
    environment: 'integration',
    status: 'deploying',
    deployedAt: '2025-01-21T12:10:00Z',
    deployedBy: 'developer@example.com',
    specFile: 'recommendation-engine-openapi.yaml',
    enabledPolicies: ['pol-logging-verbose'],
  },
  {
    id: 'dep-009',
    apiName: 'reporting-api',
    version: 'v2.5.0',
    gatewayId: 'gw-eu-central-1',
    gatewayName: 'gateway-eu-central-1',
    port: 443,
    environment: 'staging',
    status: 'active',
    deployedAt: '2025-01-16T13:40:00Z',
    deployedBy: 'admin@example.com',
    specFile: 'reporting-api-openapi.yaml',
    enabledPolicies: ['pol-logging-verbose'],
  },
  {
    id: 'dep-010',
    apiName: 'webhook-handler',
    version: 'v1.1.2',
    gatewayId: 'gw-local-dev',
    gatewayName: 'gateway-local-dev',
    port: 8080,
    environment: 'development',
    status: 'inactive',
    deployedAt: '2025-01-15T10:00:00Z',
    deployedBy: 'developer@example.com',
    specFile: 'webhook-handler-openapi.yaml',
    enabledPolicies: [],
  },
]

// Mediation Policies
export const mockPolicies: MediationPolicy[] = [
  {
    id: 'pol-rate-limit-prod',
    name: 'Production Rate Limit',
    type: 'rate-limit',
    description: 'Rate limit for production environments - 1000 req/min',
    attachedTo: 'gateway',
    attachedToId: 'gw-us-east-1',
    attachedToName: 'gateway-us-east-1',
    config: {
      requestsPerMinute: 1000,
      burstSize: 100,
    },
    appliedToApis: 12,
    createdAt: '2024-01-15T12:00:00Z',
    enabled: true,
  },
  {
    id: 'pol-rate-limit-public',
    name: 'Public API Rate Limit',
    type: 'rate-limit',
    description: 'Stricter rate limit for public APIs - 100 req/min',
    attachedTo: 'environment',
    attachedToId: 'gw-us-east-1-80-public',
    attachedToName: 'public (gateway-us-east-1:80)',
    config: {
      requestsPerMinute: 100,
      burstSize: 20,
    },
    appliedToApis: 5,
    createdAt: '2024-01-15T12:30:00Z',
    enabled: true,
  },
  {
    id: 'pol-cors-main',
    name: 'CORS Allow All Origins',
    type: 'cors',
    description: 'CORS policy allowing all origins for public APIs',
    attachedTo: 'gateway',
    attachedToId: 'gw-us-east-1',
    attachedToName: 'gateway-us-east-1',
    config: {
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 3600,
    },
    appliedToApis: 15,
    createdAt: '2024-01-16T10:00:00Z',
    enabled: true,
  },
  {
    id: 'pol-jwt-auth',
    name: 'JWT Authentication',
    type: 'jwt-auth',
    description: 'Validates JWT tokens for secured endpoints',
    attachedTo: 'gateway',
    attachedToId: 'gw-us-east-1',
    attachedToName: 'gateway-us-east-1',
    config: {
      issuer: 'https://auth.example.com',
      audience: 'api.example.com',
      publicKeyUrl: 'https://auth.example.com/.well-known/jwks.json',
    },
    appliedToApis: 8,
    createdAt: '2024-01-17T14:00:00Z',
    enabled: true,
  },
  {
    id: 'pol-req-transform',
    name: 'Add Request Headers',
    type: 'request-transform',
    description: 'Adds custom headers to incoming requests',
    attachedTo: 'environment',
    attachedToId: 'gw-us-west-2-443-production',
    attachedToName: 'production (gateway-us-west-2:443)',
    config: {
      addHeaders: {
        'X-Gateway-Region': 'us-west-2',
        'X-Environment': 'production',
      },
    },
    appliedToApis: 10,
    createdAt: '2024-02-10T11:00:00Z',
    enabled: true,
  },
  {
    id: 'pol-resp-transform',
    name: 'Remove Internal Headers',
    type: 'response-transform',
    description: 'Removes internal headers from responses',
    attachedTo: 'gateway',
    attachedToId: 'gw-us-west-2',
    attachedToName: 'gateway-us-west-2',
    config: {
      removeHeaders: ['X-Internal-Server', 'X-Debug-Info'],
    },
    appliedToApis: 15,
    createdAt: '2024-02-11T09:00:00Z',
    enabled: true,
  },
  {
    id: 'pol-logging-verbose',
    name: 'Verbose Logging',
    type: 'logging',
    description: 'Detailed logging for staging/dev environments',
    attachedTo: 'environment',
    attachedToId: 'gw-us-east-1-443-staging',
    attachedToName: 'staging (gateway-us-east-1:443)',
    config: {
      logLevel: 'debug',
      logHeaders: true,
      logBody: true,
      destinations: ['stdout', 'file:/var/log/flowc/staging.log'],
    },
    appliedToApis: 5,
    createdAt: '2024-01-20T15:00:00Z',
    enabled: true,
  },
  {
    id: 'pol-logging-minimal',
    name: 'Minimal Logging',
    type: 'logging',
    description: 'Basic logging for production',
    attachedTo: 'gateway',
    attachedToId: 'gw-ap-south-1',
    attachedToName: 'gateway-ap-south-1',
    config: {
      logLevel: 'info',
      logHeaders: false,
      logBody: false,
      destinations: ['stdout'],
    },
    appliedToApis: 18,
    createdAt: '2024-04-20T16:30:00Z',
    enabled: false,
  },
]

// Deployment Stats
export const mockDeploymentStats: DeploymentStats = {
  totalDeployments: 45,
  activeDeployments: 38,
  failedDeployments: 2,
  deploymentsToday: 3,
  deploymentsThisWeek: 12,
  deploymentsByEnvironment: [
    { env: 'production', count: 30 },
    { env: 'staging', count: 8 },
    { env: 'development', count: 4 },
    { env: 'integration', count: 3 },
  ],
  deploymentsByGateway: [
    { gateway: 'gateway-us-east-1', count: 20 },
    { gateway: 'gateway-us-west-2', count: 12 },
    { gateway: 'gateway-ap-south-1', count: 8 },
    { gateway: 'gateway-eu-central-1', count: 3 },
    { gateway: 'gateway-local-dev', count: 2 },
  ],
  recentActivity: [
    { timestamp: '2025-01-15T00:00:00Z', count: 2 },
    { timestamp: '2025-01-16T00:00:00Z', count: 3 },
    { timestamp: '2025-01-17T00:00:00Z', count: 5 },
    { timestamp: '2025-01-18T00:00:00Z', count: 4 },
    { timestamp: '2025-01-19T00:00:00Z', count: 6 },
    { timestamp: '2025-01-20T00:00:00Z', count: 8 },
    { timestamp: '2025-01-21T00:00:00Z', count: 3 },
  ],
}

// ============================================================================
// Mock API Functions (for future backend integration)
// ============================================================================

export const mockGatewayAPI = {
  list: () => Promise.resolve(mockGateways),
  get: (id: string) =>
    Promise.resolve(mockGateways.find((g) => g.id === id) || null),
  create: (data: Partial<Gateway>) =>
    Promise.resolve({ ...data, id: faker.string.uuid() } as Gateway),
  update: (id: string, data: Partial<Gateway>) =>
    Promise.resolve({ ...mockGateways.find((g) => g.id === id)!, ...data }),
  delete: (_id: string) => Promise.resolve({ success: true }),
  listAPIs: (id: string) =>
    Promise.resolve(mockDeployments.filter((d) => d.gatewayId === id)),
}

export const mockListenerAPI = {
  list: (gatewayId?: string) =>
    Promise.resolve(
      gatewayId
        ? mockListeners.filter((l) => l.gatewayId === gatewayId)
        : mockListeners
    ),
  get: (gatewayId: string, port: number) =>
    Promise.resolve(
      mockListeners.find((l) => l.gatewayId === gatewayId && l.port === port) ||
        null
    ),
  create: (data: Partial<Listener>) => Promise.resolve({ ...data } as Listener),
  update: (gatewayId: string, port: number, data: Partial<Listener>) =>
    Promise.resolve({
      ...mockListeners.find(
        (l) => l.gatewayId === gatewayId && l.port === port
      )!,
      ...data,
    }),
  delete: (_gatewayId: string, _port: number) =>
    Promise.resolve({ success: true }),
}

export const mockEnvironmentAPI = {
  list: (gatewayId?: string, port?: number) =>
    Promise.resolve(
      mockEnvironments.filter(
        (e) =>
          (!gatewayId || e.gatewayId === gatewayId) &&
          (!port || e.port === port)
      )
    ),
  get: (gatewayId: string, port: number, name: string) =>
    Promise.resolve(
      mockEnvironments.find(
        (e) => e.gatewayId === gatewayId && e.port === port && e.name === name
      ) || null
    ),
  create: (data: Partial<Environment>) =>
    Promise.resolve({ ...data } as Environment),
  update: (
    gatewayId: string,
    port: number,
    name: string,
    data: Partial<Environment>
  ) =>
    Promise.resolve({
      ...mockEnvironments.find(
        (e) => e.gatewayId === gatewayId && e.port === port && e.name === name
      )!,
      ...data,
    }),
  delete: (_gatewayId: string, _port: number, _name: string) =>
    Promise.resolve({ success: true }),
  listAPIs: (gatewayId: string, port: number, name: string) =>
    Promise.resolve(
      mockDeployments.filter(
        (d) =>
          d.gatewayId === gatewayId && d.port === port && d.environment === name
      )
    ),
}

export const mockDeploymentAPI = {
  list: () => Promise.resolve(mockDeployments),
  get: (id: string) =>
    Promise.resolve(mockDeployments.find((d) => d.id === id) || null),
  create: (data: Partial<Deployment>) =>
    Promise.resolve({ ...data, id: faker.string.uuid() } as Deployment),
  update: (id: string, data: Partial<Deployment>) =>
    Promise.resolve({ ...mockDeployments.find((d) => d.id === id)!, ...data }),
  delete: (_id: string) => Promise.resolve({ success: true }),
  stats: () => Promise.resolve(mockDeploymentStats),
}

export const mockPolicyAPI = {
  list: () => Promise.resolve(mockPolicies),
  get: (id: string) =>
    Promise.resolve(mockPolicies.find((p) => p.id === id) || null),
  create: (data: Partial<MediationPolicy>) =>
    Promise.resolve({ ...data, id: faker.string.uuid() } as MediationPolicy),
  update: (id: string, data: Partial<MediationPolicy>) =>
    Promise.resolve({ ...mockPolicies.find((p) => p.id === id)!, ...data }),
  delete: (_id: string) => Promise.resolve({ success: true }),
}
