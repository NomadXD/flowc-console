import React from 'react'
import { Card } from '@/components/ui/card'
import { StepIndicator } from './step-indicator'
import { WizardNavigation } from './wizard-navigation'
import { useApiWizard } from '../context/wizard-context'

interface WizardContainerProps {
  children: React.ReactNode
}

export function WizardContainer({ children }: WizardContainerProps) {
  const {
    stepIndex,
    totalSteps,
    steps,
    goNext,
    goBack,
    canGoBack,
    canGoNext,
    isSaving,
    saveAPI,
  } = useApiWizard()

  const isLastStep = stepIndex === totalSteps - 1

  const handleNext = async () => {
    if (isLastStep) {
      await saveAPI()
    } else {
      await goNext()
    }
  }

  return (
    <div className='container mx-auto py-8 max-w-5xl'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Create New API
        </h1>
        <p className='text-muted-foreground mt-2'>
          Configure your API and save it to the FlowC Gateway
        </p>
      </div>

      <StepIndicator
        currentStep={stepIndex}
        totalSteps={totalSteps}
        steps={steps}
      />

      <Card className='p-6 mt-8'>
        <div className='min-h-[400px]'>{children}</div>

        <WizardNavigation
          onBack={goBack}
          onNext={handleNext}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          isLoading={isSaving}
          isLastStep={isLastStep}
        />
      </Card>
    </div>
  )
}
