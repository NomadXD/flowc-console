import { getRouteApi } from '@tanstack/react-router'
import { mockListeners } from '@/data/mock/flowc-data'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ListenersDialogs } from './components/listeners-dialogs'
import { ListenersPrimaryButtons } from './components/listeners-primary-buttons'
import { ListenersProvider } from './components/listeners-provider'
import { ListenersTable } from './components/listeners-table'

const route = getRouteApi('/_authenticated/listeners/')

export function Listeners() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <ListenersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Listeners</h2>
            <p className='text-muted-foreground'>
              Manage listener configurations across all gateways.
            </p>
          </div>
          <ListenersPrimaryButtons />
        </div>
        <ListenersTable
          data={mockListeners}
          search={search}
          navigate={navigate}
        />
      </Main>

      <ListenersDialogs />
    </ListenersProvider>
  )
}
