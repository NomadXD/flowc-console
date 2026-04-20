'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Loader2 } from 'lucide-react'
import { z } from 'zod'
import type {
  GatewayProfileResponse,
  GatewayResponse,
  ListenerPreset,
} from '@/lib/api/openapi/types'
import { useGatewayProfiles } from '@/hooks/use-gateway-profiles'
import { usePutGateway } from '@/hooks/use-gateways'
import { usePutListener } from '@/hooks/use-listeners'
import { usePutVirtualHost } from '@/hooks/use-virtual-hosts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const gatewayFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  nodeId: z.string().min(1, 'Node ID is required'),
  profileRef: z.string().optional(),
})

type GatewayForm = z.infer<typeof gatewayFormSchema>

type GatewayActionDialogProps = {
  currentRow?: GatewayResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

const profileTypeColors: Record<string, string> = {
  edge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  mediation:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  egress:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ai: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  sidecar: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

export function GatewayActionDialog({
  currentRow,
  open,
  onOpenChange,
}: GatewayActionDialogProps) {
  const isEdit = !!currentRow
  const { mutate: putGateway, isPending: isGatewayPending } = usePutGateway()
  const { mutate: putListener } = usePutListener()
  const { mutate: putVirtualHost } = usePutVirtualHost()
  const { data: profilesData, isLoading: profilesLoading } =
    useGatewayProfiles()

  const navigate = useNavigate()
  const profiles = profilesData?.items || []

  const [createDefaultListener, setCreateDefaultListener] = useState(!isEdit)
  const [createDefaultEnvironment, setCreateDefaultEnvironment] =
    useState(!isEdit)

  const form = useForm<GatewayForm>({
    resolver: zodResolver(gatewayFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.metadata.name,
          nodeId: currentRow.spec.nodeId,
          profileRef: currentRow.spec.profileRef || '',
        }
      : {
          name: '',
          nodeId: '',
          profileRef: '',
        },
  })

  const selectedProfileRef = form.watch('profileRef')
  const gatewayName = form.watch('name')

  const selectedProfile = profiles.find(
    (p: GatewayProfileResponse) => p.metadata.name === selectedProfileRef
  )
  const listenerPresets = selectedProfile?.spec?.listenerPresets || []

  // Reset default checkboxes when profile changes
  useEffect(() => {
    if (!isEdit && selectedProfileRef) {
      setCreateDefaultListener(true)
      setCreateDefaultEnvironment(true)
    }
    if (!selectedProfileRef) {
      setCreateDefaultListener(false)
      setCreateDefaultEnvironment(false)
    }
  }, [selectedProfileRef, isEdit])

  const onSubmit = (values: GatewayForm) => {
    putGateway(
      {
        name: values.name,
        body: {
          spec: {
            nodeId: values.nodeId,
            profileRef: values.profileRef || undefined,
          },
        },
        ifMatch: isEdit ? currentRow.metadata.revision : undefined,
      },
      {
        onSuccess: () => {
          // Create default listener from the first preset if requested
          if (
            !isEdit &&
            createDefaultListener &&
            listenerPresets.length > 0
          ) {
            const preset = listenerPresets[0]
            const listenerName = `${values.name}-${preset.name}`

            putListener(
              {
                name: listenerName,
                body: {
                  spec: {
                    gatewayRef: values.name,
                    port: preset.port,
                    address: preset.address || '0.0.0.0',
                    http2: preset.http2,
                    tls: preset.tls,
                  },
                },
              },
              {
                onSuccess: () => {
                  // Create default virtual host if requested
                  if (createDefaultEnvironment) {
                    const vhostName = `${values.name}-default`
                    putVirtualHost({
                      name: vhostName,
                      body: {
                        spec: {
                          gatewayRef: values.name,
                          listenerRef: listenerName,
                          hostname: '*',
                        },
                      },
                    })
                  }
                },
              }
            )
          } else if (
            !isEdit &&
            createDefaultEnvironment &&
            !createDefaultListener
          ) {
            // Create environment without listener preset — needs a listener ref
            // Skip if no listener is being created
          }

          form.reset()
          onOpenChange(false)

          // Navigate to setup tab after creating a new gateway
          if (!isEdit) {
            navigate({
              to: '/gateways/$gatewayId',
              params: { gatewayId: values.name },
              search: { tab: 'setup' },
            })
          }
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        setCreateDefaultListener(!isEdit)
        setCreateDefaultEnvironment(!isEdit)
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Gateway' : 'Create New Gateway'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the gateway configuration.'
              : 'Configure a new gateway instance. Select a profile to apply preset configurations.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='gateway-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 px-0.5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='gateway-us-east-1'
                      className='col-span-4'
                      autoComplete='off'
                      disabled={isEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                  <FormDescription className='col-span-4 col-start-3 text-xs'>
                    {isEdit
                      ? 'Name cannot be changed after creation'
                      : 'Lowercase letters, numbers, and hyphens only'}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nodeId'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Node ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='node-12345'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='profileRef'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Gateway Profile
                  </FormLabel>
                  <div className='col-span-4'>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue
                            placeholder={
                              profilesLoading
                                ? 'Loading profiles...'
                                : 'Select a profile (optional)'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {profiles.map((profile: GatewayProfileResponse) => (
                          <SelectItem
                            key={profile.metadata.name}
                            value={profile.metadata.name}
                          >
                            <div className='flex items-center gap-2'>
                              <span>{profile.spec.displayName}</span>
                              <Badge
                                variant='secondary'
                                className={`text-[10px] ${profileTypeColors[profile.spec.profileType] || ''}`}
                              >
                                {profile.spec.profileType}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormDescription className='col-span-4 col-start-3 text-xs'>
                    Profile defines default listeners, filters, and strategy
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Profile preview section */}
            {selectedProfile && !isEdit && (
              <>
                <Separator />

                <div className='space-y-3'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <Info className='h-4 w-4 text-muted-foreground' />
                    Profile defaults
                  </div>

                  {selectedProfile.spec.description && (
                    <p className='text-muted-foreground text-xs ps-6'>
                      {selectedProfile.spec.description}
                    </p>
                  )}

                  {/* Listener presets preview */}
                  {listenerPresets.length > 0 && (
                    <div className='rounded-md border bg-muted/30 p-3 ps-6'>
                      <p className='mb-2 text-xs font-medium'>
                        Listener presets
                      </p>
                      <div className='space-y-1'>
                        {listenerPresets.map(
                          (preset: ListenerPreset, index: number) => (
                            <div
                              key={index}
                              className='flex items-center gap-2 text-xs text-muted-foreground'
                            >
                              <span className='font-mono'>{preset.name}</span>
                              <span>:</span>
                              <span>
                                {preset.address || '0.0.0.0'}:{preset.port}
                              </span>
                              {preset.tls && (
                                <Badge
                                  variant='outline'
                                  className='text-[10px]'
                                >
                                  TLS
                                </Badge>
                              )}
                              {preset.http2 && (
                                <Badge
                                  variant='outline'
                                  className='text-[10px]'
                                >
                                  HTTP/2
                                </Badge>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Default resource creation options */}
                  {listenerPresets.length > 0 && (
                    <div className='space-y-3 ps-6'>
                      <div className='flex items-center gap-2'>
                        <Checkbox
                          id='createDefaultListener'
                          checked={createDefaultListener}
                          onCheckedChange={(checked) =>
                            setCreateDefaultListener(checked === true)
                          }
                        />
                        <label
                          htmlFor='createDefaultListener'
                          className='text-xs'
                        >
                          Create default listener from{' '}
                          <span className='font-mono'>
                            {listenerPresets[0].name}
                          </span>{' '}
                          preset
                        </label>
                      </div>

                      {createDefaultListener && (
                        <div className='flex items-center gap-2 ps-6'>
                          <Checkbox
                            id='createDefaultEnvironment'
                            checked={createDefaultEnvironment}
                            onCheckedChange={(checked) =>
                              setCreateDefaultEnvironment(checked === true)
                            }
                          />
                          <label
                            htmlFor='createDefaultEnvironment'
                            className='text-xs'
                          >
                            Create default virtual host{' '}
                            {gatewayName && (
                              <span className='font-mono text-muted-foreground'>
                                ({gatewayName}-default)
                              </span>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='gateway-form' disabled={isGatewayPending}>
            {isGatewayPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : isEdit ? (
              'Save changes'
            ) : (
              'Create Gateway'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
