import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STEP_LABELS, type WizardStep } from '../data/constants'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: WizardStep[]
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  return (
    <div className='w-full px-4 py-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='flex items-center justify-between'>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const stepNumber = index + 1

            return (
              <React.Fragment key={step}>
                <div className='flex flex-col items-center'>
                  {/* Step circle */}
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      {
                        'border-primary bg-primary text-primary-foreground':
                          isCompleted || isCurrent,
                        'border-muted bg-muted text-muted-foreground':
                          !isCompleted && !isCurrent,
                        'ring-4 ring-primary/20': isCurrent,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className='h-5 w-5' />
                    ) : (
                      <span className='text-sm font-semibold'>
                        {stepNumber}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium hidden sm:block text-center max-w-20',
                      {
                        'text-primary': isCurrent,
                        'text-muted-foreground': !isCurrent,
                      }
                    )}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>

                {/* Connecting line */}
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 mx-2 transition-all',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
