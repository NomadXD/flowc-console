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
import { Textarea } from '@/components/ui/textarea'
import { useApiWizard } from '../../context/wizard-context'

export function ApiBasicsStep() {
  const { form } = useApiWizard()

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          API Information
        </h2>
        <p className='text-muted-foreground mt-2'>
          Enter the basic details for your API
        </p>
      </div>

      <Form {...form}>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='apiInfo.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='my-api'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Lowercase letters, numbers, and hyphens only (used internally)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='apiInfo.displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='My API'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Human-readable name shown in the UI
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='apiInfo.version'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input
                    placeholder='1.0.0'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Semantic version format (e.g., 1.0.0)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='apiInfo.context'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Context Path</FormLabel>
                <FormControl>
                  <Input
                    placeholder='/api/v1'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The base path for your API (must start with /)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='apiInfo.description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className='text-muted-foreground'>(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='A brief description of your API'
                    className='resize-none'
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description of your API's purpose
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  )
}
