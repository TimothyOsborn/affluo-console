# Mock Mode for Local Development

The admin console now supports a **mock mode** that allows you to run and test the application locally without requiring a backend server or database.

## 🚀 Quick Start

1. **Enable Mock Mode:**
   ```bash
   # The .env.local file is already configured with mock mode enabled
   VITE_USE_MOCK_API=true
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the Admin Console:**
   - URL: `http://localhost:5173/`
   - Login with any of these mock users:
     - **Username:** `admin` (Admin role)
     - **Username:** `manager` (Manager role)
     - **Username:** `editor` (Editor role)
     - **Username:** `viewer` (Viewer role)
   - **Password:** Any password will work in mock mode

## 📊 Mock Data Available

### Users
- **4 mock users** with different roles and permissions
- Realistic user profiles with avatars and activity data
- Company-scoped user management

### Forms
- **4 sample forms** with different schemas and statuses:
  1. **Customer Feedback Survey** (Published, 156 submissions)
  2. **Employee Onboarding** (Published, 23 submissions)
  3. **Event Registration** (Draft, 0 submissions)
  4. **Bug Report** (Published, 89 submissions)

### Submissions
- **4 sample submissions** with realistic data
- Different statuses (pending, approved, rejected)
- Form-specific submission data

### Teams
- **2 mock teams** with different permissions
- Team member management
- Permission-based access control

## 🔧 Features Working in Mock Mode

### ✅ Fully Functional
- **Authentication & Authorization**
- **Form Management** (Create, Read, Update, Delete)
- **Submission Management** (View, Filter, Search)
- **User Management** (Create, Read, Update, Delete)
- **Team Management**
- **Dashboard Analytics**
- **Real-time Updates** (simulated)
- **Search & Filtering**
- **Pagination**
- **Form Builder**
- **Responsive Design**

### ⚡ Simulated Features
- **Network Delays** (200-700ms realistic delays)
- **Error Handling** (401, 403, 404, 500 errors)
- **Token Management** (JWT simulation)
- **WebSocket Connections** (mock endpoints)

## 🎯 Testing Scenarios

### Login & Authentication
```bash
# Test different user roles
Username: admin     # Full access
Username: manager   # Management access
Username: editor    # Content editing
Username: viewer    # Read-only access
```

### Form Operations
- Create new forms with the form builder
- Edit existing forms
- Publish/draft forms
- Delete forms
- View form submissions

### Data Management
- View and filter submissions
- Export data (simulated)
- User management
- Team management

## 🔄 Switching Between Mock and Real API

### Enable Mock Mode
```bash
# Set in .env.local
VITE_USE_MOCK_API=true
```

### Disable Mock Mode (Use Real Backend)
```bash
# Set in .env.local
VITE_USE_MOCK_API=false
# or remove the line entirely
```

### Environment Variables
```bash
# Mock mode settings
VITE_USE_MOCK_API=true
VITE_MOCK_DELAY_MIN=200
VITE_MOCK_DELAY_MAX=700

# Real API settings
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WEBSOCKET_URL=ws://localhost:8080/ws/sync
```

## 🛠️ Customizing Mock Data

You can modify the mock data by editing `src/services/mockData.ts`:

### Adding New Users
```typescript
const newUser: MockUser = {
  id: 'user-5',
  username: 'newuser',
  email: 'newuser@affluo.com',
  role: 'editor',
  companyId: 'company-1',
  companyName: 'Affluo Inc',
  // ... other fields
}
```

### Adding New Forms
```typescript
const newForm: MockForm = {
  id: 'form-5',
  title: 'New Form',
  description: 'Description',
  schema: { /* JSON Schema */ },
  status: 'draft',
  // ... other fields
}
```

### Resetting Mock Data
```typescript
import { resetMockData } from './services/mockData'
resetMockData() // Resets to original mock data
```

## 🎨 UI/UX Features

The mock mode provides a complete admin console experience with:

- **Material Design 3** styling
- **Forest Green Theme**
- **Responsive Layout**
- **Loading States**
- **Error Handling**
- **Success Notifications**
- **Form Validation**
- **Data Tables**
- **Charts & Analytics**
- **Navigation & Breadcrumbs**

## 🚀 Benefits

1. **No Backend Required** - Run the admin console independently
2. **Realistic Data** - Test with meaningful sample data
3. **Fast Development** - No network dependencies
4. **Consistent Environment** - Same data every time
5. **Easy Testing** - Predictable scenarios
6. **Offline Development** - Work without internet
7. **Demo Ready** - Perfect for presentations

## 🔍 Troubleshooting

### Mock Mode Not Working
1. Check `.env.local` has `VITE_USE_MOCK_API=true`
2. Restart the development server
3. Clear browser cache and localStorage

### Login Issues
- Any password works in mock mode
- Check browser console for errors
- Try different usernames (admin, manager, editor, viewer)

### Data Not Loading
- Check network tab for failed requests
- Verify mock data is properly imported
- Restart the development server

## 📝 Next Steps

Once you're comfortable with the mock mode:

1. **Connect to Real Backend** - Set `VITE_USE_MOCK_API=false`
2. **Customize Mock Data** - Add your own test scenarios
3. **Extend Mock Features** - Add more realistic behaviors
4. **Integration Testing** - Test with real API endpoints

The mock mode provides a complete development environment for the admin console without any external dependencies! 🎉
