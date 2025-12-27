import React, { createContext, useContext, useState, useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  apiWizardFormSchema,
  type ApiWizardFormData,
  step0Schema,
  step1ASchema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from '../data/schema'
import {
  DEFAULT_API_INFO,
  DEFAULT_DEPLOYMENT_TARGET,
  DEFAULT_UPSTREAM_CONFIG,
  DEFAULT_STRATEGY_OPTIONS,
  OPENAPI_FLOW_STEPS,
  SCRATCH_FLOW_STEPS,
  type WizardStep,
} from '../data/constants'

interface WizardContextValue {
  // Form state (React Hook Form)
  form: UseFormReturn<ApiWizardFormData>

  // Step navigation
  currentStep: WizardStep
  stepIndex: number
  totalSteps: number
  steps: WizardStep[]
  goToStep: (step: WizardStep) => void
  goNext: () => Promise<void>
  goBack: () => void
  canGoBack: boolean
  canGoNext: boolean

  // Flow type
  isOpenApiFlow: boolean

  // Step validation
  isCurrentStepValid: () => Promise<boolean>

  // Deployment
  isDeploying: boolean
  deployError: string | null
  deploy: () => Promise<void>

  // Generated output
  generatedYaml: string | null
  generatedZip: Blob | null
}

const WizardContext = createContext<WizardContextValue | null>(null)

const defaultValues: Partial<ApiWizardFormData> = {
  sourceType: undefined,
  openApiFile: undefined,
  apiInfo: DEFAULT_API_INFO,
  deploymentTarget: DEFAULT_DEPLOYMENT_TARGET,
  upstream: DEFAULT_UPSTREAM_CONFIG,
  strategy: DEFAULT_STRATEGY_OPTIONS,
}

export function ApiWizardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] =
    useState<WizardStep>('source-selection')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployError, setDeployError] = useState<string | null>(null)
  const [generatedYaml] = useState<string | null>(null)
  const [generatedZip] = useState<Blob | null>(null)

  const form = useForm<ApiWizardFormData>({
    resolver: zodResolver(apiWizardFormSchema) as any,
    defaultValues,
  })

  const sourceType = form.watch('sourceType')
  const isOpenApiFlow = sourceType === 'openapi'

  // Step sequence based on flow type
  const steps = useMemo(() => {
    if (!sourceType) return ['source-selection'] as WizardStep[]
    return isOpenApiFlow ? OPENAPI_FLOW_STEPS : SCRATCH_FLOW_STEPS
  }, [isOpenApiFlow, sourceType])

  const stepIndex = steps.indexOf(currentStep)
  const totalSteps = steps.length
  const canGoBack = stepIndex > 0
  const canGoNext = stepIndex < totalSteps - 1

  // Validate current step
  const isCurrentStepValid = async (): Promise<boolean> => {
    let isValid = false

    try {
      switch (currentStep) {
        case 'source-selection':
          await step0Schema.parseAsync({
            sourceType: form.getValues('sourceType'),
          })
          isValid = true
          break
        case 'openapi-upload':
          await step1ASchema.parseAsync({
            openApiFile: form.getValues('openApiFile'),
          })
          isValid = true
          break
        case 'api-basics':
        case 'api-info':
          await step2Schema.parseAsync({
            apiInfo: form.getValues('apiInfo'),
          })
          isValid = true
          break
        case 'deployment-target':
          await step3Schema.parseAsync({
            deploymentTarget: form.getValues('deploymentTarget'),
          })
          isValid = true
          break
        case 'upstream-config':
          await step4Schema.parseAsync({
            upstream: form.getValues('upstream'),
          })
          isValid = true
          break
        case 'strategy-options':
          await step5Schema.parseAsync({
            strategy: form.getValues('strategy'),
          })
          isValid = true
          break
        case 'review-deploy':
          isValid = true
          break
        default:
          isValid = false
      }
    } catch (error) {
      isValid = false
    }

    return isValid
  }

  // Navigate to next step
  const goNext = async () => {
    const valid = await isCurrentStepValid()
    if (!valid) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    if (canGoNext) {
      setCurrentStep(steps[stepIndex + 1])
    }
  }

  // Navigate to previous step
  const goBack = () => {
    if (canGoBack) {
      setCurrentStep(steps[stepIndex - 1])
    }
  }

  // Go to specific step
  const goToStep = (step: WizardStep) => {
    if (steps.includes(step)) {
      setCurrentStep(step)
    }
  }

  // Deploy API
  const deploy = async () => {
    try {
      setIsDeploying(true)
      setDeployError(null)

      // Validate entire form
      const formData = form.getValues()
      await apiWizardFormSchema.parseAsync(formData)

      // TODO: Generate YAML and ZIP (implemented in later phases)
      // TODO: Call deployment API

      // Mock deployment for now
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success('API deployed successfully!')
      navigate({ to: '/deployments' })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Deployment failed'
      setDeployError(message)
      toast.error(message)
    } finally {
      setIsDeploying(false)
    }
  }

  const value: WizardContextValue = {
    form,
    currentStep,
    stepIndex,
    totalSteps,
    steps,
    goToStep,
    goNext,
    goBack,
    canGoBack,
    canGoNext,
    isOpenApiFlow,
    isCurrentStepValid,
    isDeploying,
    deployError,
    deploy,
    generatedYaml,
    generatedZip,
  }

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  )
}

export function useApiWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useApiWizard must be used within ApiWizardProvider')
  }
  return context
}
