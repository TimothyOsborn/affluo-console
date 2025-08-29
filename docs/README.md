# Form Building App Admin Console (Frontend)

## Overview

This repository contains the frontend implementation for the admin console of the form building application. The admin console is a web-based interface where company admin staff can manage workflows, forms, and user permissions. It integrates with the backend APIs to perform operations such as creating form schemas, viewing/editing/completing forms, and managing user access via teams and roles.

The frontend is built using React.js, ensuring a responsive, modern user interface with performance as a primary focus. It supports multi-tenancy by scoping all data and operations to the authenticated user's company (tenant). Data isolation is enforced through API calls that include the companyId, and the UI prevents cross-tenant access by design.

To optimize performance:
- Code-splitting with React.lazy and Suspense for lazy-loading routes and components.
- Memoization using React.memo and useMemo/useCallback to prevent unnecessary re-renders.
- Efficient data fetching with caching (via custom hooks or React Query if minimally used).
- Minimal DOM manipulations; virtualized lists for large datasets (e.g., submissions table).
- Bundle size optimization: Limit external libraries, use tree-shaking, and compress assets.
- Web Vitals monitoring: Aim for LCP < 2.5s, FID < 100ms, CLS < 0.1.

The UI follows Material Design 3 (MD3) principles with a forest green theme (primary color: #228B22, secondary: #556B2F, background: #F5F5F5, accents: #32CD32). All elements use custom components built with plain CSS (or CSS-in-JS via styled-components if needed for theming), avoiding heavy UI libraries. Custom components mimic MD3 elevations, ripples, and transitions for buttons, cards, inputs, etc.

Key Features:
- Dynamic form schema creation using a custom drag-and-drop builder.
- Viewing, editing, and completing forms with real-time sync.
- User and team management with role-based access control (RBAC).
- Integration with backend REST APIs and WebSockets for real-time updates.
- Multi-tenancy support: All views and actions are filtered by the user's company.
- Responsive design for desktop and tablet use, with performance-tuned animations.

## Tech Stack

- *Framework*: React.js 18.x (with Hooks and Context API)
- *State Management*: Custom Context API or Redux Toolkit (minimal usage for global state like auth); React Query sparingly for data fetching/caching if performance demands it.
- *UI Styling*: Custom CSS modules or styled-components for MD3-inspired components (e.g., custom Button, Card, TextField with forest green theme). No full UI libraries like MUI to reduce bundle size.
- *Form Handling*: Custom hooks for validation and handling (inspired by Formik but implemented lightly without external deps).
- *Form Builder*: Custom drag-and-drop implementation using React DnD (minimal library) or native HTML5 Drag API to limit deps.
- *API Client*: Axios for HTTP requests (lightweight); Native WebSocket for real-time sync.
- *Authentication*: JWT-based, stored securely in HttpOnly cookies or localStorage with safeguards.
- *Routing*: React Router 6.x for navigation (code-split routes).
- *Build Tool*: Vite for fast development and optimized builds.
- *Testing*: Jest with React Testing Library.
- *Deployment*: Docker for containerization; Kubernetes or Vercel/Netlify for hosting.
- *Other*: TypeScript for type safety; ESLint + Prettier for code quality. Limit external libraries to essentials (e.g., Axios, React Router); implement custom utils for utils like debounce/throttle.

## Architecture Overview

The frontend follows a component-based architecture with separation of concerns, emphasizing performance through modular, reusable code:

- *High-Level Components*:
  - App: Root with theme provider (Context for forest green MD3 theme) and error boundaries.
  - Layout: Sidebar navigation, header with company selector (if multi-company), main content.
  - Pages: Route-based views (lazy-loaded).
  - Custom Components: Button (with MD3 ripple effect via CSS), Card (elevation shadows), Input (outlined/filled variants), Table (virtualized for perf), DragDropContainer (for form builder).

- *State and Data Flow*:
  - Global: Auth state (JWT, companyId) in Context/Redux.
  - Local: useState/useReducer per component; memoized selectors.
  - Data Fetching: Custom hooks like useFetch with caching and abort controllers for perf.
  - Real-Time: WebSocket hook subscribes to company-specific topics, updating state optimistically.

- *Performance Optimizations*:
  - Lazy Loading: Split chunks for routes (e.g., form builder page loads only when navigated).
  - Virtualization: Use custom virtual list for long tables (submissions/users) to render only visible rows.
  - Image/Asset Handling: WebP formats, lazy-loaded images.
  - Rendering: Avoid deep component trees; use shouldComponentUpdate equivalents via memo.
  - Network: Batch API calls where possible; use WebSockets to reduce polling.

### Architecture Diagram
mermaid
graph TD
    A[User Browser] --> B[React App]
    B --> C[Routing: React Router]
    C --> D[Pages: Dashboard, Forms, Submissions, Users]
    D --> E[Custom Components: Button, Card, Table, FormRenderer]
    B --> F[State: Context/Redux - Auth, Theme, Data]
    B --> G[Services: API Client (Axios), WebSocket]
    G --> H[Backend APIs: REST + WS]
    F --> I[Custom Hooks: useAuth, useFetch, useWebSocket]
    E --> I
    subgraph "Performance Layers"
        J[Lazy Loading & Code-Splitting]
        K[Memoization & Virtualization]
        L[Caching & Optimistic Updates]
    end
    B --> J
    D --> K
    G --> L

*Multi-Tenancy*: 
- Upon login, the JWT payload includes companyId, which is stored in state.
- All API calls use /api/v1/companies/{companyId}/... endpoints.
- UI components fetch and display only tenant-scoped data.
- Role checks (from JWT or user profile) restrict features (e.g., only company admins can manage users).
- No global data; everything is filtered client-side if needed, but primarily enforced by backend.

High-Level Flow:
- User logs in → JWT stored, companyId set in state.
- Navigate to form builder → Create schema → POST to backend with companyId.
- View submissions → GET from backend, filtered by companyId → Display in virtualized table with edit/complete options.
- Manage users/teams → CRUD operations on users/roles, scoped to company.

## Installation and Setup

### Prerequisites
- Node.js 18.x+
- Yarn or npm
- Backend server running (for API integration)

### Local Development
1. Clone the repository:
   
   git clone https://github.com/your-org/form-admin-console.git
   cd form-admin-console
   
2. Install dependencies:
   
   npm install
   
   (or yarn install)
3. Configure environment variables in .env:
   
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_WEBSOCKET_URL=ws://localhost:8080/ws/sync
   
4. Start development server:
   
   npm run dev
   
   (or yarn dev)
5. Access the app: http://localhost:5173 (default Vite port)

### Building for Production
npm run build
This generates a dist/ folder for static hosting, optimized with minification and tree-shaking.

### Testing
- Unit/Component Tests: npm test
- E2E Tests: Use Cypress: npm run cypress:open
- Performance Tests: Use Lighthouse in Chrome DevTools to audit.

## Routing and Pages

- */login*: Custom authentication form (MD3 styled inputs); redirects to dashboard on success.
- */dashboard*: Overview with stats (e.g., active forms, pending submissions) in custom cards.
- */companies/{companyId}/forms*: List of forms in virtualized table; create new via custom builder.
- */companies/{companyId}/forms/{formId}*: View/edit schema; complete form using custom renderer.
- */companies/{companyId}/submissions*: List of completed forms; filter by formId in custom table.
- */companies/{companyId}/submissions/{submissionId}*: View/edit submission.
- */companies/{companyId}/users*: Manage users, teams, roles in custom sortable table.

Protected routes use a custom AuthGuard hook to check JWT and companyId.

## API Integration

All services are in src/services/ (e.g., api.js with Axios instance):
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Example: FormService
export const createForm = async (companyId, schema) => {
  return api.post(`/companies/${companyId}/forms`, schema);
};

// WebSocket Example (native)
const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}?token=${token}`);
ws.onmessage = (event) => {
  // Parse and update state optimistically for perf
};

For real-time: Custom hook subscribes to /topic/forms/{companyId}, with debounced updates.

## Form Builder Implementation

- Custom drag-and-drop: Using native Drag API or minimal React DnD.
- Builder UI: Custom toolbar with field types (text, checkbox, etc.); preview pane.
- On save, serialize to JSON schema and POST.
- Renderer: Custom component that parses JSON schema, renders MD3-styled fields, handles validation.

## User Management

- Teams: Custom modals for creating groups; assign forms via dropdowns.
- Roles: Custom chips/selects for assigning (e.g., COMPANY_ADMIN, TEAM_MEMBER).
- UI: Virtualized tables with sorting/search; custom dialogs for CRUD.
- Backend calls: Scoped to companyId.

## Multi-Tenancy in UI

- CompanyId from auth state is interpolated in all routes and API calls.
- If multi-company support added, custom dropdown selector in header.
- Error handling: Custom toast for 403 errors (cross-tenant).

## Sequence Diagrams

Diagrams in Mermaid syntax.

### Login Flow
mermaid
sequenceDiagram
    participant User as User
    participant UI as React UI
    participant API as Backend API
    User->>UI: Enter credentials
    UI->>API: POST /auth/login
    API-->>UI: JWT with companyId
    UI->>UI: Store JWT, set state
    UI-->>User: Redirect to dashboard

### Form Creation Flow
mermaid
sequenceDiagram
    participant Admin as Admin
    participant UI as React UI
    participant API as Backend API
    Admin->>UI: Drag-drop in builder
    UI->>UI: Serialize JSON schema
    UI->>API: POST /companies/{companyId}/forms
    API-->>UI: 201 Created
    UI-->>Admin: Update list (optimistic)

### Real-Time Sync Flow (Submission Update)
mermaid
sequenceDiagram
    participant Mobile as Mobile App
    participant API as Backend API
    participant WS as WebSocket
    participant UI as Admin UI
    Mobile->>API: POST submission
    API->>WS: Broadcast to /topic/forms/{companyId}
    WS->>UI: Push update
    UI->>UI: Refresh submissions table (memoized)
    UI-->>Admin: Display updated data

## Deployment

### Dockerization
- Dockerfile Example:
  
  FROM node:18-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=build /app/dist /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  
- Build: docker build -t form-admin-console:latest .
- Run: docker run -p 80:80 form-admin-console

### Kubernetes Deployment
- Similar to backend: Deployment with replicas, Service as LoadBalancer.
- Use Ingress for routing if multi-app setup.

### Cloud Hosting
- *Vercel/Netlify*: For static hosting; auto-deploys from Git, with perf optimizations.
- *AWS S3 + CloudFront*: For scalable static site with CDN for low latency.
- Integrate with backend via environment vars for API URLs.

## Monitoring and Maintenance
- Error Tracking: Custom logging to console/Sentry (if added minimally).
- Performance: Integrate React Profiler; monitor with Lighthouse/Web Vitals.
- Accessibility: Custom components with ARIA; test for WCAG compliance.

## Contributing
- Follow conventional commits.
- Branching: Feature branches from main.

## License
MIT License. See LICENSE file.
