import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WizardNavigationProps {
  onBack: () => void
  onNext: () => void
  canGoBack: boolean
  canGoNext: boolean
  isLoading?: boolean
  isLastStep: boolean
  nextLabel?: string
}

export function WizardNavigation({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLoading = false,
  isLastStep,
  nextLabel,
}: WizardNavigationProps) {
  return (
    <div className='flex justify-between pt-6 border-t'>
      <Button
        variant='outline'
        onClick={onBack}
        disabled={!canGoBack || isLoading}
      >
        Back
      </Button>
      <Button onClick={onNext} disabled={!canGoNext || isLoading}>
        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {nextLabel ?? (isLastStep ? 'Deploy API' : 'Next')}
      </Button>
    </div>
  )
}
