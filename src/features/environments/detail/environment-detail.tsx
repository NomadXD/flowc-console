import { useState } from 'react'
import type { Environment } from '@/data/mock/flowc-data'
import { Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BreadcrumbNav } from '@/components/flowc'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  EnvironmentOverview,
  EnvironmentApisTab,
  EnvironmentPoliciesTab,
} from './components'

interface EnvironmentDetailProps {
  environment: Environment
}

export function EnvironmentDetail({ environment }: EnvironmentDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const breadcrumbItems = [
    { label: 'Environments', href: '/environments' },
    {
      label: `${environment.gatewayName} :${environment.port}`,
      href: '/environments',
    },
    {
      label: environment.name,
      href: `/environments/${environment.gatewayId}/${environment.port}/${environment.name}`,
    },
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
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold tracking-tight'>
                {environment.name}
              </h1>
              {environment.tlsConfig && (
                <Badge variant='secondary'>TLS Enabled</Badge>
              )}
            </div>
            <p className='text-muted-foreground'>
              {environment.hostname} • Gateway: {environment.gatewayName} •
              Port: {environment.port}
            </p>
          </div>
          <Button disabled>
            <Rocket className='mr-2 h-4 w-4' />
            Deploy API
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='apis'>
              Deployed APIs ({environment.apiCount})
            </TabsTrigger>
            <TabsTrigger value='policies'>
              Policies ({environment.policies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-4'>
            <EnvironmentOverview environment={environment} />
          </TabsContent>

          <TabsContent value='apis' className='mt-4'>
            <EnvironmentApisTab environment={environment} />
          </TabsContent>

          <TabsContent value='policies' className='mt-4'>
            <EnvironmentPoliciesTab environment={environment} />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
