import type {
  RouteMatchingType,
  LoadBalancingType,
  UpstreamScheme,
} from './schema'

// ============================================================================
// Default Form Values
// ============================================================================
export const DEFAULT_API_INFO = {
  name: '',
  version: '1.0.0',
  context: '/',
  description: '',
}

export const DEFAULT_DEPLOYMENT_TARGET = {
  gatewayId: '',
  port: 443,
  environmentName: '',
}

export const DEFAULT_UPSTREAM_CONFIG = {
  host: '',
  port: 443,
  scheme: 'https' as UpstreamScheme,
  timeout: '30s',
  tlsVerify: true,
}

export const DEFAULT_STRATEGY_OPTIONS = {
  deployment: { type: 'basic' as const },
  routeMatching: { type: 'prefix' as RouteMatchingType, caseSensitive: true },
  loadBalancing: { type: 'round-robin' as LoadBalancingType },
}

// ============================================================================
// Dropdown Options
// ============================================================================
export const UPSTREAM_SCHEME_OPTIONS = [
  { label: 'HTTPS', value: 'https' },
  { label: 'HTTP', value: 'http' },
]

export const ROUTE_MATCHING_OPTIONS = [
  { label: 'Prefix Match', value: 'prefix' },
  { label: 'Exact Match', value: 'exact' },
  { label: 'Regex Match', value: 'regex' },
]

export const LOAD_BALANCING_OPTIONS = [
  { label: 'Round Robin', value: 'round-robin' },
  { label: 'Random', value: 'random' },
  { label: 'Least Connections', value: 'least-connections' },
]

// ============================================================================
// Step Labels
// ============================================================================
export const STEP_LABELS = {
  'source-selection': 'Source',
  'openapi-upload': 'Upload Spec',
  'api-basics': 'API Basics',
  'api-info': 'API Info',
  'deployment-target': 'Deploy Target',
  'upstream-config': 'Upstream',
  'strategy-options': 'Strategy',
  'review-deploy': 'Review',
}

// ============================================================================
// Wizard Steps
// ============================================================================
export type WizardStep =
  | 'source-selection'
  | 'openapi-upload'
  | 'api-basics'
  | 'api-info'
  | 'deployment-target'
  | 'upstream-config'
  | 'strategy-options'
  | 'review-deploy'

// OpenAPI flow steps
export const OPENAPI_FLOW_STEPS: WizardStep[] = [
  'source-selection',
  'openapi-upload',
  'api-info',
  'deployment-target',
  'upstream-config',
  'strategy-options',
  'review-deploy',
]

// Scratch flow steps
export const SCRATCH_FLOW_STEPS: WizardStep[] = [
  'source-selection',
  'api-basics',
  'deployment-target',
  'upstream-config',
  'strategy-options',
  'review-deploy',
]

// ============================================================================
// File Upload
// ============================================================================
export const ACCEPTED_FILE_TYPES = ['.yaml', '.yml', '.json']
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
