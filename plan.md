# FlowC Console - Frontend Implementation Plan

**Strategy:** Build frontend-first with hardcoded mock data, then integrate backend APIs later.

**Architecture:** Option C - Hybrid Approach with functional grouping.

---

## Architecture Overview

### FlowC Unique Value Proposition

FlowC differentiates from other Envoy-based gateways (kgateway, Envoy Gateway) by providing **per-API policy customization with custom ordering**. This is achieved through a dedicated **Policy Engine** that runs alongside Envoy via `ext_proc`.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FlowC Control Plane                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐  │
│  │   API       │    │  Policy     │    │  xDS Server             │  │
│  │   Registry  │    │  Registry   │    │  (Envoy + Policy Engine)│  │
│  └─────────────┘    └─────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │ xDS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Gateway Node                                │
│                                                                     │
│  ┌─────────────────────┐      gRPC       ┌────────────────────────┐ │
│  │    Envoy Proxy      │◄───ext_proc────►│  FlowC Policy Engine   │ │
│  │                     │                 │  (Rust)                │ │
│  │  - Routing          │                 │                        │ │
│  │  - TLS termination  │                 │  - JWT Validation      │ │
│  │  - Load balancing   │                 │  - Rate Limiting       │ │
│  │                     │                 │  - RBAC                │ │
│  │                     │                 │  - Request Transform   │ │
│  │                     │                 │  - Custom Policies     │ │
│  │                     │                 │  - WASM Runtime        │ │
│  └─────────────────────┘                 └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Entity Hierarchy

```
Gateway (physical Envoy proxy)
  └── Listener (port)
       └── Environment (virtual host + default policy chain)
            └── API (route + custom policy chain)  ← First-class entity!
                 └── Policy Chain (ordered list, per-API)
                      └── Policy Instance (type + config)

Deployment = API deployed to a specific Environment
```

### Policy Execution Model

- **Environment** defines a default filter chain order (inherited by all APIs)
- **API** can:
  - **Inherit** environment policies as-is
  - **Override** policy config (e.g., different rate limit)
  - **Disable** specific policies
  - **Add** additional policies
  - **Reorder** policies (via custom policy chain)

This enables per-API policy customization without environment proliferation.

---

## Progress Summary

**Completed Phases:**
- ✅ Phase 1: Core Infrastructure & Layout (All 4 sub-phases)
- ✅ Phase 2: Dashboard Page
- ✅ Phase 3.1: Gateways List Page
- ✅ Phase 3.2: Gateway Detail Page
- ✅ Phase 4.1: Listeners List Page
- ✅ Phase 5.1: Environments List Page
- ✅ Phase 5.2: Environment Detail Page
- ✅ Phase 6.1: Deployments List Page
- ✅ Phase 6.2: Deploy New API Flow (api-wizard - to be refactored)

**Current Status:** Refactoring to add APIs as first-class entity

**Completed Components:**
- Sidebar navigation with FlowC structure
- Mock data layer with 5 gateways, 12 listeners, 20 environments, 45 deployments, 8 policies
- Zod validation schemas for all entities
- Shared FlowC components (StatusBadge, RefreshButton, StatsCard, BreadcrumbNav, EmptyState)
- Dashboard with stats cards, gateway health table, recent deployments, and activity chart
- Gateways list page with full CRUD operations, expandable rows, filters, and pagination
- Gateways detail page with overview, listeners, APIs, policies, and configuration tabs
- Listeners list page with filters and CRUD operations
- Environments list page with filters and CRUD operations
- Environments detail page with overview, deployed APIs, and policies tabs
- Deployments list page with filters, detail view, policy manager, and delete functionality
- API Creation Wizard with OpenAPI upload and start-from-scratch flows

---

## Updated Data Models

### New: API Entity (First-Class)

```typescript
export interface API {
  id: string
  name: string
  version: string
  displayName: string
  description?: string
  context: string // Base path, e.g., "/orders"

  // Status
  status: 'draft' | 'ready' | 'deployed' | 'deprecated'

  // OpenAPI Spec
  spec?: {
    content: string // OpenAPI YAML/JSON content
    fileName: string
    parsedInfo?: {
      title: string
      version: string
      paths: string[]
      servers?: string[]
    }
  }

  // Upstream Configuration
  upstream: {
    host: string
    port: number
    scheme: 'http' | 'https'
    timeout: string
  }

  // Routing Strategy
  routing: {
    matchType: 'prefix' | 'exact' | 'regex'
    caseSensitive: boolean
    loadBalancing: 'round-robin' | 'random' | 'least-conn'
  }

  // Policy Chain (ordered, per-API)
  policyChain: PolicyInstance[]

  // Deployments (where this API is deployed)
  deployments: string[] // deployment IDs

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface PolicyInstance {
  id: string
  policyType: PolicyType
  order: number // Execution order (1-based)
  enabled: boolean

  // Inheritance mode (when deployed to environment)
  inheritanceMode: 'inherit' | 'override' | 'disable' | 'add'

  // Configuration
  config: Record<string, unknown>

  // For custom policies
  customPolicyId?: string // Reference to uploaded WASM/script
}

export type PolicyType =
  | 'rate-limit'
  | 'cors'
  | 'jwt-auth'
  | 'api-key'
  | 'rbac'
  | 'request-transform'
  | 'response-transform'
  | 'logging'
  | 'ip-filter'
  | 'custom'
```

### Updated: Deployment Entity

```typescript
export interface Deployment {
  id: string

  // API Reference
  apiId: string
  apiName: string
  apiVersion: string

  // Target
  gatewayId: string
  gatewayName: string
  port: number
  environmentName: string

  // Status
  status: 'active' | 'inactive' | 'error' | 'deploying' | 'rolling-back'

  // Policy Chain (resolved - includes inherited + overrides)
  resolvedPolicyChain: PolicyInstance[]

  // Metadata
  deployedAt: string
  deployedBy: string
  lastHealthCheck?: string
  healthStatus?: 'healthy' | 'degraded' | 'unhealthy'
}
```

### Updated: Environment Entity

```typescript
export interface Environment {
  name: string
  gatewayId: string
  gatewayName: string
  port: number
  hostname: string
  sni: string
  tlsConfig?: {
    certPath: string
    keyPath: string
  }

  // Default policies (inherited by APIs unless overridden)
  defaultPolicies: PolicyInstance[]

  // Default policy execution order
  policyOrder: PolicyType[]

  apiCount: number
  createdAt: string
}
```

---

## Phase 1: Core Infrastructure & Layout ✅ COMPLETED

(No changes - already complete)

---

## Phase 2: Dashboard Page ✅ COMPLETED

(No changes - already complete)

---

## Phase 3: Gateways Module ✅ COMPLETED

(No changes - already complete)

---

## Phase 4: Listeners Module ✅ COMPLETED

(No changes - already complete)

---

## Phase 5: Environments Module ✅ COMPLETED

(No changes - already complete)

---

## Phase 6: APIs Module (NEW - Primary Focus)

### 6.1 APIs List Page

**Route:** `src/routes/_authenticated/apis/index.tsx`

**File Structure:**
```
src/features/apis/
├── components/
│   ├── apis-table.tsx
│   ├── apis-columns.tsx
│   ├── api-delete-dialog.tsx
│   ├── data-table-row-actions.tsx
│   └── api-status-badge.tsx
├── data/
│   ├── schema.ts (API Zod schema)
│   └── constants.ts
├── apis.tsx
└── index.tsx
```

**Features:**
- Table columns: Name, Version, Status, Context, Deployments, Policies, Actions
- Filters: Status (draft/ready/deployed/deprecated)
- Search: By name or context
- Row actions: View Details, Edit, Deploy, Delete
- Status badges with colors (draft=gray, ready=blue, deployed=green, deprecated=yellow)
- Create API button → Navigate to wizard

**Tasks:**
- [ ] Create feature folder structure
- [ ] Add API to mock data layer
- [ ] Build table with TanStack Table
- [ ] Create delete dialog with confirmation
- [ ] Add route with URL state validation

---

### 6.2 Create API Wizard

**Route:** `src/routes/_authenticated/apis/new/index.tsx`

**Reuse/Refactor:** Existing `src/features/api-wizard/` implementation

The current wizard at `/deployments/new` should be refactored to `/apis/new` with the following changes:

**Current Flow (Deploy New API):**
```
Source Selection → Upload/Basics → API Info → Deploy Target → Upstream → Strategy → Review → DEPLOY
```

**New Flow (Create API):**
```
Source Selection → Upload/Basics → API Info → Upstream → Strategy → Policies → Review → SAVE AS DRAFT
```

**Key Changes:**
1. Remove "Deploy Target" step (moved to separate Deploy action)
2. Add "Policies" step (configure policy chain)
3. Change final action from "Deploy" to "Save" (creates API in draft state)
4. Navigate to API detail page after creation

**New Step: Policies Configuration**

```
┌─────────────────────────────────────────────────────────────────┐
│ Step: Configure Policies                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Policy Chain (drag to reorder)                   [+ Add Policy]│
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ≡ 1. Rate Limiting                            [Configure] │  │
│  │      Limit: 100 requests/minute                           │  │
│  │                                                           │  │
│  │ ≡ 2. JWT Authentication                       [Configure] │  │
│  │      Issuer: https://auth.example.com                     │  │
│  │                                                           │  │
│  │ ≡ 3. CORS                                     [Configure] │  │
│  │      Origins: *                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  💡 Policies execute in order from top to bottom               │
│     Drag to reorder. Add policies now or configure later.      │
│                                                                 │
│                              [Skip for Now]  [Back]  [Continue] │
└─────────────────────────────────────────────────────────────────┘
```

**File Structure Updates:**
```
src/features/api-wizard/
├── components/
│   ├── steps/
│   │   ├── ... (existing steps)
│   │   └── policies-config.tsx (NEW)
│   ├── policy-chain-editor.tsx (NEW - drag-drop reorder)
│   └── policy-config-dialog.tsx (NEW - per-policy config)
├── context/
│   └── wizard-context.tsx (UPDATE - add policies step)
└── data/
    └── schema.ts (UPDATE - add policies schema)
```

**Tasks:**
- [ ] Refactor wizard route from `/deployments/new` to `/apis/new`
- [ ] Remove deployment-target step from API creation wizard
- [ ] Add policies-config step
- [ ] Create policy-chain-editor component (drag-drop)
- [ ] Create policy-config-dialog for each policy type
- [ ] Update wizard context and schema
- [ ] Change final action to save API (not deploy)

---

### 6.3 API Detail Page

**Route:** `src/routes/_authenticated/apis/$apiId/index.tsx`

**File Structure:**
```
src/features/apis/detail/
├── components/
│   ├── api-overview.tsx
│   ├── api-policies-tab.tsx
│   ├── api-deployments-tab.tsx
│   ├── api-spec-tab.tsx
│   ├── api-settings-tab.tsx
│   └── deploy-api-dialog.tsx
└── index.tsx
```

**Tabs:**
1. **Overview** - API metadata, upstream config, routing
2. **Policies** - Policy chain editor (drag-drop reorder, configure)
3. **Deployments** - Where this API is deployed
4. **Spec** - OpenAPI spec viewer
5. **Settings** - Edit API metadata, danger zone (delete)

**Actions:**
- **Deploy** button → Opens deploy dialog
- **Edit** → Inline editing or edit mode

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ ← APIs / orders-api                                             │
│                                                                 │
│ orders-api v2.1.0                          [Edit] [Deploy ▼]   │
│ Order management API                                            │
│ Status: Ready  |  Context: /orders  |  3 Deployments           │
├─────────────────────────────────────────────────────────────────┤
│ [Overview] [Policies] [Deployments] [Spec] [Settings]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  (Tab content here)                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Tasks:**
- [ ] Create detail page route with tabs
- [ ] Build overview tab with metadata display
- [ ] Build policies tab with drag-drop chain editor
- [ ] Build deployments tab showing deployment history
- [ ] Build spec tab with OpenAPI viewer
- [ ] Build settings tab with edit form
- [ ] Create deploy dialog

---

### 6.4 Deploy API Dialog

**Location:** `src/features/apis/detail/components/deploy-api-dialog.tsx`

**Simplified deployment flow** (API is already configured):

```
┌─────────────────────────────────────────────────────────────────┐
│ Deploy API: orders-api                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Target Environment                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Gateway:     [gateway-us-east-1 ▼]                          ││
│  │ Listener:    [443 (HTTPS) ▼]                                ││
│  │ Environment: [production ▼]                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Policy Inheritance                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Environment default policies:                               ││
│  │   ✓ Rate Limiting (100/min) - Will be OVERRIDDEN (1000/min)││
│  │   ✓ CORS (*.example.com) - Will INHERIT                    ││
│  │   ✓ Logging (info) - Will be DISABLED                      ││
│  │                                                             ││
│  │ API-specific policies (will be ADDED):                      ││
│  │   + JWT Authentication                                      ││
│  │   + RBAC                                                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Final Policy Chain (execution order):                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 1. Rate Limiting (1000/min) [override]                      ││
│  │ 2. CORS (*.example.com) [inherit]                           ││
│  │ 3. JWT Authentication [add]                                 ││
│  │ 4. RBAC [add]                                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                                        [Cancel]  [Deploy]       │
└─────────────────────────────────────────────────────────────────┘
```

**Tasks:**
- [ ] Create deploy dialog component
- [ ] Add cascading gateway/listener/environment selectors
- [ ] Show policy inheritance preview
- [ ] Show resolved policy chain
- [ ] Mock deploy action

---

## Phase 7: Deployments Module (Refactored)

### 7.1 Deployments List Page ✅ (Mostly Complete - Minor Updates)

**Updates needed:**
- Add link to source API (apiId → API detail page)
- Show resolved policy chain in detail view
- Add "Redeploy" action

**Tasks:**
- [ ] Add API name as link to API detail page
- [ ] Update detail dialog to show resolved policies
- [ ] Add redeploy action

---

### 7.2 Deployment Detail View

**Updates to existing detail dialog:**
- Show source API link
- Show resolved policy chain (with inheritance indicators)
- Show health status

---

## Phase 8: Mediation Policies Module

### 8.1 Policies List Page

**Route:** `src/routes/_authenticated/policies/index.tsx`

**File Structure:**
```
src/features/policies/
├── components/
│   ├── policies-table.tsx
│   ├── policies-columns.tsx
│   ├── policy-create-dialog.tsx
│   ├── policy-edit-dialog.tsx
│   ├── policy-delete-dialog.tsx
│   └── policy-config-editor.tsx
└── index.tsx
```

**Features:**
- Table columns: Name, Type, Description, Used By (APIs count), Status, Actions
- Filters: Type (rate-limit, cors, jwt-auth, etc.)
- Search: By name
- Create policy dialog with type selection
- Dynamic config editor based on policy type

**Policy Types & Configs:**

| Type | Config Fields |
|------|---------------|
| `rate-limit` | requestsPerMinute, burstSize, keyType (ip/header/user) |
| `cors` | allowedOrigins[], allowedMethods[], allowedHeaders[], maxAge |
| `jwt-auth` | issuer, audience, publicKeyUrl, headerName |
| `api-key` | headerName, queryParam, validKeys[] |
| `rbac` | rules[] (path, methods, roles) |
| `request-transform` | addHeaders, removeHeaders, bodyTransform |
| `response-transform` | addHeaders, removeHeaders, bodyTransform |
| `logging` | logLevel, logHeaders, logBody, destinations[] |
| `ip-filter` | allowList[], denyList[], defaultAction |

**Tasks:**
- [ ] Build policies table
- [ ] Create policy type selector
- [ ] Build dynamic config editor for each policy type
- [ ] Create CRUD dialogs
- [ ] Show which APIs use each policy

---

### 8.2 Policy Templates (Optional Enhancement)

Pre-configured policy chains for common use cases:

- **Public API** - Rate limit + CORS (strict)
- **Authenticated API** - JWT Auth + Rate limit + CORS
- **Internal API** - IP filter + Logging
- **Premium API** - JWT Auth + RBAC + High rate limit

---

## Phase 9: Validation Tool

**Route:** `src/routes/_authenticated/validate/index.tsx`

(No changes from original plan)

---

## Phase 10: Admin Tools

(No changes from original plan)

---

## Phase 11: Polish & Enhancements

(No changes from original plan)

---

## Updated Implementation Order

### Week 1: APIs Module (Core)
- [ ] Phase 6.1: APIs List Page
- [ ] Phase 6.2: Refactor Create API Wizard (add policies step)
- [ ] Phase 6.3: API Detail Page
- [ ] Phase 6.4: Deploy API Dialog
- [ ] Update mock data with API entity

### Week 2: Policies & Deployments
- [ ] Phase 7.1: Update Deployments List (link to APIs)
- [ ] Phase 8.1: Policies List Page
- [ ] Policy chain editor component (reusable)
- [ ] Policy config dialogs for each type

### Week 3: Operations & Admin
- [ ] Phase 9.1: Validation tool
- [ ] Phase 10.1: Config inspector
- [ ] Phase 10.2: Metrics & stats
- [ ] Phase 10.3: Health monitor

### Week 4: Polish
- [ ] Phase 11: Polish & enhancements
- [ ] End-to-end testing
- [ ] Documentation

---

## Updated Navigation Structure

```typescript
{
  navGroups: [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/', icon: LayoutDashboard }
      ]
    },
    {
      title: 'API Management',  // NEW GROUP
      items: [
        { title: 'APIs', url: '/apis', icon: Layers },          // NEW
        { title: 'Create API', url: '/apis/new', icon: Plus },  // MOVED
        { title: 'Deployments', url: '/deployments', icon: Rocket }
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { title: 'Gateways', url: '/gateways', icon: Server },
        { title: 'Listeners', url: '/listeners', icon: Radio },
        { title: 'Environments', url: '/environments', icon: Globe }
      ]
    },
    {
      title: 'Policies & Rules',
      items: [
        { title: 'Mediation Policies', url: '/policies', icon: Shield }
      ]
    },
    {
      title: 'Tools',
      items: [
        { title: 'Validate Config', url: '/validate', icon: CheckCircle }
      ]
    },
    {
      title: 'Admin',
      items: [
        { title: 'Config Inspector', url: '/admin/config', icon: Code },
        { title: 'Metrics & Stats', url: '/admin/metrics', icon: BarChart },
        { title: 'Health Monitor', url: '/admin/health', icon: Activity }
      ]
    }
  ]
}
```

---

## Key Components to Build

### Policy Chain Editor (Reusable)

Used in:
- Create API Wizard (policies step)
- API Detail Page (policies tab)
- Environment Detail Page (default policies)

```typescript
interface PolicyChainEditorProps {
  policies: PolicyInstance[]
  onChange: (policies: PolicyInstance[]) => void
  availablePolicies: PolicyType[]
  readonly?: boolean
  showInheritance?: boolean // Show inherit/override/disable options
}
```

Features:
- Drag-and-drop reordering (@dnd-kit/core)
- Add policy button with type selector
- Per-policy config dialog
- Enable/disable toggle
- Remove button
- Inheritance mode selector (when deploying)

### Policy Config Dialog (Per-Type)

Dynamic form based on policy type:

```typescript
interface PolicyConfigDialogProps {
  policyType: PolicyType
  config: Record<string, unknown>
  onSave: (config: Record<string, unknown>) => void
  onCancel: () => void
}
```

Use Zod schemas for validation per policy type.

---

## Files to Create/Modify Summary

### New Files
- `src/features/apis/` - Entire APIs feature module
- `src/features/api-wizard/components/steps/policies-config.tsx`
- `src/features/api-wizard/components/policy-chain-editor.tsx`
- `src/features/api-wizard/components/policy-config-dialog.tsx`
- `src/routes/_authenticated/apis/` - API routes
- `src/data/mock/flowc-data.ts` - Add mockAPIs array

### Modified Files
- `src/features/api-wizard/context/wizard-context.tsx` - Add policies step
- `src/features/api-wizard/data/schema.ts` - Add policies schema
- `src/features/api-wizard/data/constants.ts` - Update step sequences
- `src/components/layout/data/sidebar-data.ts` - Update navigation
- `src/features/deployments/` - Add link to source API

---

## Technical Decisions

### State Management
- **Tables:** useTableUrlState (URL sync)
- **Forms:** React Hook Form + Zod
- **Policy Chain:** Local state with onChange callback
- **Drag-Drop:** @dnd-kit/core and @dnd-kit/sortable

### Component Patterns
- Policy chain editor is a controlled component
- Policy config uses dialog pattern (not inline editing)
- Deploy dialog is a multi-step form in a dialog

### Mock Data Strategy
- Add `mockAPIs` array to flowc-data.ts
- APIs reference deployments by ID
- Deployments reference APIs by ID (apiId field)

---

## Success Criteria

**APIs Module:**
- [ ] Can create API from OpenAPI spec
- [ ] Can create API from scratch
- [ ] Can configure policy chain with drag-drop ordering
- [ ] Can deploy API to environment
- [ ] Can view API details with all tabs
- [ ] Can edit API configuration
- [ ] Can delete API

**Policy Integration:**
- [ ] Policy chain respects order
- [ ] Can add/remove policies from chain
- [ ] Can configure each policy type
- [ ] Inheritance preview shows correctly in deploy dialog

**Overall:**
- [ ] All routes accessible via sidebar
- [ ] Navigation updated with APIs group
- [ ] No TypeScript errors
- [ ] No console errors

---

## Notes

- The existing api-wizard implementation provides a solid foundation
- Main work is adding policies step and refactoring deploy flow
- Policy chain editor is the most complex new component
- Consider using @dnd-kit for drag-drop (already used in shadcn examples)
- Deploy dialog is simpler than the full wizard since API is pre-configured

---

**Next Step:** Start with Phase 6.1 (APIs List Page) and update mock data.
