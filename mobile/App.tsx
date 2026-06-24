import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import AppNavigator from './src/navigation';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {loggedIn ? <AppNavigator /> : <LoginScreen onLogin={() => setLoggedIn(true)} />}
    </SafeAreaProvider>
  );
}
