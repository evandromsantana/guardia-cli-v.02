import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import SignInScreen from '../screens/SignInScreen';
import AppNavigator from './AppNavigator';
import StartTripScreen from '../screens/StartTripScreen';
import TripMonitoringScreen from '../screens/TripMonitoringScreen';
import { createUserProfile } from '../firebase/userService';

// Define the param list for the root stack
export type RootStackParamList = {
  App: undefined;
  StartTrip: undefined;
  TripMonitoring: { tripId: string; mode: 'self' | 'monitoring' };
  SignIn: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
      setUser(user);
      if (user) {
        createUserProfile(user).catch(console.error);
        setupPushNotifications().catch(console.error);
      }
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Screens for logged-in users
          <>
            <Stack.Screen
              name="App"
              component={AppNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StartTrip"
              component={StartTripScreen}
              options={{ title: 'Iniciar Novo Trajeto' }}
            />
            <Stack.Screen
              name="TripMonitoring"
              component={TripMonitoringScreen}
              options={{ headerShown: false }} // Hide header for a more immersive map view
            />
          </>
        ) : (
          // Screen for logged-out users
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
