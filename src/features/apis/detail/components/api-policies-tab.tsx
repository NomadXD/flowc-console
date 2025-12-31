import type { API } from '@/data/mock/flowc-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Plus,
  Settings,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import { EmptyState } from '@/components/flowc'

interface APIPoliciesTabProps {
  api: API
}

export function APIPoliciesTab({ api }: APIPoliciesTabProps) {
  const getPolicyIcon = (_type: string) => {
    return <Shield className='h-4 w-4' />
  }

  const getPolicyTypeLabel = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getInheritanceModeColor = (mode: string) => {
    switch (mode) {
      case 'inherit':
        return 'secondary'
      case 'override':
        return 'default'
      case 'disable':
        return 'destructive'
      case 'add':
        return 'default'
      default:
        return 'secondary'
    }
  }

  if (api.policyChain.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <EmptyState
            icon={Shield}
            title='No policies configured'
            description='Add policies to secure and transform your API requests and responses.'
            action={{
              label: 'Add Policy',
              onClick: () => {},
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Policy Chain</CardTitle>
              <CardDescription>
                Policies execute in order from top to bottom. Drag to reorder.
              </CardDescription>
            </div>
            <Button disabled>
              <Plus className='mr-2 h-4 w-4' />
              Add Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {api.policyChain
              .sort((a, b) => a.order - b.order)
              .map((policy) => (
                <div
                  key={policy.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 ${
                    !policy.enabled
                      ? 'opacity-50 bg-muted/50'
                      : 'bg-card hover:bg-accent/50'
                  } transition-colors`}
                >
                  {/* Drag Handle */}
                  <div className='cursor-grab text-muted-foreground hover:text-foreground'>
                    <GripVertical className='h-5 w-5' />
                  </div>

                  {/* Order Number */}
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
                    {policy.order}
                  </div>

                  {/* Policy Info */}
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      {getPolicyIcon(policy.policyType)}
                      <h4 className='font-semibold'>
                        {getPolicyTypeLabel(policy.policyType)}
                      </h4>
                      <Badge
                        variant={getInheritanceModeColor(
                          policy.inheritanceMode
                        )}
                      >
                        {policy.inheritanceMode.charAt(0).toUpperCase() +
                          policy.inheritanceMode.slice(1)}
                      </Badge>
                      {!policy.enabled && (
                        <Badge variant='secondary'>Disabled</Badge>
                      )}
                    </div>
                    {Object.keys(policy.config).length > 0 && (
                      <p className='text-sm text-muted-foreground mt-1'>
                        {Object.entries(policy.config)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <span key={key} className='mr-4'>
                              {key}: {String(value)}
                            </span>
                          ))}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='icon' disabled>
                      {policy.enabled ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                    </Button>
                    <Button variant='ghost' size='icon' disabled>
                      <Settings className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {/* Info Box */}
          <div className='mt-6 rounded-lg bg-muted p-4'>
            <div className='flex gap-2'>
              <Shield className='h-5 w-5 text-muted-foreground mt-0.5' />
              <div>
                <h4 className='text-sm font-semibold mb-1'>
                  About Policy Inheritance
                </h4>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>
                    <Badge variant='secondary' className='mr-2'>
                      Inherit
                    </Badge>
                    Use environment's default configuration
                  </li>
                  <li>
                    <Badge variant='default' className='mr-2'>
                      Override
                    </Badge>
                    Use API-specific configuration
                  </li>
                  <li>
                    <Badge variant='default' className='mr-2'>
                      Add
                    </Badge>
                    API-specific policy (not in environment)
                  </li>
                  <li>
                    <Badge variant='destructive' className='mr-2'>
                      Disable
                    </Badge>
                    Skip this environment policy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
