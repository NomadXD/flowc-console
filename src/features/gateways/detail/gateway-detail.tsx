import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useGateway } from '@/hooks/use-gateways'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BreadcrumbNav } from '@/components/flowc'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  GatewayOverview,
  GatewayListenersTab,
  GatewayApisTab,
  GatewayPoliciesTab,
  GatewayConfigTab,
  GatewaySetupTab,
} from './components'

const route = getRouteApi('/_authenticated/gateways/$gatewayId')

export function GatewayDetail() {
  const { gatewayId } = route.useParams()
  const { tab } = route.useSearch()
  const navigate = route.useNavigate()
  const { data: gateway, isLoading, error } = useGateway(gatewayId)

  const activeTab = tab || 'overview'

  const setActiveTab = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, tab: value === 'overview' ? undefined : value }),
      replace: true,
    })
  }

  const breadcrumbItems = [
    { label: 'Gateways', href: '/gateways' },
    {
      label: gateway?.metadata?.name || gatewayId,
      href: `/gateways/${gatewayId}`,
    },
  ]

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <BreadcrumbNav items={breadcrumbItems} />

        {error && (
          <div className='rounded-md bg-destructive/15 p-4 text-sm text-destructive'>
            Error loading gateway: {error.message}
          </div>
        )}

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : gateway ? (
          <>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold tracking-tight'>
                  {gateway.metadata.name}
                </h1>
                <p className='text-muted-foreground'>
                  {gateway.spec.nodeId}
                  {gateway.spec.profileRef && (
                    <> &bull; Profile: {gateway.spec.profileRef}</>
                  )}
                  {gateway.status?.phase && (
                    <> &bull; {gateway.status.phase}</>
                  )}
                </p>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='setup'>Setup</TabsTrigger>
                <TabsTrigger value='listeners'>Listeners</TabsTrigger>
                <TabsTrigger value='apis'>Deployments</TabsTrigger>
                <TabsTrigger value='policies'>Policies</TabsTrigger>
                <TabsTrigger value='config'>Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='mt-4'>
                <GatewayOverview gateway={gateway} />
              </TabsContent>

              <TabsContent value='setup' className='mt-4'>
                <GatewaySetupTab gateway={gateway} />
              </TabsContent>

              <TabsContent value='listeners' className='mt-4'>
                <GatewayListenersTab gatewayName={gateway.metadata.name} />
              </TabsContent>

              <TabsContent value='apis' className='mt-4'>
                <GatewayApisTab gatewayName={gateway.metadata.name} />
              </TabsContent>

              <TabsContent value='policies' className='mt-4'>
                <GatewayPoliciesTab gatewayName={gateway.metadata.name} />
              </TabsContent>

              <TabsContent value='config' className='mt-4'>
                <GatewayConfigTab gateway={gateway} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className='py-12 text-center text-muted-foreground'>
            Gateway not found
          </div>
        )}
      </Main>
    </>
  )
}
