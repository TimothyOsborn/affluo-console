# Affluo Form Platform

A complete form building platform with admin console, mobile app, and backend API. Built as a monorepo for easy development and deployment.

## 🏗️ Architecture

This monorepo contains four main packages:

- **`packages/admin-console`** - React.js web application for form management
- **`packages/mobile-app`** - React Native mobile app for form completion
- **`packages/backend`** - Spring Boot API server
- **`packages/marketing-website`** - Modern marketing website for user documentation, sales, and account creation

## 📦 Packages

### Admin Console (`packages/admin-console`)
- **Technology**: React.js 18.x + TypeScript + Vite
- **Purpose**: Web-based admin interface for creating and managing forms
- **Features**: 
  - Multi-tenant architecture with company scoping
  - Material Design 3 forest green theme
  - Real-time updates via WebSocket
  - Form builder with drag-and-drop interface
  - User and team management
  - Submission tracking and analytics

### Mobile App (`packages/mobile-app`)
- **Technology**: React Native + TypeScript
- **Purpose**: Mobile application for completing forms
- **Features**:
  - Offline form completion
  - Real-time synchronization
  - Multi-tenant support
  - Push notifications
  - Camera and file upload support

### Backend API (`packages/backend`)
- **Technology**: Spring Boot 3.x + Java 17
- **Purpose**: RESTful API and WebSocket server
- **Features**:
  - Multi-tenant data isolation
  - JWT authentication
  - Real-time WebSocket communication
  - Kafka message queuing
  - MongoDB for document storage
  - Redis caching

### Marketing Website (`packages/marketing-website`)
- **Technology**: React.js 18.x + TypeScript + Vite + Tailwind CSS
- **Purpose**: Modern marketing website for user engagement and sales
- **Features**:
  - Responsive design with modern UI/UX
  - SEO optimized with React Helmet
  - Smooth animations with Framer Motion
  - User documentation and guides
  - Pricing and feature comparison
  - Contact forms and lead generation
  - Account creation and signup flow

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- Java 17 JDK
- Docker and Docker Compose
- MongoDB (or use Docker)
- Kafka (or use Docker)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd affluo-console
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   ```bash
   # Copy environment files
   cp packages/admin-console/env.example packages/admin-console/.env
   cp packages/mobile-app/env.example packages/mobile-app/.env
   cp packages/backend/env.example packages/backend/.env
   ```

4. **Start the entire platform with Docker**:
   ```bash
   npm run docker:up
   ```

   This will start:
   - Backend API on `http://localhost:8080`
   - Admin Console on `http://localhost:3000`
   - Marketing Website on `http://localhost:3002`
   - MongoDB on `localhost:27017`
   - Redis on `localhost:6379`
   - Kafka on `localhost:9092`

### Development

#### Start individual services:

```bash
# Admin Console (React.js)
npm run dev:admin

# Mobile App (React Native)
npm run dev:mobile

# Backend API (Spring Boot)
npm run dev:backend

# Marketing Website (React.js)
npm run dev:marketing
```

#### Build all packages:

```bash
npm run build:all
```

#### Run tests:

```bash
npm run test:all
```

#### Lint code:

```bash
npm run lint:all
```

## 📁 Project Structure

```
affluo-console/
├── packages/
│   ├── admin-console/          # React.js web application
│   │   ├── src/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── Dockerfile
│   ├── mobile-app/             # React Native mobile app
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── backend/                # Spring Boot API
│   │   ├── src/
│   │   ├── build.gradle
│   │   └── Dockerfile
│   └── marketing-website/      # Marketing website
│       ├── src/
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── nginx.conf
│       └── Dockerfile
├── package.json                # Root monorepo configuration
├── docker-compose.yml          # Full platform orchestration
└── README.md                   # This file
```

## 🔧 Development Workflow

### Adding a new feature:

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop in the appropriate package**:
   ```bash
   # For admin console features
   cd packages/admin-console
   npm run dev

   # For mobile app features
   cd packages/mobile-app
   npm run dev

   # For backend features
   cd packages/backend
   ./gradlew bootRun

   # For marketing website features
   cd packages/marketing-website
   npm run dev
   ```

3. **Test your changes**:
   ```bash
   npm run test:all
   npm run lint:all
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### Shared Dependencies

The monorepo structure allows for easy sharing of:
- Type definitions
- Utility functions
- API client code
- Common components

## 🐳 Docker Deployment

### Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production Deployment

```bash
# Build all images
docker-compose build

# Deploy with production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔌 API Integration

### Backend API Endpoints

The backend provides RESTful APIs and WebSocket endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Forms**: `/api/v1/companies/{companyId}/forms/*`
- **Submissions**: `/api/v1/companies/{companyId}/submissions/*`
- **Users**: `/api/v1/companies/{companyId}/users/*`
- **WebSocket**: `ws://localhost:8080/ws/sync`

### Multi-tenancy

All endpoints are company-scoped using the `companyId` parameter. The JWT token contains the user's company context for automatic filtering.

## 🧪 Testing

Each package has its own testing setup:

- **Admin Console**: Jest + React Testing Library
- **Mobile App**: Jest + React Native Testing Library
- **Backend**: JUnit 5 + Mockito

Run tests for all packages:
```bash
npm run test:all
```

## 📊 Monitoring

### Health Checks

- **Backend**: `http://localhost:8080/actuator/health`
- **Admin Console**: `http://localhost:3000/health`
- **Marketing Website**: `http://localhost:3002/health`

### Logs

View logs for all services:
```bash
npm run docker:logs
```

## 🔒 Security

- JWT-based authentication
- Company-scoped data isolation
- Role-based access control
- HTTPS in production
- Input validation and sanitization

## 🚀 Performance

- Code splitting and lazy loading
- Redis caching
- Database query optimization
- CDN for static assets
- Gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each package
- Review the architecture documents in the `docs/` folder
