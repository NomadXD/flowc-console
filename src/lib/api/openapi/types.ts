import type { components, paths } from './schema'

// Resource response types
export type GatewayResponse = components['schemas']['GatewayResponse']
export type GatewayProfileResponse =
  components['schemas']['GatewayProfileResponse']
export type ListenerResponse = components['schemas']['ListenerResponse']
export type VirtualHostResponse =
  components['schemas']['VirtualHostResponse']
export type APIResponse = components['schemas']['APIResponse']
export type DeploymentResponse = components['schemas']['DeploymentResponse']

// List response types
export type GatewayListResponse =
  components['schemas']['GatewayListResponse']
export type GatewayProfileListResponse =
  components['schemas']['GatewayProfileListResponse']
export type ListenerListResponse =
  components['schemas']['ListenerListResponse']
export type VirtualHostListResponse =
  components['schemas']['VirtualHostListResponse']
export type APIListResponse = components['schemas']['APIListResponse']
export type DeploymentListResponse =
  components['schemas']['DeploymentListResponse']

// Spec types
export type GatewaySpec = components['schemas']['GatewaySpec']
export type GatewayProfileSpec =
  components['schemas']['GatewayProfileSpec']
export type ListenerSpec = components['schemas']['ListenerSpec']
export type VirtualHostSpec = components['schemas']['VirtualHostSpec']
export type APISpec = components['schemas']['APISpec']
export type DeploymentSpec = components['schemas']['DeploymentSpec']

// Put request types (for mutations)
export type GatewayPutRequest = components['schemas']['GatewayPutRequest']
export type GatewayProfilePutRequest =
  components['schemas']['GatewayProfilePutRequest']
export type ListenerPutRequest = components['schemas']['ListenerPutRequest']
export type VirtualHostPutRequest =
  components['schemas']['VirtualHostPutRequest']
export type APIPutRequest = components['schemas']['APIPutRequest']
export type DeploymentPutRequest =
  components['schemas']['DeploymentPutRequest']

// Status types
export type GatewayStatus = components['schemas']['GatewayStatus']
export type GatewayProfileStatus =
  components['schemas']['GatewayProfileStatus']
export type ListenerStatus = components['schemas']['ListenerStatus']
export type VirtualHostStatus = components['schemas']['VirtualHostStatus']
export type APIStatus = components['schemas']['APIStatus']
export type DeploymentStatus = components['schemas']['DeploymentStatus']

// Common types
export type ResourceMeta = components['schemas']['ResourceMeta']
export type ResourceKind = components['schemas']['ResourceKind']
export type ConflictPolicy = components['schemas']['ConflictPolicy']
export type Condition = components['schemas']['Condition']
export type ErrorResponse = components['schemas']['ErrorResponse']
export type DeleteResponse = components['schemas']['DeleteResponse']
export type HealthResponse = components['schemas']['HealthResponse']

// Strategy and config types
export type StrategyConfig = components['schemas']['StrategyConfig']
export type UpstreamConfig = components['schemas']['UpstreamConfig']
export type RoutingConfig = components['schemas']['RoutingConfig']
export type PolicyInstance = components['schemas']['PolicyInstance']
export type TLSConfig = components['schemas']['TLSConfig']
export type ListenerPreset = components['schemas']['ListenerPreset']
export type HTTPFilter = components['schemas']['HTTPFilter']
export type ParsedInfo = components['schemas']['ParsedInfo']

// Apply types
export type ApplyRequest = components['schemas']['ApplyRequest']
export type ApplyResult = components['schemas']['ApplyResult']
export type ApplyResultItem = components['schemas']['ApplyResultItem']

// Re-export for client usage
export type { paths, components }
