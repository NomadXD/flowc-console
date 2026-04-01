import { useNavigate, useSearch } from '@tanstack/react-router'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Loader2 } from 'lucide-react'
import { useVirtualHosts } from '@/hooks/use-virtual-hosts'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { VirtualHostsDialogs } from './components/virtual-hosts-dialogs'
import { VirtualHostsPrimaryButtons } from './components/virtual-hosts-primary-buttons'
import { VirtualHostsProvider } from './components/virtual-hosts-provider'
import { VirtualHostsTable } from './components/virtual-hosts-table'

export function VirtualHosts() {
  const search = useSearch({ strict: false })
  const navigate = useNavigate()

  const { data, isLoading, error } = useVirtualHosts()
  const virtualHosts = data?.items || []

  return (
    <VirtualHostsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Virtual Hosts</h2>
            <p className='text-muted-foreground'>
              Manage virtual host configurations across all gateways and
              listeners.
            </p>
          </div>
          <VirtualHostsPrimaryButtons />
        </div>

        {error && (
          <div className='rounded-md bg-destructive/15 p-4 text-sm text-destructive'>
            Error loading virtual hosts: {error.message}
          </div>
        )}

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <VirtualHostsTable
            data={virtualHosts}
            search={search}
            navigate={navigate as NavigateFn}
          />
        )}
      </Main>

      <VirtualHostsDialogs />
    </VirtualHostsProvider>
  )
}
