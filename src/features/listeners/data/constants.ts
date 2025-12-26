import type { ListenerProtocol } from '@/data/schemas/flowc-schemas'

// ============================================================================
// Protocol Options
// ============================================================================

export const protocolOptions: { label: string; value: ListenerProtocol }[] = [
  { label: 'HTTP', value: 'HTTP' },
  { label: 'HTTPS', value: 'HTTPS' },
  { label: 'TCP', value: 'TCP' },
]

// ============================================================================
// TLS Options
// ============================================================================

export const tlsOptions = [
  { label: 'Enabled', value: 'true' },
  { label: 'Disabled', value: 'false' },
]

// ============================================================================
// Protocol Badge Styles
// ============================================================================

export const protocolStyles: Record<
  ListenerProtocol,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  HTTP: { label: 'HTTP', variant: 'outline' },
  HTTPS: { label: 'HTTPS', variant: 'default' },
  TCP: { label: 'TCP', variant: 'secondary' },
}
