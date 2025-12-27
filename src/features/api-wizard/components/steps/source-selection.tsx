import { FileCode, PenTool } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useApiWizard } from '../../context/wizard-context'

export function SourceSelectionStep() {
  const { form } = useApiWizard()
  const sourceType = form.watch('sourceType')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          How would you like to create your API?
        </h2>
        <p className='text-muted-foreground mt-2'>
          Choose a starting point for your API deployment
        </p>
      </div>

      <RadioGroup
        value={sourceType || ''}
        onValueChange={(value) => form.setValue('sourceType', value as any)}
        className='grid gap-4 md:grid-cols-2 pt-4'
      >
        <div>
          <RadioGroupItem
            value='openapi'
            id='openapi'
            className='peer sr-only'
          />
          <Label
            htmlFor='openapi'
            className={cn(
              'flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all',
              'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5'
            )}
          >
            <div className='rounded-full bg-primary/10 p-4 mb-4'>
              <FileCode className='h-8 w-8 text-primary' />
            </div>
            <div className='space-y-1 text-center'>
              <h3 className='font-semibold'>Upload OpenAPI Spec</h3>
              <p className='text-sm text-muted-foreground'>
                I have an existing OpenAPI specification file
              </p>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value='scratch'
            id='scratch'
            className='peer sr-only'
          />
          <Label
            htmlFor='scratch'
            className={cn(
              'flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all',
              'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5'
            )}
          >
            <div className='rounded-full bg-primary/10 p-4 mb-4'>
              <PenTool className='h-8 w-8 text-primary' />
            </div>
            <div className='space-y-1 text-center'>
              <h3 className='font-semibold'>Start from Scratch</h3>
              <p className='text-sm text-muted-foreground'>
                I'll enter the API details manually
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {sourceType && (
        <div className='pt-4 border-t'>
          <p className='text-sm text-muted-foreground'>
            {sourceType === 'openapi' ? (
              <>
                Next, you'll upload your OpenAPI specification file and we'll
                extract the API details for you.
              </>
            ) : (
              <>
                Next, you'll manually enter your API name, version, and
                backend configuration.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
