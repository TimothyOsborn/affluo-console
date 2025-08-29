# Monorepo Structure

This document explains the monorepo structure and development workflow for the Affluo Form Platform.

## 📁 Directory Structure

```
affluo-console/
├── packages/
│   ├── admin-console/          # React.js web application
│   │   ├── src/               # Source code
│   │   ├── package.json       # Dependencies and scripts
│   │   ├── vite.config.ts     # Vite configuration
│   │   ├── tsconfig.json      # TypeScript configuration
│   │   ├── Dockerfile         # Container configuration
│   │   └── README.md          # Package documentation
│   ├── mobile-app/            # React Native mobile app
│   │   ├── src/               # Source code (to be implemented)
│   │   ├── package.json       # Dependencies and scripts
│   │   ├── Dockerfile         # Container configuration
│   │   └── README.md          # Package documentation
│   └── backend/               # Spring Boot API
│       ├── src/               # Source code (to be implemented)
│       ├── build.gradle       # Gradle configuration
│       ├── package.json       # NPM scripts for monorepo
│       ├── Dockerfile         # Container configuration
│       └── README.md          # Package documentation
├── docs/                      # Architecture documentation
├── package.json               # Root monorepo configuration
├── docker-compose.yml         # Full platform orchestration
├── README.md                  # Main project documentation
└── MONOREPO.md               # This file
```

## 🏗️ Package Overview

### Admin Console (`packages/admin-console`)
- **Technology**: React.js 18.x + TypeScript + Vite
- **Status**: ✅ **Complete** - Fully implemented and working
- **Purpose**: Web-based admin interface for form management
- **Port**: 5173 (dev) / 3000 (prod)

### Mobile App (`packages/mobile-app`)
- **Technology**: React Native + TypeScript
- **Status**: 📋 **Planned** - Structure ready, implementation pending
- **Purpose**: Mobile application for form completion
- **Features**: Offline support, real-time sync, camera integration

### Backend API (`packages/backend`)
- **Technology**: Spring Boot 3.x + Java 17
- **Status**: 📋 **Planned** - Structure ready, implementation pending
- **Purpose**: RESTful API and WebSocket server
- **Port**: 8080

## 🚀 Development Workflow

### Starting Development

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start individual services**:
   ```bash
   # Admin Console (React.js)
   npm run dev:admin
   
   # Mobile App (React Native) - when implemented
   npm run dev:mobile
   
   # Backend API (Spring Boot) - when implemented
   npm run dev:backend
   ```

3. **Start entire platform with Docker**:
   ```bash
   npm run docker:up
   ```

### Building and Testing

```bash
# Build all packages
npm run build:all

# Test all packages
npm run test:all

# Lint all packages
npm run lint:all

# Format all code
npm run format:all
```

### Package-Specific Commands

#### Admin Console
```bash
cd packages/admin-console
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
```

#### Mobile App (when implemented)
```bash
cd packages/mobile-app
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run test         # Run tests
```

#### Backend (when implemented)
```bash
cd packages/backend
./gradlew bootRun    # Start development server
./gradlew build      # Build application
./gradlew test       # Run tests
```

## 🔧 Monorepo Benefits

### Shared Dependencies
- Common TypeScript configurations
- Shared ESLint and Prettier rules
- Unified testing frameworks
- Consistent code quality standards

### Development Efficiency
- Single repository for all components
- Coordinated releases and versioning
- Shared CI/CD pipelines
- Easy cross-package refactoring

### Deployment Coordination
- Single Docker Compose setup
- Coordinated environment variables
- Unified monitoring and logging
- Simplified infrastructure management

## 📦 Package Dependencies

### Admin Console Dependencies
- React 18.x
- TypeScript
- Vite
- Styled Components
- Axios
- React Router
- React DnD

### Mobile App Dependencies (planned)
- React Native 0.72.0
- TypeScript
- React Navigation
- Axios
- AsyncStorage
- Camera and file picker libraries

### Backend Dependencies (planned)
- Spring Boot 3.1.0
- Java 17
- MongoDB
- PostgreSQL
- Redis
- Kafka
- JWT

## 🐳 Docker Integration

### Individual Package Containers
Each package has its own Dockerfile for independent deployment:

```bash
# Build individual containers
docker build packages/admin-console -t affluo-admin
docker build packages/backend -t affluo-backend
docker build packages/mobile-app -t affluo-mobile
```

### Full Platform Orchestration
The root `docker-compose.yml` orchestrates all services:

```yaml
services:
  backend:          # Spring Boot API
  admin-console:    # React.js web app
  mongodb:          # Database
  redis:            # Cache
  kafka:            # Message broker
  zookeeper:        # Kafka dependency
```

## 🔄 Development Workflow

### Feature Development
1. Create feature branch from main
2. Develop in appropriate package(s)
3. Test changes across affected packages
4. Update documentation
5. Submit pull request

### Cross-Package Changes
1. Identify affected packages
2. Make coordinated changes
3. Test integration points
4. Update shared configurations
5. Verify all packages work together

### Release Process
1. Update version numbers in all packages
2. Build all packages
3. Run full test suite
4. Create release tags
5. Deploy with Docker Compose

## 📊 Monitoring and Debugging

### Development Tools
- **Admin Console**: Vite dev server with HMR
- **Mobile App**: Metro bundler with live reload
- **Backend**: Spring Boot dev tools with hot reload

### Logging
- Centralized logging through Docker Compose
- Package-specific log levels
- Health check endpoints

### Performance
- Bundle analysis for frontend packages
- Database query optimization for backend
- Memory and CPU monitoring

## 🔒 Security Considerations

### Multi-tenancy
- Company-scoped data isolation
- JWT-based authentication
- Role-based access control

### API Security
- Input validation and sanitization
- CORS configuration
- Rate limiting
- HTTPS enforcement

### Container Security
- Non-root user execution
- Minimal base images
- Security scanning
- Regular dependency updates

## 🚀 Deployment Strategies

### Development
- Local development with hot reload
- Docker Compose for dependencies
- Individual package development servers

### Staging
- Full platform deployment
- Integration testing
- Performance validation

### Production
- Containerized deployment
- Load balancing
- Monitoring and alerting
- Backup and recovery

## 📈 Future Enhancements

### Planned Features
- Shared component library
- Common API client
- Unified state management
- Cross-package testing utilities

### Infrastructure
- Kubernetes deployment
- CI/CD pipelines
- Automated testing
- Performance monitoring

### Development Experience
- Storybook for component development
- API documentation generation
- Development environment automation
- Code generation tools
