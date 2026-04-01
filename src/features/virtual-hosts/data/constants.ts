import type { VirtualHostResponse } from '@/lib/api/openapi/types'

// Common virtual host names
export const virtualHostNames = [
  { label: 'Production', value: 'production' },
  { label: 'Staging', value: 'staging' },
  { label: 'Development', value: 'development' },
  { label: 'Test', value: 'test' },
  { label: 'Integration', value: 'integration' },
  { label: 'Public', value: 'public' },
] as const

// Virtual host name styles (for badges and visual indicators)
export const virtualHostNameStyles: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
    label: string
  }
> = {
  production: {
    variant: 'default',
    label: 'Production',
  },
  staging: {
    variant: 'outline',
    label: 'Staging',
  },
  development: {
    variant: 'secondary',
    label: 'Development',
  },
  test: {
    variant: 'secondary',
    label: 'Test',
  },
  integration: {
    variant: 'default',
    label: 'Integration',
  },
  public: {
    variant: 'default',
    label: 'Public',
  },
}

// Get virtual host style (with fallback for custom virtual host names)
export function getVirtualHostStyle(name: string) {
  return (
    virtualHostNameStyles[name.toLowerCase()] || {
      variant: 'default' as const,
      label: name,
    }
  )
}

// Check if virtual host has HTTP filters
export function hasHttpFilters(virtualHost: VirtualHostResponse): boolean {
  return (virtualHost.spec.httpFilters?.length ?? 0) > 0
}
