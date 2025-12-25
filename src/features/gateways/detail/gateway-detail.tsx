import { useState } from 'react'
import type { Gateway } from '@/data/mock/flowc-data'
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
} from './components'

interface GatewayDetailProps {
  gateway: Gateway
}

export function GatewayDetail({ gateway }: GatewayDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const breadcrumbItems = [
    { label: 'Gateways', href: '/gateways' },
    { label: gateway.name, href: `/gateways/${gateway.id}` },
  ]

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <BreadcrumbNav items={breadcrumbItems} />

        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {gateway.name}
            </h1>
            <p className='text-muted-foreground'>
              {gateway.nodeId} • {gateway.region} • {gateway.ipAddress}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='listeners'>
              Listeners ({gateway.listenerCount})
            </TabsTrigger>
            <TabsTrigger value='apis'>
              All APIs ({gateway.apiCount})
            </TabsTrigger>
            <TabsTrigger value='policies'>Policies</TabsTrigger>
            <TabsTrigger value='config'>Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-4'>
            <GatewayOverview gateway={gateway} />
          </TabsContent>

          <TabsContent value='listeners' className='mt-4'>
            <GatewayListenersTab gatewayId={gateway.id} />
          </TabsContent>

          <TabsContent value='apis' className='mt-4'>
            <GatewayApisTab gatewayId={gateway.id} />
          </TabsContent>

          <TabsContent value='policies' className='mt-4'>
            <GatewayPoliciesTab gatewayId={gateway.id} />
          </TabsContent>

          <TabsContent value='config' className='mt-4'>
            <GatewayConfigTab gateway={gateway} />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
