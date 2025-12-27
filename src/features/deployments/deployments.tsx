import { getRouteApi } from '@tanstack/react-router'
import { mockDeployments } from '@/data/mock/flowc-data'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DeploymentsDialogs } from './components/deployments-dialogs'
import { DeploymentsProvider } from './components/deployments-provider'
import { DeploymentsTable } from './components/deployments-table'

const route = getRouteApi('/_authenticated/deployments/')

export function Deployments() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <DeploymentsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Deployments</h2>
            <p className='text-muted-foreground'>
              View and manage API deployments across all environments.
            </p>
          </div>
        </div>
        <DeploymentsTable
          data={mockDeployments}
          search={search}
          navigate={navigate}
        />
      </Main>

      <DeploymentsDialogs />
    </DeploymentsProvider>
  )
}
