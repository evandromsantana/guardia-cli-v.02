import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GuardianCircleScreen from '../screens/GuardianCircleScreen';
import InviteGuardianScreen from '../screens/InviteGuardianScreen';
import PendingInvitesScreen from '../screens/PendingInvitesScreen';

export type GuardianStackParamList = {
  GuardianCircle: undefined;
  InviteGuardian: undefined;
  PendingInvites: undefined;
};

const Stack = createNativeStackNavigator<GuardianStackParamList>();

const GuardianNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GuardianCircle"
        component={GuardianCircleScreen}
        options={{ title: 'Meu Círculo' }}
      />
      <Stack.Screen
        name="InviteGuardian"
        component={InviteGuardianScreen}
        options={{ title: 'Convidar Guardiã' }}
      />
      <Stack.Screen
        name="PendingInvites"
        component={PendingInvitesScreen}
        options={{ title: 'Convites Pendentes' }}
      />
    </Stack.Navigator>
  );
};

export default GuardianNavigator;
