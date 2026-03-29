import { getRouteApi } from '@tanstack/react-router'
import { Plus, Loader2 } from 'lucide-react'
import { useApis } from '@/hooks/use-apis'
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

  // Fetch APIs from backend
  const { data, isLoading, error } = useApis()

  const apis = data?.items || []

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
          <Button onClick={() => navigate({ to: '/apis/new' })}>
            <Plus className='me-2 h-4 w-4' />
            Create API
          </Button>
        </div>

        {error && (
          <div className='rounded-md bg-destructive/15 p-4 text-sm text-destructive'>
            Error loading APIs: {error.message}
          </div>
        )}

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <APIsTable
            data={apis}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>
    </>
  )
}
