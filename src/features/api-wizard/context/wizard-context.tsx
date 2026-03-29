import React, { createContext, useContext, useState, useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useUploadApiBundle } from '@/hooks/use-apis'
import {
  apiWizardFormSchema,
  type ApiWizardFormData,
  step0Schema,
  step1ASchema,
  step2Schema,
  step3Schema,
} from '../data/schema'
import {
  DEFAULT_API_INFO,
  DEFAULT_UPSTREAM_CONFIG,
  OPENAPI_FLOW_STEPS,
  SCRATCH_FLOW_STEPS,
  type WizardStep,
} from '../data/constants'
import { generateAPIBundle } from '../lib/yaml-generator'

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

  // Save API
  isSaving: boolean
  saveError: string | null
  saveAPI: () => Promise<void>

  // Generated output
  generatedYaml: string | null
  generatedZip: Blob | null
}

const WizardContext = createContext<WizardContextValue | null>(null)

const defaultValues: Partial<ApiWizardFormData> = {
  sourceType: 'openapi',
  openApiFile: undefined,
  apiInfo: DEFAULT_API_INFO,
  upstream: DEFAULT_UPSTREAM_CONFIG,
}

export function ApiWizardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const { mutateAsync: uploadBundle } = useUploadApiBundle()

  const [currentStep, setCurrentStep] =
    useState<WizardStep>('source-selection')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [generatedYaml, setGeneratedYaml] = useState<string | null>(null)
  const [generatedZip, setGeneratedZip] = useState<Blob | null>(null)

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
        case 'upstream-config':
          await step3Schema.parseAsync({
            upstream: form.getValues('upstream'),
          })
          isValid = true
          break
        case 'review-save':
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

  // Save API via ZIP bundle upload
  const saveAPI = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      // Validate entire form
      const formData = form.getValues()
      await apiWizardFormSchema.parseAsync(formData)

      // Generate YAML and ZIP bundle
      const { yaml, zip } = await generateAPIBundle(formData)
      setGeneratedYaml(yaml)
      setGeneratedZip(zip)

      // Upload ZIP bundle to the control plane
      const result = await uploadBundle(zip)

      // Find the created API name from the apply results
      const apiResult = result.results?.find(
        (r) => r.kind === 'API' && (r.action === 'created' || r.action === 'updated')
      )
      const apiName = apiResult?.name || formData.apiInfo.name

      // Navigate to the newly created API detail page
      navigate({ to: '/apis/$apiId', params: { apiId: apiName } })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create API'
      setSaveError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
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
    isSaving,
    saveError,
    saveAPI,
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
