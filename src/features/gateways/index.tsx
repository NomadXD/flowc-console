import { getRouteApi } from '@tanstack/react-router'
import { mockGateways } from '@/data/mock/flowc-data'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GatewaysDialogs } from './components/gateways-dialogs'
import { GatewaysPrimaryButtons } from './components/gateways-primary-buttons'
import { GatewaysProvider } from './components/gateways-provider'
import { GatewaysTable } from './components/gateways-table'

const route = getRouteApi('/_authenticated/gateways/')

export function Gateways() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <GatewaysProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Gateways</h2>
            <p className='text-muted-foreground'>
              Manage your FlowC gateway instances and their configurations.
            </p>
          </div>
          <GatewaysPrimaryButtons />
        </div>
        <GatewaysTable
          data={mockGateways}
          search={search}
          navigate={navigate}
        />
      </Main>

      <GatewaysDialogs />
    </GatewaysProvider>
  )
}
