# Mobile App

React Native mobile application for completing forms in the Affluo Form Platform.

## Features

- **Offline Form Completion**: Complete forms without internet connection
- **Real-time Synchronization**: Sync data when connection is restored
- **Multi-tenant Support**: Company-scoped data and operations
- **Push Notifications**: Receive updates about new forms and submissions
- **Camera Integration**: Capture photos and documents
- **File Upload**: Attach files to form submissions

## Tech Stack

- **Framework**: React Native 0.72.0
- **Language**: TypeScript
- **Navigation**: React Navigation 6.x
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Camera**: react-native-camera
- **File Picker**: react-native-image-picker

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp env.example .env
   ```

3. **Start Metro bundler**:
   ```bash
   npm start
   ```

4. **Run on device/emulator**:
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run build:android` - Build Android APK
- `npm run build:ios` - Build iOS app

### Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and external services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── App.tsx             # Main application component
```

## API Integration

The mobile app integrates with the backend API for:
- User authentication
- Form retrieval and submission
- Real-time updates via WebSocket
- File uploads

## Offline Support

The app supports offline form completion with:
- Local storage of forms and submissions
- Queue system for pending uploads
- Automatic synchronization when online

## Testing

```bash
npm test
```

## Building for Production

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## Contributing

1. Follow the project's coding standards
2. Write tests for new features
3. Update documentation as needed
4. Submit pull requests for review
