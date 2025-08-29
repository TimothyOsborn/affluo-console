ces: API Fetch, WebSocket, LocalStorage]
    G --> H[Backend: REST APIs + WebSockets]
    F --> I[Custom Hooks: useConnectivity, useWebSocket, useSyncQueue]
    E --> I
    subgraph "Performance Layers"
        J[Lazy Loading & Memoization]
        K[Virtualization & Async Ops]
        L[Offline Caching & Batch Sync]
    end
    B --> J
    D --> K
    G --> L

High-Level Flow:
- Login → Fetch JWT, set companyId.
- Fetch assigned forms → Store locally.
- Complete form offline → Queue in storage.
- On online → Async sync queue to backend; WebSocket listen for updates from others.

## Installation and Setup

### Prerequisites
- Node.js 18.x+
- React Native CLI (or Expo)
- Android Studio/Xcode for emulators
- Backend running

### Local Development
1. Clone:
   
   git clone https://github.com/your-org/form-mobile.git
   cd form-mobile
   
2. Install:
   
   npm install
   
3. Pods (iOS):
   
   cd ios && pod install && cd ..
   
4. Env vars in .env:
   
   API_BASE_URL=http://localhost:8080/api/v1
   WEBSOCKET_URL=ws://localhost:8080/ws/sync
   
5. Run:
   - Android: npm run android
   - iOS: npm run ios

### Building for Production
- Android: cd android && ./gradlew assembleRelease
- iOS: Archive via Xcode.

### Testing
- Unit: npm test
- E2E: Detox or Appium: npm run e2e

## Navigation and Screens

- *LoginScreen*: Custom MD3 form; async login fetch.
- *DashboardScreen*: Overview; lazy-loaded.
- *FormsListScreen*: Virtualized list of assigned forms (fetched async with companyId).
- *FormFillerScreen*: Custom renderer for schema; async save to queue/backend.
- *SubmissionsScreen*: List of completed forms; pull-to-refresh for sync.

Protected via auth check in navigation.

## API Integration

Services in src/services/:
// api.js
const apiFetch = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('token');
  const companyId = await AsyncStorage.getItem('companyId');
  const url = `${API_BASE_URL}/companies/${companyId}${endpoint}`;
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...options,
  });
};

// Example: submitForm
export const submitForm = async (submission) => {
  return apiFetch('/submissions', { method: 'POST', body: JSON.stringify(submission) });
};

// websocket.js
let ws;
export const initWebSocket = (token, companyId, onMessage) => {
  ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);
  ws.onopen = () => ws.send(JSON.stringify({ subscribe: `/topic/forms/${companyId}` }));
  ws.onmessage = async (event) => {
    // Async handle: e.g., fetch updated data
    const data = JSON.parse(event.data);
    onMessage(data);  // Trigger async UI update
  };
  ws.onclose = () => // Reconnect logic
};

*Async WebSocket Handling*: onmessage callbacks are async; use in useEffect with cleanup. Reconnect on disconnect using exponential backoff.

## Form Completion Implementation

- Custom FormRenderer: Parse JSON schema, render fields with custom Inputs.
- Offline: Save to queue (array in AsyncStorage); async process queue on online.
- Sync: On notification, async GET latest submissions.

## Multi-Tenancy in App

- companyId stored post-login.
- All fetches include it; local data filtered.

## Sequence Diagrams

### Login and Initial Sync
mermaid
sequenceDiagram
    participant User as User
    participant App as RN App
    participant API as Backend API
    User->>App: Enter credentials
    App->>API: POST /auth/login (async fetch)
    API-->>App: JWT with companyId
    App->>App: Store JWT, companyId (AsyncStorage)
    App->>API: GET /forms (async, with companyId)
    App-->>User: Show forms list

### Form Submission (Offline/Online)
mermaid
sequenceDiagram
    participant User as User
    participant App as RN App
    participant Local as Local Storage
    participant API as Backend API
    User->>App: Complete form
    alt Offline
        App->>Local: Queue submission (async save)
    else Online
        App->>API: POST /submissions (async fetch)
        API-->>App: 201
    end
    Note over App: On online, async process queue

### Real-Time Sync via WebSocket
mermaid
sequenceDiagram
    participant Other as Other Device
    participant API as Backend API
    participant WS as WebSocket
    participant App as RN App
    Other->>API: POST submission
    API->>WS: Broadcast to company topic
    WS->>App: onmessage (async event)
    App->>API: GET updated submissions (async fetch)
    App->>App: Update UI (state set)
    App-->>User: Refresh view

## Deployment

- *Builds*: Use Fastlane for CI/CD.
- *Stores*: Submit to App Store/Play Store.
- *Cloud*: Firebase for crashlytics (minimal).

## Monitoring and Maintenance
- Crash Reporting: Custom logs or Firebase.
- Performance: React Native Hermes; profile with Flipper.

## Contributing
- Feature branches.

## License
MIT. See LICENSE.
