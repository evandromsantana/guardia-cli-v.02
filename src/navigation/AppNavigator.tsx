import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import GuardianNavigator from './GuardianNavigator';
import MonitoredTripsScreen from '../screens/MonitoredTripsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>H</Text>
          ),
        }}
      />
      <Tab.Screen
        name="GuardianCircleTab"
        component={GuardianNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Círculo',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>C</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MonitoringTab"
        component={MonitoredTripsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Monitorando',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>M</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
