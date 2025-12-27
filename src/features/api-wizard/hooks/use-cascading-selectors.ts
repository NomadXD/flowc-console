import { useMemo } from 'react'
import {
  mockGateways,
  mockListeners,
  mockEnvironments,
} from '@/data/mock/flowc-data'

export function useCascadingSelectors(
  selectedGatewayId: string | null,
  selectedPort: number | null
) {
  // All gateways available
  const gateways = mockGateways

  // Filter listeners by selected gateway
  const listeners = useMemo(() => {
    if (!selectedGatewayId) return []
    return mockListeners.filter((l) => l.gatewayId === selectedGatewayId)
  }, [selectedGatewayId])

  // Filter environments by selected gateway + port
  const environments = useMemo(() => {
    if (!selectedGatewayId || !selectedPort) return []
    return mockEnvironments.filter(
      (e) => e.gatewayId === selectedGatewayId && e.port === selectedPort
    )
  }, [selectedGatewayId, selectedPort])

  return {
    gateways,
    listeners,
    environments,
  }
}
