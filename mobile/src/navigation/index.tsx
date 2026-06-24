import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import DeliveryDetailScreen from '../screens/DeliveryDetailScreen';
import RouteScreen from '../screens/RouteScreen';
import ShiftSummaryScreen from '../screens/ShiftSummaryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1A56DB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          borderTopColor: '#F3F4F6',
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Deliveries', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }} />
      <Tab.Screen name="Route" component={RouteScreen} options={{ tabBarLabel: 'Route', tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} /> }} />
      <Tab.Screen name="ShiftSummary" component={ShiftSummaryScreen} options={{ tabBarLabel: 'Summary', tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} options={{ presentation: 'card' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
