# FlowC Console - Backend API Integration Plan

**Version:** 1.0
**Date:** 2026-01-01
**Purpose:** Complete API specification for implementing FlowC Console backend endpoints

---

## Table of Contents

1. [Overview](#overview)
2. [Base Configuration](#base-configuration)
3. [Authentication & Authorization](#authentication--authorization)
4. [Common Response Patterns](#common-response-patterns)
5. [Error Handling](#error-handling)
6. [API Endpoints](#api-endpoints)
   - [APIs Management](#1-apis-management)
   - [Deployments Management](#2-deployments-management)
   - [Gateways Management](#3-gateways-management)
   - [Listeners Management](#4-listeners-management)
   - [Environments Management](#5-environments-management)
   - [Mediation Policies Management](#6-mediation-policies-management)
   - [Dashboard & Statistics](#7-dashboard--statistics)
7. [Data Models & Schemas](#data-models--schemas)
8. [Validation Rules](#validation-rules)
9. [Implementation Checklist](#implementation-checklist)

---

## Overview

The FlowC Console backend provides RESTful APIs for managing API Gateway configurations, deployments, policies, and infrastructure. This document specifies all endpoints, request/response schemas, and validation rules needed for full backend implementation.

### Technology Stack Assumptions

- **Protocol:** REST over HTTPS
- **Data Format:** JSON
- **Authentication:** JWT Bearer tokens
- **Validation:** Schema-based validation (compatible with Zod schemas)

---

## Base Configuration

```
Base URL: https://api.flowc.example.com/v1
Content-Type: application/json
Accept: application/json
```

### Common Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Request-ID: <uuid> (optional, for request tracing)
```

---

## Authentication & Authorization

### Authentication Method

All API requests require a valid JWT token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Payload

```json
{
  "sub": "user@example.com",
  "name": "John Doe",
  "email": "user@example.com",
  "roles": ["admin", "developer"],
  "iat": 1704067200,
  "exp": 1704153600
}
```

### Permissions

- **admin:** Full access to all operations
- **developer:** Read/write access to APIs, deployments
- **viewer:** Read-only access

---

## Common Response Patterns

### Success Response (Single Resource)

```json
{
  "data": {
    "id": "api-001",
    "name": "user-service",
    // ... resource fields
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

### Success Response (Collection)

```json
{
  "data": [
    { "id": "api-001", "name": "user-service" },
    { "id": "api-002", "name": "auth-service" }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

### Pagination Query Parameters

```
?page=1          # Page number (1-based)
?pageSize=10     # Items per page (default: 10, max: 100)
?sortBy=name     # Sort field
?sortOrder=asc   # Sort direction (asc|desc)
```

### Filtering Query Parameters

```
?status=active             # Filter by status
?gatewayId=gw-us-east-1   # Filter by gateway
?search=user               # Search in name/description
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "name",
        "message": "Name must be at least 2 characters"
      }
    ],
    "timestamp": "2026-01-01T12:00:00Z",
    "requestId": "req-12345"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists, constraint violation |
| 422 | Unprocessable Entity | Semantic validation error |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request data validation failed |
| `NOT_FOUND` | Resource not found |
| `ALREADY_EXISTS` | Resource with identifier already exists |
| `UNAUTHORIZED` | Authentication required or failed |
| `FORBIDDEN` | Insufficient permissions |
| `CONFLICT` | Operation conflicts with current state |
| `INTERNAL_ERROR` | Unexpected server error |

---

## API Endpoints

## 1. APIs Management

### 1.1 List APIs

**Endpoint:** `GET /apis`

**Description:** Retrieve a list of all APIs with optional filtering and pagination.

**Query Parameters:**
```
?page=1
?pageSize=10
?status=draft|ready|deployed|deprecated
?search=user
?sortBy=name|createdAt|updatedAt
?sortOrder=asc|desc
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "api-001",
      "name": "user-service",
      "version": "v2.1.0",
      "displayName": "User Service API",
      "description": "User management and authentication service",
      "context": "/users",
      "status": "deployed",
      "upstream": {
        "host": "user-service.internal",
        "port": 8080,
        "scheme": "http",
        "timeout": "30s"
      },
      "routing": {
        "matchType": "prefix",
        "caseSensitive": true,
        "loadBalancing": "round-robin"
      },
      "policyChain": [
        {
          "id": "pol-inst-001",
          "policyType": "rate-limit",
          "order": 1,
          "enabled": true,
          "inheritanceMode": "override",
          "config": {
            "requestsPerMinute": 1000,
            "burstSize": 100
          }
        }
      ],
      "deployments": ["dep-001"],
      "createdAt": "2024-11-15T10:00:00Z",
      "updatedAt": "2025-01-20T10:30:00Z",
      "createdBy": "admin@example.com"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 1.2 Get API by ID

**Endpoint:** `GET /apis/{apiId}`

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Response:** `200 OK`

```json
{
  "data": {
    "id": "api-001",
    "name": "user-service",
    "version": "v2.1.0",
    "displayName": "User Service API",
    "description": "User management and authentication service",
    "context": "/users",
    "status": "deployed",
    "spec": {
      "content": "openapi: 3.0.0\ninfo:\n  title: User Service API\n  version: v2.1.0\n...",
      "fileName": "user-service-openapi.yaml",
      "parsedInfo": {
        "title": "User Service API",
        "version": "v2.1.0",
        "paths": ["/users", "/users/{id}", "/users/profile"],
        "servers": ["https://api.example.com"]
      }
    },
    "upstream": {
      "host": "user-service.internal",
      "port": 8080,
      "scheme": "http",
      "timeout": "30s"
    },
    "routing": {
      "matchType": "prefix",
      "caseSensitive": true,
      "loadBalancing": "round-robin"
    },
    "policyChain": [
      {
        "id": "pol-inst-001",
        "policyType": "rate-limit",
        "order": 1,
        "enabled": true,
        "inheritanceMode": "override",
        "config": {
          "requestsPerMinute": 1000,
          "burstSize": 100
        }
      },
      {
        "id": "pol-inst-002",
        "policyType": "jwt-auth",
        "order": 2,
        "enabled": true,
        "inheritanceMode": "add",
        "config": {
          "issuer": "https://auth.example.com",
          "audience": "user-service"
        }
      }
    ],
    "deployments": ["dep-001"],
    "createdAt": "2024-11-15T10:00:00Z",
    "updatedAt": "2025-01-20T10:30:00Z",
    "createdBy": "admin@example.com"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - API not found

---

### 1.3 Create API

**Endpoint:** `POST /apis`

**Description:** Create a new API in draft status.

**Request Body:**

```json
{
  "name": "order-service",
  "version": "v1.0.0",
  "displayName": "Order Service API",
  "description": "Order management and processing service",
  "context": "/orders",
  "status": "draft",
  "spec": {
    "content": "openapi: 3.0.0\n...",
    "fileName": "order-service-openapi.yaml",
    "parsedInfo": {
      "title": "Order Service API",
      "version": "v1.0.0",
      "paths": ["/orders", "/orders/{id}"],
      "servers": ["https://api.example.com"]
    }
  },
  "upstream": {
    "host": "order-service.internal",
    "port": 8080,
    "scheme": "http",
    "timeout": "30s"
  },
  "routing": {
    "matchType": "prefix",
    "caseSensitive": true,
    "loadBalancing": "round-robin"
  },
  "policyChain": [],
  "createdBy": "admin@example.com"
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "api-011",
    "name": "order-service",
    "version": "v1.0.0",
    "displayName": "Order Service API",
    "description": "Order management and processing service",
    "context": "/orders",
    "status": "draft",
    "spec": {
      "content": "openapi: 3.0.0\n...",
      "fileName": "order-service-openapi.yaml",
      "parsedInfo": {
        "title": "Order Service API",
        "version": "v1.0.0",
        "paths": ["/orders", "/orders/{id}"],
        "servers": ["https://api.example.com"]
      }
    },
    "upstream": {
      "host": "order-service.internal",
      "port": 8080,
      "scheme": "http",
      "timeout": "30s"
    },
    "routing": {
      "matchType": "prefix",
      "caseSensitive": true,
      "loadBalancing": "round-robin"
    },
    "policyChain": [],
    "deployments": [],
    "createdAt": "2026-01-01T12:00:00Z",
    "updatedAt": "2026-01-01T12:00:00Z",
    "createdBy": "admin@example.com"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Validation Rules:**
- `name`: 2-100 chars, lowercase letters, numbers, hyphens only
- `version`: Format vX.Y.Z or X.Y.Z (e.g., v1.0.0 or 1.0.0)
- `context`: Must start with /, lowercase letters, numbers, hyphens, slashes only
- `upstream.host`: Valid hostname or IP address
- `upstream.port`: 1-65535
- `upstream.timeout`: Format: 30s, 5m, 1h

**Error Responses:**
- `400 Bad Request` - Validation error
- `409 Conflict` - API with same name and version already exists

---

### 1.4 Update API

**Endpoint:** `PUT /apis/{apiId}`

**Description:** Update an existing API. All fields are optional.

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Request Body:**

```json
{
  "displayName": "User Service API v2",
  "description": "Updated description",
  "upstream": {
    "host": "user-service-v2.internal",
    "port": 8080,
    "scheme": "https",
    "timeout": "60s"
  },
  "policyChain": [
    {
      "id": "pol-inst-001",
      "policyType": "rate-limit",
      "order": 1,
      "enabled": true,
      "inheritanceMode": "override",
      "config": {
        "requestsPerMinute": 2000,
        "burstSize": 200
      }
    }
  ]
}
```

**Response:** `200 OK`

```json
{
  "data": {
    "id": "api-001",
    "name": "user-service",
    "version": "v2.1.0",
    "displayName": "User Service API v2",
    "description": "Updated description",
    // ... updated fields
    "updatedAt": "2026-01-01T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - API not found
- `400 Bad Request` - Validation error

---

### 1.5 Delete API

**Endpoint:** `DELETE /apis/{apiId}`

**Description:** Delete an API. Cannot delete if API has active deployments.

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - API not found
- `409 Conflict` - API has active deployments

---

### 1.6 Update API Status

**Endpoint:** `PATCH /apis/{apiId}/status`

**Description:** Change API status (draft → ready → deployed → deprecated).

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Request Body:**

```json
{
  "status": "ready"
}
```

**Response:** `200 OK`

```json
{
  "data": {
    "id": "api-001",
    "status": "ready",
    "updatedAt": "2026-01-01T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Valid Status Transitions:**
- `draft` → `ready`
- `ready` → `deployed` (automatically set on first deployment)
- `deployed` → `deprecated`

**Error Responses:**
- `404 Not Found` - API not found
- `400 Bad Request` - Invalid status transition

---

### 1.7 Get API Policy Chain

**Endpoint:** `GET /apis/{apiId}/policies`

**Description:** Get the ordered policy chain for an API.

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "pol-inst-001",
      "policyType": "rate-limit",
      "order": 1,
      "enabled": true,
      "inheritanceMode": "override",
      "config": {
        "requestsPerMinute": 1000,
        "burstSize": 100
      }
    },
    {
      "id": "pol-inst-002",
      "policyType": "jwt-auth",
      "order": 2,
      "enabled": true,
      "inheritanceMode": "add",
      "config": {
        "issuer": "https://auth.example.com",
        "audience": "user-service"
      }
    }
  ],
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 1.8 Update API Policy Chain

**Endpoint:** `PUT /apis/{apiId}/policies`

**Description:** Replace the entire policy chain for an API.

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Request Body:**

```json
{
  "policyChain": [
    {
      "id": "pol-inst-001",
      "policyType": "rate-limit",
      "order": 1,
      "enabled": true,
      "inheritanceMode": "override",
      "config": {
        "requestsPerMinute": 2000,
        "burstSize": 200
      }
    },
    {
      "id": "pol-inst-002",
      "policyType": "jwt-auth",
      "order": 2,
      "enabled": true,
      "inheritanceMode": "add",
      "config": {
        "issuer": "https://auth.example.com",
        "audience": "user-service"
      }
    }
  ]
}
```

**Response:** `200 OK`

```json
{
  "data": {
    "policyChain": [
      {
        "id": "pol-inst-001",
        "policyType": "rate-limit",
        "order": 1,
        "enabled": true,
        "inheritanceMode": "override",
        "config": {
          "requestsPerMinute": 2000,
          "burstSize": 200
        }
      },
      {
        "id": "pol-inst-002",
        "policyType": "jwt-auth",
        "order": 2,
        "enabled": true,
        "inheritanceMode": "add",
        "config": {
          "issuer": "https://auth.example.com",
          "audience": "user-service"
        }
      }
    ],
    "updatedAt": "2026-01-01T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 1.9 Get API Deployments

**Endpoint:** `GET /apis/{apiId}/deployments`

**Description:** Get all deployments for a specific API.

**Path Parameters:**
- `apiId` (string, required) - API identifier

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "dep-001",
      "apiName": "user-service",
      "version": "v2.1.0",
      "gatewayId": "gw-us-east-1",
      "gatewayName": "gateway-us-east-1",
      "port": 443,
      "environment": "production",
      "status": "active",
      "deployedAt": "2025-01-20T10:30:00Z",
      "deployedBy": "admin@example.com",
      "specFile": "user-service-openapi.yaml",
      "enabledPolicies": ["pol-rate-limit-prod", "pol-jwt-auth"]
    }
  ],
  "meta": {
    "total": 1,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

## 2. Deployments Management

### 2.1 List Deployments

**Endpoint:** `GET /deployments`

**Query Parameters:**
```
?page=1
?pageSize=10
?status=active|inactive|error|deploying
?gatewayId=gw-us-east-1
?environment=production
?search=user
?sortBy=deployedAt|apiName
?sortOrder=asc|desc
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "dep-001",
      "apiName": "user-service",
      "version": "v2.1.0",
      "gatewayId": "gw-us-east-1",
      "gatewayName": "gateway-us-east-1",
      "port": 443,
      "environment": "production",
      "status": "active",
      "deployedAt": "2025-01-20T10:30:00Z",
      "deployedBy": "admin@example.com",
      "specFile": "user-service-openapi.yaml",
      "enabledPolicies": ["pol-rate-limit-prod", "pol-jwt-auth"]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 2.2 Get Deployment by ID

**Endpoint:** `GET /deployments/{deploymentId}`

**Path Parameters:**
- `deploymentId` (string, required) - Deployment identifier

**Response:** `200 OK`

```json
{
  "data": {
    "id": "dep-001",
    "apiId": "api-001",
    "apiName": "user-service",
    "version": "v2.1.0",
    "gatewayId": "gw-us-east-1",
    "gatewayName": "gateway-us-east-1",
    "port": 443,
    "environment": "production",
    "status": "active",
    "deployedAt": "2025-01-20T10:30:00Z",
    "deployedBy": "admin@example.com",
    "specFile": "user-service-openapi.yaml",
    "enabledPolicies": ["pol-rate-limit-prod", "pol-jwt-auth"],
    "resolvedPolicyChain": [
      {
        "id": "pol-inst-001",
        "policyType": "rate-limit",
        "order": 1,
        "enabled": true,
        "inheritanceMode": "override",
        "config": {
          "requestsPerMinute": 1000,
          "burstSize": 100
        },
        "source": "api"
      },
      {
        "id": "pol-inst-002",
        "policyType": "jwt-auth",
        "order": 2,
        "enabled": true,
        "inheritanceMode": "add",
        "config": {
          "issuer": "https://auth.example.com",
          "audience": "user-service"
        },
        "source": "api"
      }
    ],
    "healthStatus": "healthy",
    "lastHealthCheck": "2026-01-01T11:55:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 2.3 Deploy API

**Endpoint:** `POST /deployments`

**Description:** Deploy an API to a specific environment on a gateway.

**Request Body:**

```json
{
  "apiId": "api-001",
  "gatewayId": "gw-us-east-1",
  "port": 443,
  "environment": "production",
  "deployedBy": "admin@example.com"
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "dep-011",
    "apiId": "api-001",
    "apiName": "user-service",
    "version": "v2.1.0",
    "gatewayId": "gw-us-east-1",
    "gatewayName": "gateway-us-east-1",
    "port": 443,
    "environment": "production",
    "status": "deploying",
    "deployedAt": "2026-01-01T12:00:00Z",
    "deployedBy": "admin@example.com",
    "specFile": "user-service-openapi.yaml",
    "enabledPolicies": []
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Validation Rules:**
- API must exist and be in `ready` or `deployed` status
- Gateway, listener (port), and environment must exist
- Cannot deploy same API version to same environment twice

**Error Responses:**
- `404 Not Found` - API, gateway, or environment not found
- `409 Conflict` - API already deployed to this environment
- `400 Bad Request` - API not in deployable status

---

### 2.4 Update Deployment Status

**Endpoint:** `PATCH /deployments/{deploymentId}/status`

**Path Parameters:**
- `deploymentId` (string, required) - Deployment identifier

**Request Body:**

```json
{
  "status": "active"
}
```

**Response:** `200 OK`

```json
{
  "data": {
    "id": "dep-001",
    "status": "active",
    "lastHealthCheck": "2026-01-01T12:00:00Z",
    "healthStatus": "healthy"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 2.5 Delete Deployment

**Endpoint:** `DELETE /deployments/{deploymentId}`

**Description:** Undeploy an API from an environment.

**Path Parameters:**
- `deploymentId` (string, required) - Deployment identifier

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Deployment not found

---

### 2.6 Get Deployment Statistics

**Endpoint:** `GET /deployments/stats`

**Response:** `200 OK`

```json
{
  "data": {
    "totalDeployments": 45,
    "activeDeployments": 38,
    "failedDeployments": 2,
    "deploymentsToday": 3,
    "deploymentsThisWeek": 12,
    "deploymentsByEnvironment": [
      { "env": "production", "count": 30 },
      { "env": "staging", "count": 8 },
      { "env": "development", "count": 4 }
    ],
    "deploymentsByGateway": [
      { "gateway": "gateway-us-east-1", "count": 20 },
      { "gateway": "gateway-us-west-2", "count": 12 }
    ],
    "recentActivity": [
      { "timestamp": "2025-01-15T00:00:00Z", "count": 2 },
      { "timestamp": "2025-01-16T00:00:00Z", "count": 3 }
    ]
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

## 3. Gateways Management

### 3.1 List Gateways

**Endpoint:** `GET /gateways`

**Query Parameters:**
```
?page=1
?pageSize=10
?status=online|offline|degraded
?region=us-east-1
?sortBy=name|createdAt
?sortOrder=asc|desc
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "gw-us-east-1",
      "nodeId": "node-12345",
      "name": "gateway-us-east-1",
      "status": "online",
      "region": "us-east-1",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:22:00Z",
      "listenerCount": 3,
      "apiCount": 28,
      "version": "1.29.0",
      "ipAddress": "10.0.1.100"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 3.2 Get Gateway by ID

**Endpoint:** `GET /gateways/{gatewayId}`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier

**Response:** `200 OK`

```json
{
  "data": {
    "id": "gw-us-east-1",
    "nodeId": "node-12345",
    "name": "gateway-us-east-1",
    "status": "online",
    "region": "us-east-1",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2025-01-20T14:22:00Z",
    "listenerCount": 3,
    "apiCount": 28,
    "version": "1.29.0",
    "ipAddress": "10.0.1.100"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 3.3 Create Gateway

**Endpoint:** `POST /gateways`

**Request Body:**

```json
{
  "nodeId": "node-67890",
  "name": "gateway-eu-west-1",
  "status": "offline",
  "region": "eu-west-1",
  "version": "1.29.0",
  "ipAddress": "10.0.5.100"
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "gw-eu-west-1",
    "nodeId": "node-67890",
    "name": "gateway-eu-west-1",
    "status": "offline",
    "region": "eu-west-1",
    "createdAt": "2026-01-01T12:00:00Z",
    "updatedAt": "2026-01-01T12:00:00Z",
    "listenerCount": 0,
    "apiCount": 0,
    "version": "1.29.0",
    "ipAddress": "10.0.5.100"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Validation Rules:**
- `name`: 2-50 chars, lowercase letters, numbers, hyphens only
- `version`: Format X.Y.Z (e.g., 1.29.0)
- `ipAddress`: Valid IPv4 address

---

### 3.4 Update Gateway

**Endpoint:** `PUT /gateways/{gatewayId}`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier

**Request Body:** (all fields optional)

```json
{
  "status": "online",
  "version": "1.30.0"
}
```

**Response:** `200 OK`

---

### 3.5 Delete Gateway

**Endpoint:** `DELETE /gateways/{gatewayId}`

**Description:** Delete a gateway. Cannot delete if gateway has listeners.

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier

**Response:** `204 No Content`

**Error Responses:**
- `409 Conflict` - Gateway has active listeners

---

## 4. Listeners Management

### 4.1 List Listeners

**Endpoint:** `GET /listeners`

**Query Parameters:**
```
?gatewayId=gw-us-east-1
?protocol=HTTP|HTTPS|TCP
?page=1
?pageSize=10
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "port": 443,
      "protocol": "HTTPS",
      "gatewayId": "gw-us-east-1",
      "gatewayName": "gateway-us-east-1",
      "tlsEnabled": true,
      "environmentCount": 3,
      "apiCount": 20,
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 4.2 Get Listener

**Endpoint:** `GET /gateways/{gatewayId}/listeners/{port}`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port

**Response:** `200 OK`

```json
{
  "data": {
    "port": 443,
    "protocol": "HTTPS",
    "gatewayId": "gw-us-east-1",
    "gatewayName": "gateway-us-east-1",
    "tlsEnabled": true,
    "environmentCount": 3,
    "apiCount": 20,
    "createdAt": "2024-01-15T10:35:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 4.3 Create Listener

**Endpoint:** `POST /gateways/{gatewayId}/listeners`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier

**Request Body:**

```json
{
  "port": 8443,
  "protocol": "HTTPS",
  "tlsEnabled": true
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "port": 8443,
    "protocol": "HTTPS",
    "gatewayId": "gw-us-east-1",
    "gatewayName": "gateway-us-east-1",
    "tlsEnabled": true,
    "environmentCount": 0,
    "apiCount": 0,
    "createdAt": "2026-01-01T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Validation Rules:**
- `port`: 1-65535, must be unique per gateway
- `protocol`: HTTP, HTTPS, or TCP
- `tlsEnabled`: Required true for HTTPS

**Error Responses:**
- `409 Conflict` - Port already in use on this gateway

---

### 4.4 Update Listener

**Endpoint:** `PUT /gateways/{gatewayId}/listeners/{port}`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port

**Request Body:**

```json
{
  "protocol": "HTTPS",
  "tlsEnabled": true
}
```

**Response:** `200 OK`

---

### 4.5 Delete Listener

**Endpoint:** `DELETE /gateways/{gatewayId}/listeners/{port}`

**Description:** Delete a listener. Cannot delete if listener has environments.

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port

**Response:** `204 No Content`

**Error Responses:**
- `409 Conflict` - Listener has active environments

---

## 5. Environments Management

### 5.1 List Environments

**Endpoint:** `GET /environments`

**Query Parameters:**
```
?gatewayId=gw-us-east-1
?port=443
?name=production
?page=1
?pageSize=10
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "name": "production",
      "gatewayId": "gw-us-east-1",
      "gatewayName": "gateway-us-east-1",
      "port": 443,
      "hostname": "api.example.com",
      "sni": "api.example.com",
      "tlsConfig": {
        "certPath": "/etc/certs/api.example.com.crt",
        "keyPath": "/etc/certs/api.example.com.key"
      },
      "apiCount": 12,
      "policies": ["pol-rate-limit-prod", "pol-cors-main", "pol-jwt-auth"],
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 5.2 Get Environment

**Endpoint:** `GET /gateways/{gatewayId}/listeners/{port}/environments/{name}`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port
- `name` (string, required) - Environment name

**Response:** `200 OK`

```json
{
  "data": {
    "name": "production",
    "gatewayId": "gw-us-east-1",
    "gatewayName": "gateway-us-east-1",
    "port": 443,
    "hostname": "api.example.com",
    "sni": "api.example.com",
    "tlsConfig": {
      "certPath": "/etc/certs/api.example.com.crt",
      "keyPath": "/etc/certs/api.example.com.key"
    },
    "apiCount": 12,
    "policies": ["pol-rate-limit-prod", "pol-cors-main", "pol-jwt-auth"],
    "defaultPolicyChain": [
      {
        "id": "pol-inst-env-001",
        "policyType": "rate-limit",
        "order": 1,
        "enabled": true,
        "config": {
          "requestsPerMinute": 1000,
          "burstSize": 100
        }
      }
    ],
    "createdAt": "2024-01-15T11:00:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 5.3 Create Environment

**Endpoint:** `POST /gateways/{gatewayId}/listeners/{port}/environments`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port

**Request Body:**

```json
{
  "name": "staging",
  "hostname": "staging.example.com",
  "sni": "staging.example.com",
  "tlsConfig": {
    "certPath": "/etc/certs/staging.example.com.crt",
    "keyPath": "/etc/certs/staging.example.com.key"
  },
  "policies": ["pol-logging-verbose"]
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "name": "staging",
    "gatewayId": "gw-us-east-1",
    "gatewayName": "gateway-us-east-1",
    "port": 443,
    "hostname": "staging.example.com",
    "sni": "staging.example.com",
    "tlsConfig": {
      "certPath": "/etc/certs/staging.example.com.crt",
      "keyPath": "/etc/certs/staging.example.com.key"
    },
    "apiCount": 0,
    "policies": ["pol-logging-verbose"],
    "createdAt": "2026-01-01T12:00:00Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Validation Rules:**
- `name`: 1-50 chars, lowercase letters, numbers, hyphens only
- `hostname`: Valid hostname
- `tlsConfig`: Required if listener has TLS enabled

**Error Responses:**
- `409 Conflict` - Environment with same name already exists on this listener

---

### 5.4 Update Environment

**Endpoint:** `PUT /gateways/{gatewayId}/listeners/{port}/environments/{name}`

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port
- `name` (string, required) - Environment name

**Request Body:**

```json
{
  "hostname": "new-staging.example.com",
  "sni": "new-staging.example.com",
  "policies": ["pol-logging-verbose", "pol-rate-limit-staging"]
}
```

**Response:** `200 OK`

---

### 5.5 Delete Environment

**Endpoint:** `DELETE /gateways/{gatewayId}/listeners/{port}/environments/{name}`

**Description:** Delete an environment. Cannot delete if environment has active deployments.

**Path Parameters:**
- `gatewayId` (string, required) - Gateway identifier
- `port` (number, required) - Listener port
- `name` (string, required) - Environment name

**Response:** `204 No Content`

**Error Responses:**
- `409 Conflict` - Environment has active deployments

---

## 6. Mediation Policies Management

### 6.1 List Policies

**Endpoint:** `GET /policies`

**Query Parameters:**
```
?type=rate-limit|cors|jwt-auth|...
?attachedTo=gateway|environment
?enabled=true|false
?page=1
?pageSize=10
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "pol-rate-limit-prod",
      "name": "Production Rate Limit",
      "type": "rate-limit",
      "description": "Rate limit for production environments - 1000 req/min",
      "attachedTo": "gateway",
      "attachedToId": "gw-us-east-1",
      "attachedToName": "gateway-us-east-1",
      "config": {
        "requestsPerMinute": 1000,
        "burstSize": 100
      },
      "appliedToApis": 12,
      "createdAt": "2024-01-15T12:00:00Z",
      "enabled": true
    }
  ],
  "meta": {
    "total": 8,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 6.2 Get Policy by ID

**Endpoint:** `GET /policies/{policyId}`

**Path Parameters:**
- `policyId` (string, required) - Policy identifier

**Response:** `200 OK`

```json
{
  "data": {
    "id": "pol-rate-limit-prod",
    "name": "Production Rate Limit",
    "type": "rate-limit",
    "description": "Rate limit for production environments - 1000 req/min",
    "attachedTo": "gateway",
    "attachedToId": "gw-us-east-1",
    "attachedToName": "gateway-us-east-1",
    "config": {
      "requestsPerMinute": 1000,
      "burstSize": 100
    },
    "appliedToApis": 12,
    "createdAt": "2024-01-15T12:00:00Z",
    "enabled": true
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 6.3 Create Policy

**Endpoint:** `POST /policies`

**Request Body:**

```json
{
  "name": "Staging Rate Limit",
  "type": "rate-limit",
  "description": "Rate limit for staging environments - 500 req/min",
  "attachedTo": "environment",
  "attachedToId": "gw-us-east-1-443-staging",
  "config": {
    "requestsPerMinute": 500,
    "burstSize": 50
  },
  "enabled": true
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "pol-rate-limit-staging",
    "name": "Staging Rate Limit",
    "type": "rate-limit",
    "description": "Rate limit for staging environments - 500 req/min",
    "attachedTo": "environment",
    "attachedToId": "gw-us-east-1-443-staging",
    "attachedToName": "staging (gateway-us-east-1:443)",
    "config": {
      "requestsPerMinute": 500,
      "burstSize": 50
    },
    "appliedToApis": 0,
    "createdAt": "2026-01-01T12:00:00Z",
    "enabled": true
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

**Policy Type Specific Configs:**

**Rate Limit:**
```json
{
  "type": "rate-limit",
  "config": {
    "requestsPerMinute": 1000,
    "burstSize": 100
  }
}
```

**CORS:**
```json
{
  "type": "cors",
  "config": {
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "maxAge": 3600
  }
}
```

**JWT Auth:**
```json
{
  "type": "jwt-auth",
  "config": {
    "issuer": "https://auth.example.com",
    "audience": "api.example.com",
    "publicKeyUrl": "https://auth.example.com/.well-known/jwks.json"
  }
}
```

**Request Transform:**
```json
{
  "type": "request-transform",
  "config": {
    "addHeaders": {
      "X-Gateway-Region": "us-west-2",
      "X-Environment": "production"
    },
    "removeHeaders": ["X-Debug-Token"]
  }
}
```

**Response Transform:**
```json
{
  "type": "response-transform",
  "config": {
    "addHeaders": {
      "X-API-Version": "v2.0"
    },
    "removeHeaders": ["X-Internal-Server", "X-Debug-Info"]
  }
}
```

**Logging:**
```json
{
  "type": "logging",
  "config": {
    "logLevel": "debug",
    "logHeaders": true,
    "logBody": true,
    "destinations": ["stdout", "file:/var/log/flowc/staging.log"]
  }
}
```

---

### 6.4 Update Policy

**Endpoint:** `PUT /policies/{policyId}`

**Path Parameters:**
- `policyId` (string, required) - Policy identifier

**Request Body:**

```json
{
  "name": "Updated Rate Limit",
  "config": {
    "requestsPerMinute": 2000,
    "burstSize": 200
  },
  "enabled": true
}
```

**Response:** `200 OK`

---

### 6.5 Delete Policy

**Endpoint:** `DELETE /policies/{policyId}`

**Description:** Delete a policy. Cannot delete if policy is referenced by any APIs.

**Path Parameters:**
- `policyId` (string, required) - Policy identifier

**Response:** `204 No Content`

**Error Responses:**
- `409 Conflict` - Policy is in use by APIs

---

## 7. Dashboard & Statistics

### 7.1 Get Dashboard Stats

**Endpoint:** `GET /dashboard/stats`

**Response:** `200 OK`

```json
{
  "data": {
    "gateways": {
      "total": 5,
      "online": 4,
      "offline": 1,
      "degraded": 0
    },
    "apis": {
      "total": 10,
      "draft": 1,
      "ready": 1,
      "deployed": 7,
      "deprecated": 1
    },
    "deployments": {
      "total": 45,
      "active": 38,
      "inactive": 5,
      "error": 2,
      "deploying": 0
    },
    "policies": {
      "total": 8,
      "enabled": 7,
      "disabled": 1
    }
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

### 7.2 Get Recent Activity

**Endpoint:** `GET /dashboard/activity`

**Query Parameters:**
```
?days=7    # Number of days (default: 7)
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "timestamp": "2026-01-01T11:30:00Z",
      "type": "deployment",
      "action": "created",
      "user": "admin@example.com",
      "resource": "user-service v2.1.0",
      "description": "Deployed user-service v2.1.0 to production"
    },
    {
      "timestamp": "2026-01-01T10:15:00Z",
      "type": "api",
      "action": "updated",
      "user": "developer@example.com",
      "resource": "auth-service",
      "description": "Updated policy chain for auth-service"
    }
  ],
  "meta": {
    "total": 25,
    "timestamp": "2026-01-01T12:00:00Z"
  }
}
```

---

## Data Models & Schemas

### API Entity

```typescript
{
  id: string                          // Auto-generated UUID
  name: string                        // 2-100 chars, lowercase, alphanumeric + hyphens
  version: string                     // Format: vX.Y.Z or X.Y.Z
  displayName: string                 // Human-readable name
  description?: string                // Optional, max 500 chars
  context: string                     // Base path, e.g., "/users"
  status: 'draft' | 'ready' | 'deployed' | 'deprecated'

  spec?: {
    content: string                   // OpenAPI YAML/JSON content
    fileName: string
    parsedInfo?: {
      title: string
      version: string
      paths: string[]
      servers?: string[]
    }
  }

  upstream: {
    host: string                      // Hostname or IP
    port: number                      // 1-65535
    scheme: 'http' | 'https'
    timeout: string                   // Format: 30s, 5m, 1h
  }

  routing: {
    matchType: 'prefix' | 'exact' | 'regex'
    caseSensitive: boolean
    loadBalancing: 'round-robin' | 'random' | 'least-conn'
  }

  policyChain: PolicyInstance[]       // Ordered list
  deployments: string[]               // Deployment IDs

  createdAt: string                   // ISO 8601 datetime
  updatedAt: string                   // ISO 8601 datetime
  createdBy: string                   // User email
}
```

### Policy Instance

```typescript
{
  id: string                          // Auto-generated UUID
  policyType: 'rate-limit' | 'cors' | 'jwt-auth' | 'api-key' |
              'rbac' | 'request-transform' | 'response-transform' |
              'logging' | 'ip-filter' | 'custom'
  order: number                       // Execution order (1-based)
  enabled: boolean
  inheritanceMode: 'inherit' | 'override' | 'disable' | 'add'
  config: Record<string, unknown>     // Type-specific configuration
  customPolicyId?: string             // For custom WASM policies
}
```

### Deployment Entity

```typescript
{
  id: string                          // Auto-generated UUID
  apiId: string                       // Reference to API
  apiName: string
  version: string
  gatewayId: string
  gatewayName: string
  port: number
  environment: string
  status: 'active' | 'inactive' | 'error' | 'deploying'
  deployedAt: string                  // ISO 8601 datetime
  deployedBy: string                  // User email
  specFile: string
  enabledPolicies: string[]           // Policy IDs
  resolvedPolicyChain?: PolicyInstance[]  // Computed from API + environment
  healthStatus?: 'healthy' | 'degraded' | 'unhealthy'
  lastHealthCheck?: string            // ISO 8601 datetime
}
```

### Gateway Entity

```typescript
{
  id: string                          // Auto-generated UUID
  nodeId: string
  name: string                        // 2-50 chars, lowercase, alphanumeric + hyphens
  status: 'online' | 'offline' | 'degraded'
  region: string
  createdAt: string                   // ISO 8601 datetime
  updatedAt: string                   // ISO 8601 datetime
  listenerCount: number
  apiCount: number
  version: string                     // Format: X.Y.Z
  ipAddress: string                   // IPv4 address
}
```

### Listener Entity

```typescript
{
  port: number                        // 1-65535
  protocol: 'HTTP' | 'HTTPS' | 'TCP'
  gatewayId: string
  gatewayName: string
  tlsEnabled: boolean
  environmentCount: number
  apiCount: number
  createdAt: string                   // ISO 8601 datetime
}
```

### Environment Entity

```typescript
{
  name: string                        // 1-50 chars, lowercase, alphanumeric + hyphens
  gatewayId: string
  gatewayName: string
  port: number
  hostname: string
  sni: string
  tlsConfig?: {
    certPath: string
    keyPath: string
  }
  apiCount: number
  policies: string[]                  // Policy IDs
  defaultPolicyChain?: PolicyInstance[]
  createdAt: string                   // ISO 8601 datetime
}
```

### Mediation Policy Entity

```typescript
{
  id: string                          // Auto-generated UUID
  name: string                        // 2-100 chars
  type: 'rate-limit' | 'cors' | 'jwt-auth' | 'request-transform' |
        'response-transform' | 'logging'
  description: string                 // Max 500 chars
  attachedTo: 'gateway' | 'environment'
  attachedToId: string
  attachedToName: string
  config: Record<string, unknown>     // Type-specific configuration
  appliedToApis: number               // Count of APIs using this policy
  createdAt: string                   // ISO 8601 datetime
  enabled: boolean
}
```

---

## Validation Rules

### API Name Validation

```regex
^[a-z0-9-]+$
```
- 2-100 characters
- Lowercase letters, numbers, hyphens only
- No spaces, underscores, or special characters

### Version Validation

```regex
^v?\d+\.\d+\.\d+$
```
- Format: vX.Y.Z or X.Y.Z
- Examples: v1.0.0, 2.1.0

### Context Path Validation

```regex
^\/[a-z0-9-/]*$
```
- Must start with /
- Lowercase letters, numbers, hyphens, slashes only
- Examples: /users, /api/v1/orders

### Timeout Format

```regex
^\d+[smh]$
```
- Numeric value followed by unit
- s = seconds, m = minutes, h = hours
- Examples: 30s, 5m, 1h

### IP Address Validation

```regex
^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$
```
- IPv4 format
- Example: 10.0.1.100

### Port Validation

- Integer: 1-65535
- Must be unique per gateway

---

## Implementation Checklist

### Backend Tasks

#### Core Infrastructure
- [ ] Set up REST API framework (Express, FastAPI, etc.)
- [ ] Configure database (PostgreSQL, MongoDB, etc.)
- [ ] Implement JWT authentication middleware
- [ ] Set up request validation (Zod, Joi, etc.)
- [ ] Configure CORS and security headers
- [ ] Set up error handling middleware
- [ ] Implement request logging and tracing

#### APIs Module
- [ ] `GET /apis` - List APIs with filtering/pagination
- [ ] `GET /apis/{apiId}` - Get API by ID
- [ ] `POST /apis` - Create API
- [ ] `PUT /apis/{apiId}` - Update API
- [ ] `DELETE /apis/{apiId}` - Delete API
- [ ] `PATCH /apis/{apiId}/status` - Update API status
- [ ] `GET /apis/{apiId}/policies` - Get policy chain
- [ ] `PUT /apis/{apiId}/policies` - Update policy chain
- [ ] `GET /apis/{apiId}/deployments` - Get API deployments

#### Deployments Module
- [ ] `GET /deployments` - List deployments
- [ ] `GET /deployments/{deploymentId}` - Get deployment by ID
- [ ] `POST /deployments` - Deploy API
- [ ] `PATCH /deployments/{deploymentId}/status` - Update status
- [ ] `DELETE /deployments/{deploymentId}` - Undeploy API
- [ ] `GET /deployments/stats` - Get deployment statistics
- [ ] Implement policy chain resolution logic

#### Gateways Module
- [ ] `GET /gateways` - List gateways
- [ ] `GET /gateways/{gatewayId}` - Get gateway by ID
- [ ] `POST /gateways` - Create gateway
- [ ] `PUT /gateways/{gatewayId}` - Update gateway
- [ ] `DELETE /gateways/{gatewayId}` - Delete gateway

#### Listeners Module
- [ ] `GET /listeners` - List listeners
- [ ] `GET /gateways/{gatewayId}/listeners/{port}` - Get listener
- [ ] `POST /gateways/{gatewayId}/listeners` - Create listener
- [ ] `PUT /gateways/{gatewayId}/listeners/{port}` - Update listener
- [ ] `DELETE /gateways/{gatewayId}/listeners/{port}` - Delete listener

#### Environments Module
- [ ] `GET /environments` - List environments
- [ ] `GET /gateways/{gatewayId}/listeners/{port}/environments/{name}` - Get environment
- [ ] `POST /gateways/{gatewayId}/listeners/{port}/environments` - Create environment
- [ ] `PUT /gateways/{gatewayId}/listeners/{port}/environments/{name}` - Update environment
- [ ] `DELETE /gateways/{gatewayId}/listeners/{port}/environments/{name}` - Delete environment

#### Policies Module
- [ ] `GET /policies` - List policies
- [ ] `GET /policies/{policyId}` - Get policy by ID
- [ ] `POST /policies` - Create policy
- [ ] `PUT /policies/{policyId}` - Update policy
- [ ] `DELETE /policies/{policyId}` - Delete policy
- [ ] Implement policy type-specific validation

#### Dashboard & Stats
- [ ] `GET /dashboard/stats` - Get dashboard statistics
- [ ] `GET /dashboard/activity` - Get recent activity
- [ ] Implement aggregation queries

#### Data Validation
- [ ] Implement all Zod schema validations
- [ ] Add database constraints
- [ ] Validate foreign key relationships
- [ ] Implement business logic validations

#### Testing
- [ ] Unit tests for all endpoints
- [ ] Integration tests for workflows
- [ ] API contract tests
- [ ] Performance/load testing

#### Documentation
- [ ] Generate OpenAPI/Swagger spec
- [ ] API documentation portal
- [ ] Example request/response payloads

---

## Notes for Implementation

### Database Schema Considerations

1. **APIs Table:**
   - Primary key: `id` (UUID)
   - Indexes: `name`, `status`, `createdAt`
   - JSON column for `spec`, `upstream`, `routing`, `policyChain`

2. **Deployments Table:**
   - Primary key: `id` (UUID)
   - Foreign key: `apiId` references APIs
   - Indexes: `gatewayId`, `environment`, `status`, `deployedAt`
   - Composite unique constraint: `(apiId, gatewayId, port, environment)`

3. **Gateways Table:**
   - Primary key: `id` (UUID)
   - Unique constraint: `name`
   - Indexes: `status`, `region`

4. **Listeners Table:**
   - Composite primary key: `(gatewayId, port)`
   - Foreign key: `gatewayId` references Gateways

5. **Environments Table:**
   - Composite primary key: `(gatewayId, port, name)`
   - Foreign keys: `gatewayId`, `port` reference Listeners

6. **Policies Table:**
   - Primary key: `id` (UUID)
   - Indexes: `type`, `attachedTo`, `attachedToId`

### Policy Chain Resolution Algorithm

When deploying an API to an environment:

1. Get environment's default policy chain
2. Get API's policy chain
3. For each API policy:
   - If `inheritanceMode` = `override`: Replace matching environment policy
   - If `inheritanceMode` = `disable`: Remove matching environment policy
   - If `inheritanceMode` = `inherit`: Keep environment policy as-is
   - If `inheritanceMode` = `add`: Append API policy
4. Sort final chain by `order` field
5. Store resolved chain in deployment record

### Security Considerations

1. **Authentication:** All endpoints require valid JWT token
2. **Authorization:** Check user roles for write operations
3. **Input Validation:** Validate all inputs against schemas
4. **SQL Injection:** Use parameterized queries
5. **Rate Limiting:** Implement per-user rate limits
6. **Audit Logging:** Log all create/update/delete operations

### Performance Optimization

1. **Caching:** Cache frequently accessed resources (gateways, policies)
2. **Pagination:** Enforce max page size of 100
3. **Database Indexing:** Index frequently queried fields
4. **Lazy Loading:** Return minimal data in list endpoints
5. **Compression:** Enable gzip compression for responses

---

## Example Implementation (Node.js + Express + Zod)

```typescript
import express from 'express'
import { z } from 'zod'

// Schema definition
const apiCreateSchema = z.object({
  name: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  version: z.string().regex(/^v?\d+\.\d+\.\d+$/),
  displayName: z.string().min(1),
  // ... rest of schema
})

// Route handler
app.post('/apis', authenticate, async (req, res) => {
  try {
    // Validate request body
    const data = apiCreateSchema.parse(req.body)

    // Check for duplicates
    const existing = await db.apis.findOne({
      name: data.name,
      version: data.version
    })
    if (existing) {
      return res.status(409).json({
        error: {
          code: 'ALREADY_EXISTS',
          message: 'API with this name and version already exists'
        }
      })
    }

    // Create API
    const api = await db.apis.create({
      ...data,
      id: generateUUID(),
      status: 'draft',
      deployments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.email
    })

    // Return response
    res.status(201).json({
      data: api,
      meta: { timestamp: new Date().toISOString() }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }
      })
    }

    // Handle other errors
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    })
  }
})
```

---

**End of Backend Integration Plan**
