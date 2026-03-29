import type { APIResponse } from '@/lib/api/openapi/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AlertTriangle, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface APISettingsTabProps {
  api: APIResponse
}

const settingsFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'ready', 'deployed', 'deprecated']),
  context: z
    .string()
    .regex(
      /^\/[a-z0-9-/]*$/,
      'Context must start with / and contain only lowercase letters, numbers, hyphens, and slashes'
    ),
  upstreamHost: z.string().min(1, 'Host is required'),
  upstreamPort: z.number().int().min(1).max(65535),
  upstreamScheme: z.enum(['http', 'https']),
  upstreamTimeout: z
    .string()
    .regex(/^\d+[smh]$/, 'Timeout must be in format like 30s, 5m, 1h'),
  matchType: z.enum(['prefix', 'exact', 'regex']),
  caseSensitive: z.boolean(),
  loadBalancing: z.enum(['round-robin', 'random', 'least-conn']),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function APISettingsTab({ api }: APISettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      displayName: api.spec.displayName || '',
      description: api.spec.description || '',
      status: (api.status?.phase || 'draft') as 'draft' | 'ready' | 'deployed' | 'deprecated',
      context: api.spec.context,
      upstreamHost: api.spec.upstream.host,
      upstreamPort: api.spec.upstream.port,
      upstreamScheme: (api.spec.upstream.scheme || 'http') as 'http' | 'https',
      upstreamTimeout: api.spec.upstream.timeout || '30s',
      matchType: (api.spec.routing?.matchType || 'prefix') as 'prefix' | 'exact' | 'regex',
      caseSensitive: api.spec.routing?.caseSensitive ?? true,
      loadBalancing: (api.spec.routing?.loadBalancing || 'round-robin') as 'round-robin' | 'random' | 'least-conn',
    },
  })

  function onSubmit(values: SettingsFormValues) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Saving settings:', values)
      setIsSaving(false)
    }, 1000)
  }

  const handleDelete = () => {
    console.log('Deleting API:', api.metadata.name)
    // Navigate to APIs list after deletion
  }

  return (
    <div className='space-y-6'>
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Update API metadata and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Basic Info */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Basic Information</h3>

                <FormField
                  control={form.control}
                  name='displayName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='draft'>Draft</SelectItem>
                            <SelectItem value='ready'>Ready</SelectItem>
                            <SelectItem value='deployed'>Deployed</SelectItem>
                            <SelectItem value='deprecated'>
                              Deprecated
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='context'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Context Path</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Base path for this API (e.g., /users)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Upstream Config */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  Upstream Configuration
                </h3>

                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='upstreamHost'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='upstreamPort'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='upstreamScheme'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheme</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='http'>HTTP</SelectItem>
                            <SelectItem value='https'>HTTPS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='upstreamTimeout'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeout</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='30s' />
                        </FormControl>
                        <FormDescription>
                          Format: 30s, 5m, 1h
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Routing Config */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  Routing Configuration
                </h3>

                <div className='grid gap-4 md:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='matchType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Match Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='prefix'>Prefix</SelectItem>
                            <SelectItem value='exact'>Exact</SelectItem>
                            <SelectItem value='regex'>Regex</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='loadBalancing'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Load Balancing</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='round-robin'>
                              Round Robin
                            </SelectItem>
                            <SelectItem value='random'>Random</SelectItem>
                            <SelectItem value='least-conn'>
                              Least Connections
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='caseSensitive'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Sensitive</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === 'true')
                          }
                          defaultValue={field.value ? 'true' : 'false'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='true'>Yes</SelectItem>
                            <SelectItem value='false'>No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex justify-end'>
                <Button type='submit' disabled={isSaving}>
                  <Save className='mr-2 h-4 w-4' />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='h-5 w-5' />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-semibold'>Delete this API</h4>
              <p className='text-sm text-muted-foreground'>
                Once deleted, this API and all its deployments will be removed
                permanently.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete API
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the <strong>{api.spec.displayName || api.metadata.name}</strong> API and remove all
                    associated deployments.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  >
                    Delete API
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
