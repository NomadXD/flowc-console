import { ApiWizardProvider, useApiWizard } from './context/wizard-context'
import { WizardContainer } from './components/wizard-container'
import { SourceSelectionStep } from './components/steps/source-selection'
import { OpenApiUploadStep } from './components/steps/openapi-upload'
import { ApiBasicsStep } from './components/steps/api-basics'
import { ApiInfoStep } from './components/steps/api-info'
import { UpstreamConfigStep } from './components/steps/upstream-config'
import { StrategyOptionsStep } from './components/steps/strategy-options'
import { PoliciesConfigStep } from './components/steps/policies-config'
import { ReviewSaveStep } from './components/steps/review-save'

function WizardSteps() {
  const { currentStep } = useApiWizard()

  switch (currentStep) {
    case 'source-selection':
      return <SourceSelectionStep />
    case 'openapi-upload':
      return <OpenApiUploadStep />
    case 'api-basics':
      return <ApiBasicsStep />
    case 'api-info':
      return <ApiInfoStep />
    case 'upstream-config':
      return <UpstreamConfigStep />
    case 'strategy-options':
      return <StrategyOptionsStep />
    case 'policies-config':
      return <PoliciesConfigStep />
    case 'review-save':
      return <ReviewSaveStep />
    default:
      return <SourceSelectionStep />
  }
}

export function ApiWizard() {
  return (
    <ApiWizardProvider>
      <WizardContainer>
        <WizardSteps />
      </WizardContainer>
    </ApiWizardProvider>
  )
}
