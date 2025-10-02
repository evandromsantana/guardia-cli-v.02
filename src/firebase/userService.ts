import firestore from '@react-native-firebase/firestore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

// Based on 02-ESPECIFICACAO_TECNICA.md
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  bio: string | null;
  timeBalance: number;
  memberSince: firestore.Timestamp;
  location: firestore.GeoPoint | null;
  fcmToken?: string; // For push notifications
}

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * @param user The user object from Firebase Authentication.
 */
export const createUserProfile = async (user: FirebaseAuthTypes.User): Promise<void> => {
  const userRef = firestore().collection('users').doc(user.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.log(`Creating new user profile for ${user.uid}`);
    const newUser: Partial<User> = {
      uid: user.uid,
      displayName: user.displayName || 'Usuário Anônimo',
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoURL,
      bio: null,
      timeBalance: 0, // Initial time balance
      memberSince: firestore.Timestamp.now(),
      location: null,
    };
    await userRef.set(newUser);
  } else {
    console.log(`User profile for ${user.uid} already exists.`);
  }
};

/**
 * Requests notification permission and saves the FCM token to the user's profile.
 */
export const setupPushNotifications = async (): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await messaging().requestPermission();
  const enabled = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      await firestore().collection('users').doc(currentUser.uid).update({ fcmToken });
    }
  }

  // Listen for token refreshes
  messaging().onTokenRefresh(async token => {
    console.log('New FCM Token:', token);
    await firestore().collection('users').doc(currentUser.uid).update({ fcmToken: token });
  });
};

/**
 * Fetches the profiles of all accepted guardians for a given user.
 * @param uid The UID of the user.
 * @returns A promise that resolves to an array of guardian user profiles.
 */
export const getGuardians = async (uid: string): Promise<User[]> => {
  const guardianshipsRef = firestore()
    .collection('users')
    .doc(uid)
    .collection('guardianships');

  const snapshot = await guardianshipsRef.where('status', '==', 'accepted').get();

  if (snapshot.empty) {
    return [];
  }

  // The guardianUid is the ID of the user who is the guardian, not the doc ID of the subcollection
  const guardianIds = snapshot.docs.map(doc => doc.id);

  // Fetch the profile for each guardian ID
  const guardianPromises = guardianIds.map(id =>
    firestore().collection('users').doc(id).get()
  );

  const guardianDocs = await Promise.all(guardianPromises);

  const guardians = guardianDocs
    .filter(doc => doc.exists)
    .map(doc => doc.data() as User);

  return guardians;
};
