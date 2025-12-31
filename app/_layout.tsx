import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider initialDarkMode={false}>
        <Stack initialRouteName="index">
          {/* Main Screens */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="cards" options={{ headerShown: false }} />
          <Stack.Screen name="BudgetScreen" options={{ headerShown: false }} />

          {/* Components */}
          <Stack.Screen name="components/addFunds" options={{ headerShown: false }} />
          <Stack.Screen name="components/addPocket" options={{ headerShown: false }} />
          <Stack.Screen name="components/transfer" options={{ headerShown: false }} />
          <Stack.Screen name="components/EditPocketScreen" options={{ headerShown: false }} />
          <Stack.Screen name="components/NewSavingsGoalScreen" options={{ headerShown: false }} />
          <Stack.Screen name="components/AddToSavingsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="components/EditSavingsGoalScreen" options={{ headerShown: false }} />
          <Stack.Screen name="components/transactions" options={{ headerShown: false }} />

          {/* Other Screens */}
          <Stack.Screen name="savings" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style="dark" />
      </ThemeProvider>
    </AuthProvider>
  );
}
