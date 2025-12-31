import { useState } from 'react'
import type { API } from '@/data/mock/flowc-data'
import { Edit, Rocket } from 'lucide-react'
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
  APIOverview,
  APIPoliciesTab,
  APIDeploymentsTab,
  APISpecTab,
  APISettingsTab,
} from './components'
import { DeployAPIDialog } from './components/deploy-api-dialog'

interface APIDetailProps {
  api: API
}

export function APIDetail({ api }: APIDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [deployDialogOpen, setDeployDialogOpen] = useState(false)

  const breadcrumbItems = [
    { label: 'APIs', href: '/apis' },
    {
      label: api.displayName,
      href: `/apis/${api.id}`,
    },
  ]

  const getStatusColor = (status: API['status']) => {
    switch (status) {
      case 'draft':
        return 'secondary'
      case 'ready':
        return 'default'
      case 'deployed':
        return 'default'
      case 'deprecated':
        return 'outline'
      default:
        return 'default'
    }
  }

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
            <div className='flex items-center gap-3'>
              <h1 className='text-3xl font-bold tracking-tight'>
                {api.displayName}
              </h1>
              <Badge variant={getStatusColor(api.status)}>
                {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
              </Badge>
            </div>
            <p className='text-muted-foreground mt-1'>
              {api.description || 'No description provided'}
            </p>
            <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
              <span>Version: {api.version}</span>
              <span>•</span>
              <span>Context: {api.context}</span>
              <span>•</span>
              <span>{api.deployments.length} Deployment{api.deployments.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{api.policyChain.length} Polic{api.policyChain.length !== 1 ? 'ies' : 'y'}</span>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline'>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </Button>
            <Button onClick={() => setDeployDialogOpen(true)}>
              <Rocket className='mr-2 h-4 w-4' />
              Deploy
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='policies'>
              Policies ({api.policyChain.length})
            </TabsTrigger>
            <TabsTrigger value='deployments'>
              Deployments ({api.deployments.length})
            </TabsTrigger>
            <TabsTrigger value='spec'>OpenAPI Spec</TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='mt-4'>
            <APIOverview api={api} />
          </TabsContent>

          <TabsContent value='policies' className='mt-4'>
            <APIPoliciesTab api={api} />
          </TabsContent>

          <TabsContent value='deployments' className='mt-4'>
            <APIDeploymentsTab api={api} />
          </TabsContent>

          <TabsContent value='spec' className='mt-4'>
            <APISpecTab api={api} />
          </TabsContent>

          <TabsContent value='settings' className='mt-4'>
            <APISettingsTab api={api} />
          </TabsContent>
        </Tabs>
      </Main>

      <DeployAPIDialog
        api={api}
        open={deployDialogOpen}
        onOpenChange={setDeployDialogOpen}
      />
    </>
  )
}
