import { useState } from 'react'
import { RefreshButton } from '@/components/flowc'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DashboardStats } from './components/dashboard-stats'
import { DeploymentActivityChart } from './components/deployment-activity-chart'
import { GatewayHealthTable } from './components/gateway-health-table'
import { RecentDeploymentsTable } from './components/recent-deployments-table'

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-sm text-muted-foreground'>
              Overview of your FlowC API Gateway infrastructure
            </p>
          </div>
          <RefreshButton
            onRefresh={handleRefresh}
            isLoading={isRefreshing}
            showLabel
            variant='outline'
          />
        </div>

        <div className='space-y-6'>
          {/* Stats Cards */}
          <DashboardStats />

          {/* Gateway Health */}
          <GatewayHealthTable />

          {/* Recent Deployments and Activity Chart */}
          <div className='grid gap-6 lg:grid-cols-1'>
            <RecentDeploymentsTable />
            <DeploymentActivityChart />
          </div>
        </div>
      </Main>
    </>
  )
}
