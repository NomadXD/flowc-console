import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { mockAPIs } from '@/data/mock/flowc-data'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { APIsTable } from './components/apis-table'

const route = getRouteApi('/_authenticated/apis/')

export function APIs() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>APIs</h2>
            <p className='text-muted-foreground'>
              Manage your API definitions and configurations.
            </p>
          </div>
          <Button disabled>
            <Plus className='me-2 h-4 w-4' />
            Create API
          </Button>
        </div>
        <APIsTable
          data={mockAPIs}
          search={search}
          navigate={navigate}
        />
      </Main>
    </>
  )
}
