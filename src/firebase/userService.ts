import firestore from '@react-native-firebase/firestore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

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
