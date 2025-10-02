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
