# Create & Deploy API Wizard - Implementation Plan

## Overview

Build a multi-step wizard for creating and deploying new APIs in the flowc-console. This is **Flow 1** - for users who want to create a new API from scratch or from an OpenAPI spec.

**Two Subflows:**
- **Subflow A:** User has OpenAPI spec file (upload, parse, pre-populate form)
- **Subflow B:** User starts from scratch (blank form, manual entry)

---

## Wizard Steps

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 0: Source Selection                                        │
│  ┌────────────────────┐  ┌────────────────────┐                 │
│  │  Upload OpenAPI    │  │  Start from        │                 │
│  │  Specification     │  │  Scratch           │                 │
│  └────────────────────┘  └────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
          │                           │
          ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│ Step 1A: Upload Spec │    │ Step 1B: API Basics  │
│ - Drag/drop zone     │    │ - Name, version      │
│ - Parse & preview    │    │ - Context path       │
└──────────────────────┘    └──────────────────────┘
          │                           │
          └───────────┬───────────────┘
                      ▼
         ┌──────────────────────┐
         │ Step 2: API Info     │
         │ (pre-filled for A)   │
         │ - Name, version      │
         │ - Context, desc      │
         └──────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │ Step 3: Deploy Target│
         │ - Gateway selector   │
         │ - Listener selector  │
         │ - Environment select │
         └──────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │ Step 4: Upstream     │
         │ - Host, port, scheme │
         │ - Timeout settings   │
         └──────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │ Step 5: Strategy     │
         │ - Route matching     │
         │ - Load balancing     │
         └──────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │ Step 6: Review       │
         │ - Summary cards      │
         │ - YAML preview       │
         │ - Deploy button      │
         └──────────────────────┘
```

---

## File Structure

```
src/features/api-wizard/
├── index.tsx                    # Feature export
├── api-wizard.tsx               # Main wizard container
├── components/
│   ├── wizard-container.tsx     # Layout wrapper with step indicator
│   ├── wizard-navigation.tsx    # Back/Next buttons
│   ├── step-indicator.tsx       # Visual progress indicator
│   ├── file-upload-zone.tsx     # Drag-and-drop file upload
│   ├── cascading-selector.tsx   # Gateway>Listener>Env dropdowns
│   ├── yaml-preview.tsx         # Code block for YAML preview
│   └── steps/
│       ├── source-selection.tsx  # Step 0
│       ├── openapi-upload.tsx    # Step 1A
│       ├── api-basics.tsx        # Step 1B
│       ├── api-info.tsx          # Step 2
│       ├── deployment-target.tsx # Step 3
│       ├── upstream-config.tsx   # Step 4
│       ├── strategy-options.tsx  # Step 5
│       └── review-deploy.tsx     # Step 6
├── context/
│   └── wizard-context.tsx       # Wizard state (form + navigation)
├── hooks/
│   ├── use-openapi-parser.ts    # Parse uploaded spec
│   ├── use-cascading-selectors.ts # Filter logic
│   └── use-yaml-generator.ts    # Generate flowc.yaml
├── lib/
│   ├── openapi-parser.ts        # OpenAPI parsing utilities
│   ├── yaml-generator.ts        # YAML generation
│   └── zip-bundler.ts           # JSZip integration
└── data/
    ├── schema.ts                # Zod schemas
    └── constants.ts             # Default values
```

**Route:**
```
src/routes/_authenticated/deployments/new/index.tsx
```

---

## Dependencies to Add

```bash
pnpm add js-yaml jszip
pnpm add -D @types/js-yaml
```

---

## Implementation Phases

### Phase 1: Foundation (Core Infrastructure)
**Files to create:**
- `src/features/api-wizard/data/schema.ts` - Zod schemas
- `src/features/api-wizard/data/constants.ts` - Default values
- `src/features/api-wizard/context/wizard-context.tsx` - State management
- `src/features/api-wizard/components/wizard-container.tsx` - Layout
- `src/features/api-wizard/components/wizard-navigation.tsx` - Nav buttons
- `src/features/api-wizard/components/step-indicator.tsx` - Progress UI

### Phase 2: Entry & Upload Steps
**Files to create:**
- `src/features/api-wizard/components/steps/source-selection.tsx`
- `src/features/api-wizard/components/file-upload-zone.tsx`
- `src/features/api-wizard/hooks/use-openapi-parser.ts`
- `src/features/api-wizard/lib/openapi-parser.ts`
- `src/features/api-wizard/components/steps/openapi-upload.tsx`
- `src/features/api-wizard/components/steps/api-basics.tsx`

### Phase 3: Configuration Steps
**Files to create:**
- `src/features/api-wizard/components/steps/api-info.tsx`
- `src/features/api-wizard/hooks/use-cascading-selectors.ts`
- `src/features/api-wizard/components/cascading-selector.tsx`
- `src/features/api-wizard/components/steps/deployment-target.tsx`
- `src/features/api-wizard/components/steps/upstream-config.tsx`
- `src/features/api-wizard/components/steps/strategy-options.tsx`

### Phase 4: Review & Deploy
**Files to create:**
- `src/features/api-wizard/lib/yaml-generator.ts`
- `src/features/api-wizard/lib/zip-bundler.ts`
- `src/features/api-wizard/hooks/use-yaml-generator.ts`
- `src/features/api-wizard/components/yaml-preview.tsx`
- `src/features/api-wizard/components/steps/review-deploy.tsx`

### Phase 5: Integration
**Files to create/modify:**
- `src/features/api-wizard/api-wizard.tsx` - Main component
- `src/features/api-wizard/index.tsx` - Feature export
- `src/routes/_authenticated/deployments/new/index.tsx` - Route
- `src/components/layout/data/sidebar-data.ts` - Add nav item (already has "Deploy New API")

---

## Key Schemas

```typescript
// Core form schema
const apiWizardFormSchema = z.object({
  sourceType: z.enum(['openapi', 'scratch']),
  openApiFile: z.object({...}).optional(),
  apiInfo: z.object({
    name: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    context: z.string().regex(/^\/[a-z0-9-/]*$/),
    description: z.string().max(500).optional(),
  }),
  deploymentTarget: z.object({
    gatewayId: z.string().min(1),
    port: z.number().int().min(1).max(65535),
    environmentName: z.string().min(1),
  }),
  upstream: z.object({
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535),
    scheme: z.enum(['http', 'https']),
    timeout: z.string().regex(/^\d+[smh]$/),
  }),
  strategy: z.object({
    routeMatching: z.object({
      type: z.enum(['prefix', 'exact', 'regex']),
      caseSensitive: z.boolean(),
    }),
    loadBalancing: z.object({
      type: z.enum(['round-robin', 'random']),
    }),
  }),
})
```

---

## State Management

Single React Context with:
- `useForm<ApiWizardFormData>` for form state across all steps
- `currentStep` for navigation state
- Step-specific validation before proceeding
- Step sequence computed based on `sourceType`

---

## Key Reference Files

| Pattern | File |
|---------|------|
| Form with Zod | `src/features/listeners/components/listener-action-dialog.tsx` |
| SelectDropdown | `src/components/select-dropdown.tsx` |
| Context Provider | `src/features/deployments/components/deployments-provider.tsx` |
| Mock Data | `src/data/mock/flowc-data.ts` |
| Schemas | `src/data/schemas/flowc-schemas.ts` |

---

## Generated flowc.yaml Structure

```yaml
name: "api-name"
version: "1.0.0"
description: "API description"
context: "/api-context"

gateway:
  gateway_id: "gateway-us-east-1"
  port: 443
  environment: "production"
  virtual_host:
    domains: ["api.example.com"]

upstream:
  host: "backend.example.com"
  port: 443
  scheme: "https"
  timeout: "30s"

strategy:
  deployment:
    type: "basic"
  route_matching:
    type: "prefix"
    case_sensitive: true
  load_balancing:
    type: "round-robin"
```

---

## Notes

- For **Subflow B** (scratch), generate a minimal OpenAPI spec with `/*` catch-all route
- ZIP created client-side using JSZip before sending to backend
- Sidebar already has "Deploy New API" pointing to `/deployments/new`
- Uses full page layout (not dialog) for better wizard UX
