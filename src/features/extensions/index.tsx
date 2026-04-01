import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function Extensions() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Extensions</h2>
            <p className='text-muted-foreground'>
              Manage Envoy ext_authz, ext_proc, rate limit services, and WASM
              plugins.
            </p>
          </div>
        </div>

        <div className='flex items-center justify-center rounded-md border border-dashed py-12'>
          <p className='text-muted-foreground'>
            Extension services configuration coming soon.
          </p>
        </div>
      </Main>
    </>
  )
}
