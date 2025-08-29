# Form Building App Backend

## Overview

This repository contains the backend implementation for a form building application. The app allows companies to create customizable forms for workflows via a web admin console. Team members complete these forms using a React Native mobile app. The backend handles form schema storage (in JSON format), completed form submissions, and data synchronization across devices. When a mobile app connects, it syncs data with the backend, which then propagates updates to other active apps.

The backend is built using Java with Spring Boot, designed for scalability, real-time synchronization, and secure data handling. It starts as a monolithic application but is structured to evolve into microservices if needed. Multi-tenancy is supported to allow multiple companies (tenants) to use the product with segregated data and permissions, using a shared database with a companyId discriminator for isolation.

Key Features:
- RESTful APIs for form management and submissions.
- WebSocket for real-time updates.
- Asynchronous processing via Kafka for decoupling and scalability.
- JSON-based storage for flexible form schemas.
- Secure authentication and authorization with tenant scoping.
- Containerized deployment for cloud scalability.
- Multi-tenancy for data and permission segregation.

## Tech Stack

- *Language*: Java 17
- *Framework*: Spring Boot 3.x
- *API*: Spring Web (REST), Spring WebSocket (real-time)
- *Database*: MongoDB (primary for JSON forms/schemas via Spring Data MongoDB); PostgreSQL optional for relational data (via Spring Data JPA)
- *Caching*: Redis (via Spring Cache)
- *Message Queue*: Apache Kafka (via Spring Kafka)
- *Authentication*: Spring Security with JWT and OAuth2
- *Build Tool*: Gradle 8.x
- *Containerization*: Docker
- *Orchestration*: Kubernetes (K8s)
- *Cloud Hosting*: AWS (ECS/EKS recommended); alternatives: Azure (AKS) or GCP (GKE)
- *Monitoring*: Prometheus + Grafana; Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- *Testing*: JUnit 5, Mockito, Spring Boot Test

## Architecture Overview

The backend follows a layered architecture:
1. *Presentation Layer*: Handles incoming requests via REST APIs and WebSockets.
2. *Service Layer*: Business logic for form creation, validation, submission, and sync.
3. *Repository Layer*: Data access to MongoDB/PostgreSQL.
4. *Integration Layer*: Kafka producers/consumers for async tasks.
5. *Security Layer*: Intercepts requests for auth/authz.

For scalability:
- Horizontal scaling of API instances.
- Database sharding/replication in MongoDB.
- Kafka partitions for high-throughput messaging.

*Multi-Tenancy*: Implemented via a shared database with companyId (tenant ID) as a discriminator in all relevant documents/entities. This ensures data isolation. Tenant context is enforced using ThreadLocal storage from JWT claims, with all queries filtered by the authenticated user's companyId. Permissions are scoped to companies (e.g., admins manage only their company's forms). This approach is efficient and scalable; for stricter isolation, separate databases per tenant could be considered in the future.

High-Level Flow:
- Admin creates form schema → Stored in MongoDB with companyId.
- Mobile app submits completed form → API processes, stores with companyId, and publishes to Kafka.
- Kafka consumer triggers sync notifications via WebSocket to connected apps within the same company.

## Installation and Setup

### Prerequisites
- Java 17 JDK
- Gradle 8.x
- MongoDB 7.x (local or cloud)
- Kafka 3.x (with Zookeeper or KRaft mode)
- Redis 7.x
- Docker (for containerization)

### Local Development
1. Clone the repository:
   
   git clone https://github.com/your-org/form-backend.git
   cd form-backend
   
2. Configure application properties in src/main/resources/application.yml:
   
   spring:
     data:
       mongodb:
         uri: mongodb://localhost:27017/formdb
     datasource:  # If using PostgreSQL
       url: jdbc:postgresql://localhost:5432/formdb
       username: user
       password: pass
     kafka:
       bootstrap-servers: localhost:9092
     security:
       oauth2:  # Configure providers if needed
   server:
     port: 8080
   redis:
     host: localhost
     port: 6379
   
3. Build and run:
   
   ./gradlew clean build
   ./gradlew bootRun
   
4. Access Swagger UI for API docs: http://localhost:8080/swagger-ui.html

### Testing
- Unit/Integration Tests: ./gradlew test
- End-to-End: Use Postman or curl for API calls; simulate WebSocket with tools like wscat. Include multi-tenant tests to verify data isolation.

## API Specifications

The API uses REST principles with JSON payloads. All endpoints are prefixed with /api/v1. Authentication is required for most endpoints (JWT Bearer token). Tenant-specific endpoints include /companies/{companyId} for segregation.

### Authentication Endpoints
- *POST /auth/login*
  - Request: { "username": "string", "password": "string" }
  - Response: 200 OK with JWT token { "token": "string" } (includes companyId claim).
  - Description: Authenticates user and returns JWT with tenant context.

- *POST /auth/refresh*
  - Request: { "refreshToken": "string" }
  - Response: 200 OK with new access token.

### Company Management Endpoints
- *POST /companies* (Super-admin or self-signup)
  - Request: { "name": "string" }
  - Response: 201 Created with company ID.
  - Description: Creates a new company (tenant) and initial admin user.

### Form Management Endpoints
- *POST /companies/{companyId}/forms*
  - Auth: Company Admin role
  - Request: JSON schema (e.g., { "id": "form1", "fields": [{ "type": "text", "label": "Name" }] })
  - Response: 201 Created with form ID.
  - Description: Creates a new form schema for the company.

- *GET /companies/{companyId}/forms/{id}*
  - Auth: Company User role
  - Response: 200 OK with JSON schema.
  - Description: Retrieves form schema (filtered by companyId).

- *PUT /companies/{companyId}/forms/{id}*
  - Auth: Company Admin
  - Request: Updated JSON schema.
  - Response: 200 OK.

- *DELETE /companies/{companyId}/forms/{id}*
  - Auth: Company Admin
  - Response: 204 No Content.

### Submission Endpoints
- *POST /companies/{companyId}/submissions*
  - Auth: Company User
  - Request: { "formId": "string", "data": { "field1": "value" } }
  - Response: 201 Created with submission ID.
  - Description: Submits completed form; triggers Kafka event for sync within the company.

- *GET /companies/{companyId}/submissions/{id}*
  - Auth: Company User
  - Response: 200 OK with submission data.

- *GET /companies/{companyId}/submissions?formId={id}*
  - Auth: Company User
  - Response: 200 OK with list of submissions (paginated: ?page=0&size=10).

### Sync Endpoints (WebSocket)
- *WebSocket: /ws/sync*
  - Auth: Via JWT in query param or header.
  - Subscribe to: /topic/forms/{companyId}
  - Message Format: JSON { "event": "formUpdated", "submissionId": "string" }
  - Description: Clients connect to receive real-time updates on form submissions/sync within their company.

Error Handling:
- Standard HTTP codes (400 Bad Request, 401 Unauthorized, 403 Forbidden for cross-tenant access, etc.).
- Response Body: { "error": "message", "details": "optional" }

API Documentation: Integrated Swagger/OpenAPI at /v3/api-docs.

## Kafka Topic Schemas

Kafka is used for asynchronous processing, such as notifying about new submissions or sync events. Topics are partitioned (default: 3 partitions, replication factor: 2), with companyId as the message key for tenant-specific ordering and isolation.

### Topics
1. *form-submitted*
   - Producers: API submission endpoint.
   - Consumers: Sync service (triggers WebSocket broadcasts).
   - Purpose: Handle post-submission processing (e.g., validation, notifications).

2. *sync-updates*
   - Producers: Sync service after processing.
   - Consumers: Background workers for device notifications.
   - Purpose: Propagate changes to other apps.

3. *audit-logs* (Optional)
   - For logging actions like form creations/edits.

### Message Schemas (Avro Recommended for Type Safety)
Use Avro schemas for messages to ensure compatibility. Define in src/main/avro/.

- *FormSubmittedEvent.avsc*
  
avsc
  {
    "type": "record",
    "name": "FormSubmittedEvent",
    "fields": [
      {"name": "submissionId", "type": "string"},
      {"name": "formId", "type": "string"},
      {"name": "companyId", "type": "string"},
      {"name": "userId", "type": "string"},
      {"name": "timestamp", "type": "long"},
      {"name": "data", "type": {"type": "map", "values": "string"}}  // JSON-like form data
    ]
  }
  

- *SyncUpdateEvent.avsc*
  
avsc
  {
    "type": "record",
    "name": "SyncUpdateEvent",
    "fields": [
      {"name": "eventType", "type": "string"},  // e.g., "updated", "deleted"
      {"name": "entityId", "type": "string"},
      {"name": "companyId", "type": "string"},
      {"name": "changes", "type": {"type": "map", "values": "string"}}  // Delta changes
    ]
  }
  

In Spring Kafka:
- Configure KafkaTemplate for producers (use companyId as key).
- Use @KafkaListener for consumers.

## Sequence Diagrams

Diagrams are in Mermaid syntax for easy rendering in Markdown viewers.

### Form Creation Flow
mermaid
sequenceDiagram
    participant Admin as Web Admin Console
    participant API as Spring Boot API
    participant DB as MongoDB
    Admin->>API: POST /companies/{companyId}/forms (JSON Schema)
    API->>API: Validate Schema & companyId against TenantContext
    API->>DB: Insert Document with companyId
    DB-->>API: Acknowledgment
    API-->>Admin: 201 Created (Form ID)

### Form Submission and Sync Flow
mermaid
sequenceDiagram
    participant Mobile as React Native App
    participant API as Spring Boot API
    participant Kafka as Kafka Broker
    participant Sync as Sync Consumer
    participant WS as WebSocket
    participant OtherMobile as Other Apps
    Mobile->>API: POST /companies/{companyId}/submissions (Completed Form)
    API->>API: Auth, Validate & Check companyId
    API->>Kafka: Produce to form-submitted (Avro Event, key=companyId)
    API-->>Mobile: 201 Created
    Kafka->>Sync: Consume Event
    Sync->>WS: Broadcast Update to /topic/forms/{companyId}
    WS->>OtherMobile: Push Notification
    Note over OtherMobile: Pull latest data on receipt (company-scoped)

### Offline Sync Flow (High-Level)
mermaid
sequenceDiagram
    participant MobileOffline as Offline Mobile
    participant MobileOnline as Online Mobile
    participant API as API
    participant Kafka as Kafka
    MobileOffline-->>MobileOffline: Queue Local Changes
    MobileOffline->>API: POST /companies/{companyId}/submissions (When Online)
    API->>Kafka: Produce Sync Event (key=companyId)
    Kafka->>API: Process (e.g., Merge Conflicts if any)
    API->>MobileOnline: WebSocket Push to company topic
    MobileOnline-->>MobileOnline: Update Local Store

## Deployment

### Dockerization
- Dockerfile Example:
  
  FROM openjdk:17-jdk-slim
  COPY build/libs/form-backend.jar /app.jar
  ENTRYPOINT ["java", "-jar", "/app.jar"]
  
- Build: ./gradlew build && docker build -t form-backend:latest .
- Run: docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod form-backend

### Kubernetes Deployment
- Deployment YAML Snippet:
  
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: form-backend
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: form-backend
    template:
      metadata:
        labels:
          app: form-backend
      spec:
        containers:
        - name: backend
          image: your-repo/form-backend:latest
          ports:
          - containerPort: 8080
          envFrom:
          - configMapRef:
              name: backend-config
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: form-backend-service
  spec:
    type: LoadBalancer
    ports:
    - port: 80
      targetPort: 8080
    selector:
      app: form-backend
  
- Apply: kubectl apply -f deployment.yaml
- Autoscaling: Use HPA based on CPU (target 50%).

### Cloud Deployment (AWS Example)
1. Push Docker image to ECR.
2. Deploy to EKS: Use eksctl to create cluster, then apply K8s manifests.
3. Managed Services: Use Amazon MSK for Kafka, DocumentDB for MongoDB.
4. CI/CD: Integrate with GitHub Actions or AWS CodePipeline.

## Monitoring and Maintenance
- Health Checks: Spring Actuator endpoints (/actuator/health, /actuator/metrics). Include tenant-specific metrics (e.g., per-company usage).
- Logging: SLF4J with Logback; ship to ELK. Log with companyId for traceability.
- Scaling: Monitor with Prometheus; alert on high latency (>500ms) or error rates (>1%).

## Contributing
- Follow Git Flow: Feature branches, PRs with reviews.
- Code Style: Google Java Style (enforced via Checkstyle).

## License
MIT License. See LICENSE file.
