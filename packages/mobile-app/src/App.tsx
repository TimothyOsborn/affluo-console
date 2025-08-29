import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SyncProvider } from './contexts/SyncContext';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import FormsListScreen from './screens/FormsListScreen';
import FormFillerScreen from './screens/FormFillerScreen';
import SubmissionsScreen from './screens/SubmissionsScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SyncProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#228B22',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen}
                options={{ title: 'Dashboard' }}
              />
              <Stack.Screen 
                name="FormsList" 
                component={FormsListScreen}
                options={{ title: 'Forms' }}
              />
              <Stack.Screen 
                name="FormFiller" 
                component={FormFillerScreen}
                options={{ title: 'Complete Form' }}
              />
              <Stack.Screen 
                name="Submissions" 
                component={SubmissionsScreen}
                options={{ title: 'Submissions' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SyncProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
