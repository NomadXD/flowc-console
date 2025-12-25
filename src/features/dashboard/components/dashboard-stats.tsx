import {
  mockGateways,
  mockListeners,
  mockDeployments,
} from '@/data/mock/flowc-data'
import { Server, Radio, Rocket, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/flowc'

export function DashboardStats() {
  const totalGateways = mockGateways.length
  const onlineGateways = mockGateways.filter(
    (g) => g.status === 'online'
  ).length
  const totalListeners = mockListeners.length
  const activeDeployments = mockDeployments.filter(
    (d) => d.status === 'active'
  ).length
  const totalApis = mockDeployments.length

  const uptime = ((onlineGateways / totalGateways) * 100).toFixed(1)

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <StatsCard
        title='Gateways'
        value={totalGateways}
        description={`${onlineGateways} online`}
        icon={Server}
      />
      <StatsCard
        title='Listeners'
        value={totalListeners}
        description='Active listeners'
        icon={Radio}
      />
      <StatsCard
        title='Deployed APIs'
        value={totalApis}
        description={`${activeDeployments} active`}
        icon={Rocket}
      />
      <StatsCard
        title='Uptime'
        value={`${uptime}%`}
        icon={TrendingUp}
        trend={{
          value: 2.5,
          isPositive: true,
          label: 'from last week',
        }}
      />
    </div>
  )
}
