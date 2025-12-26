import { getRouteApi } from '@tanstack/react-router'
import { mockEnvironments } from '@/data/mock/flowc-data'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EnvironmentsDialogs } from './components/environments-dialogs'
import { EnvironmentsPrimaryButtons } from './components/environments-primary-buttons'
import { EnvironmentsProvider } from './components/environments-provider'
import { EnvironmentsTable } from './components/environments-table'

const route = getRouteApi('/_authenticated/environments/')

export function Environments() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <EnvironmentsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Environments</h2>
            <p className='text-muted-foreground'>
              Manage environment configurations across all gateways and
              listeners.
            </p>
          </div>
          <EnvironmentsPrimaryButtons />
        </div>
        <EnvironmentsTable
          data={mockEnvironments}
          search={search}
          navigate={navigate}
        />
      </Main>

      <EnvironmentsDialogs />
    </EnvironmentsProvider>
  )
}
