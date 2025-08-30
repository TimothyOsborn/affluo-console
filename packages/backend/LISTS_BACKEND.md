# Lists Backend Implementation

This document describes the backend implementation for the Lists functionality in the Affluo Forms platform.

## Overview

The Lists feature allows companies to create and manage custom data lists that can be used as data sources for form fields, particularly dropdown/select fields. This enables dynamic form building with real-time data from company-specific lists.

## Architecture

### Database Design

**MongoDB Collections:**
- `lists` - Stores list definitions and items
- `forms` - Enhanced to support list data sources

### Key Components

1. **Models**
   - `List.java` - Main list entity with fields and items
   - `Form.java` - Enhanced with DataSource support

2. **Services**
   - `ListService.java` - Business logic for list operations
   - `FormService.java` - Enhanced to process list data sources

3. **Controllers**
   - `ListController.java` - REST API endpoints for lists
   - `FormController.java` - Enhanced form endpoints

4. **Repositories**
   - `ListRepository.java` - MongoDB repository for lists

## API Endpoints

### Lists Management

```
GET    /api/companies/{companyId}/lists
GET    /api/companies/{companyId}/lists/{listId}
POST   /api/companies/{companyId}/lists
PUT    /api/companies/{companyId}/lists/{listId}
DELETE /api/companies/{companyId}/lists/{listId}
```

### List Items Management

```
POST   /api/companies/{companyId}/lists/{listId}/items
DELETE /api/companies/{companyId}/lists/{listId}/items/{itemId}
```

### List Field Values

```
GET    /api/companies/{companyId}/lists/{listId}/fields/{fieldName}/values
```

## Data Models

### List Model

```java
@Document(collection = "lists")
public class List {
    private String id;
    private String companyId;
    private String name;
    private String description;
    private List<ListField> fields;
    private List<ListItem> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### List Field

```java
public static class ListField {
    private String name;
    private String type; // text, number, email, select, date
    private Boolean required;
    private List<String> options; // for select fields
    private Integer order;
}
```

### List Item

```java
public static class ListItem {
    private String id;
    private Map<String, Object> data; // dynamic field values
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Enhanced Form Field

```java
public static class FormField {
    // ... existing fields
    private DataSource dataSource; // New field for list data sources
}

public static class DataSource {
    private String type; // "list" or "manual"
    private String listId; // ID of the list to use as data source
    private String listField; // Field name in the list to use for options
}
```

## Features

### 1. List Management
- Create, read, update, delete lists
- Define custom fields with different types
- Add/remove items dynamically
- Company-scoped lists

### 2. Form Integration
- Use lists as data sources for dropdown fields
- Automatic option population from list data
- Real-time data resolution

### 3. Data Validation
- Field type validation
- Required field enforcement
- Duplicate name prevention

### 4. Sample Data
- Product Inventory list
- Employee Directory list
- Customer List

## Usage Examples

### Creating a List

```bash
POST /api/companies/company-1/lists
{
  "name": "Product Categories",
  "description": "Available product categories",
  "fields": [
    {
      "name": "Category Name",
      "type": "text",
      "required": true,
      "order": 1
    },
    {
      "name": "Description",
      "type": "text",
      "required": false,
      "order": 2
    }
  ],
  "items": [
    {
      "Category Name": "Electronics",
      "Description": "Electronic devices and accessories"
    },
    {
      "Category Name": "Clothing",
      "Description": "Apparel and fashion items"
    }
  ]
}
```

### Using List in Form

```bash
POST /api/companies/company-1/forms
{
  "name": "Product Order Form",
  "fields": [
    {
      "id": "product_category",
      "type": "select",
      "label": "Product Category",
      "dataSource": {
        "type": "list",
        "listId": "list-123",
        "listField": "Category Name"
      }
    }
  ]
}
```

### Getting List Field Values

```bash
GET /api/companies/company-1/lists/list-123/fields/Category Name/values
```

Response:
```json
["Electronics", "Clothing", "Home & Garden"]
```

## Security Considerations

1. **Company Isolation**: All list operations are scoped to the company
2. **Access Control**: Lists are only accessible to users within the same company
3. **Data Validation**: Input validation for all list operations
4. **Error Handling**: Proper error responses for invalid operations

## Performance Considerations

1. **Indexing**: MongoDB indexes on `companyId` for efficient queries
2. **Caching**: Consider Redis caching for frequently accessed lists
3. **Pagination**: Large lists can be paginated if needed
4. **Lazy Loading**: List data sources are resolved on-demand

## Future Enhancements

1. **List Sharing**: Share lists between companies
2. **List Templates**: Predefined list templates
3. **Bulk Operations**: Import/export list data
4. **List Analytics**: Usage statistics and insights
5. **Real-time Updates**: WebSocket notifications for list changes

## Testing

The backend includes:
- Unit tests for services
- Integration tests for controllers
- Sample data initialization
- API documentation with Swagger

## Deployment

1. Ensure MongoDB is running and accessible
2. Set up proper environment variables
3. Run database migrations if needed
4. Start the Spring Boot application
5. Verify sample data initialization

## Monitoring

- Log all list operations for audit trails
- Monitor API response times
- Track list usage patterns
- Alert on data validation errors
