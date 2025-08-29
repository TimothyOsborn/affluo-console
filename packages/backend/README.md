# Backend API

Spring Boot backend API for the Affluo Form Platform.

## Features

- **Multi-tenant Architecture**: Company-scoped data isolation
- **RESTful APIs**: Complete CRUD operations for forms and submissions
- **Real-time Communication**: WebSocket support for live updates
- **Authentication**: JWT-based authentication and authorization
- **Message Queuing**: Kafka integration for async processing
- **Caching**: Redis for performance optimization
- **Document Storage**: MongoDB for flexible form schemas
- **Relational Data**: PostgreSQL for structured data

## Tech Stack

- **Framework**: Spring Boot 3.1.0
- **Language**: Java 17
- **Build Tool**: Gradle 8.0
- **Database**: MongoDB + PostgreSQL
- **Cache**: Redis
- **Message Broker**: Apache Kafka
- **Authentication**: JWT
- **Documentation**: OpenAPI 3.0
- **Monitoring**: Spring Actuator

## Getting Started

### Prerequisites

- Java 17 JDK
- Gradle 8.0 or higher
- MongoDB 7.0 or higher
- PostgreSQL 14 or higher
- Redis 7.0 or higher
- Kafka 3.0 or higher

### Installation

1. **Set up environment**:
   ```bash
   cp env.example .env
   ```

2. **Start dependencies** (using Docker):
   ```bash
   docker-compose up -d mongodb postgres redis kafka
   ```

3. **Run the application**:
   ```bash
   ./gradlew bootRun
   ```

4. **Access the API**:
   - API: http://localhost:8080/api/v1
   - Documentation: http://localhost:8080/swagger-ui.html
   - Health Check: http://localhost:8080/actuator/health

## Development

### Available Scripts

- `./gradlew bootRun` - Start development server
- `./gradlew build` - Build the application
- `./gradlew test` - Run tests
- `./gradlew clean` - Clean build artifacts
- `./gradlew checkstyleMain` - Run code style checks

### Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/affluo/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── service/         # Business logic
│   │       ├── repository/      # Data access layer
│   │       ├── model/           # Data models
│   │       ├── security/        # Security configuration
│   │       └── util/            # Utility classes
│   └── resources/
│       ├── application.yml      # Application configuration
│       └── db/                  # Database scripts
└── test/                        # Test classes
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/validate` - Validate token

### Forms
- `GET /api/v1/companies/{companyId}/forms` - List forms
- `POST /api/v1/companies/{companyId}/forms` - Create form
- `GET /api/v1/companies/{companyId}/forms/{id}` - Get form
- `PUT /api/v1/companies/{companyId}/forms/{id}` - Update form
- `DELETE /api/v1/companies/{companyId}/forms/{id}` - Delete form

### Submissions
- `GET /api/v1/companies/{companyId}/submissions` - List submissions
- `POST /api/v1/companies/{companyId}/submissions` - Create submission
- `GET /api/v1/companies/{companyId}/submissions/{id}` - Get submission

### Users
- `GET /api/v1/companies/{companyId}/users` - List users
- `POST /api/v1/companies/{companyId}/users` - Create user

### WebSocket
- `ws://localhost:8080/ws/sync` - Real-time updates

## Configuration

### Environment Variables

- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `SPRING_DATASOURCE_URL` - PostgreSQL connection string
- `SPRING_KAFKA_BOOTSTRAP_SERVERS` - Kafka servers
- `SPRING_REDIS_HOST` - Redis host
- `JWT_SECRET` - JWT signing secret
- `SERVER_PORT` - Application port

### Profiles

- `dev` - Development profile
- `prod` - Production profile
- `docker` - Docker profile

## Database Schema

### MongoDB Collections
- `forms` - Form schemas and metadata
- `submissions` - Form submission data

### PostgreSQL Tables
- `users` - User accounts and profiles
- `companies` - Company information
- `teams` - Team definitions
- `user_roles` - User role assignments

## Testing

```bash
./gradlew test
```

## Building for Production

```bash
./gradlew build
```

The built JAR file will be in `build/libs/`.

## Docker

### Build Image
```bash
docker build -t affluo-backend .
```

### Run Container
```bash
docker run -p 8080:8080 affluo-backend
```

## Monitoring

### Health Checks
- Application: `/actuator/health`
- Database: `/actuator/health/db`
- Cache: `/actuator/health/redis`

### Metrics
- Prometheus: `/actuator/prometheus`
- Application metrics: `/actuator/metrics`

## Contributing

1. Follow Java coding conventions
2. Write unit and integration tests
3. Update API documentation
4. Submit pull requests for review
