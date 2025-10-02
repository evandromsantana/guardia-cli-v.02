import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import { createUserProfile } from '../firebase/userService'; // Import the service

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
      setUser(user);
      if (user) {
        // If user is logged in, ensure their profile exists in Firestore
        createUserProfile(user).catch(console.error);
      }
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
