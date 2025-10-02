import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { User } from './userService';

/**
 * Starts a new safe trip and stores it in Firestore.
 * @param destinationAddress The address of the destination.
 * @param watcherUids An array of user UIDs who will be watching the trip.
 * @returns The ID of the newly created trip document.
 */
export const startSafeTrip = async (
  destinationAddress: string,
  watcherUids: string[]
): Promise<string> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('Nenhum usuário logado para iniciar um trajeto.');
  }

  const watchersMap = watcherUids.reduce((acc, uid) => {
    acc[uid] = true;
    return acc;
  }, {} as { [key: string]: boolean });

  const tripRef = await firestore().collection('safeTrips').add({
    userId: currentUser.uid,
    destinationAddress,
    watchers: watchersMap,
    status: 'active',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return tripRef.id;
};

/**
 * Ends a safe trip by updating its status to 'completed'.
 * @param tripId The ID of the trip document to end.
 */
export const endSafeTrip = async (tripId: string): Promise<void> => {
  const tripRef = firestore().collection('safeTrips').doc(tripId);
  await tripRef.update({ status: 'completed' });
};

/**
 * Updates the user's last known location for a specific trip.
 * @param tripId The ID of the trip document.
 * @param location The user's current location.
 */
export const updateTripLocation = async (
  tripId: string,
  location: { latitude: number; longitude: number }
): Promise<void> => {
  const tripRef = firestore().collection('safeTrips').doc(tripId);
  await tripRef.update({
    lastKnownLocation: new firestore.GeoPoint(location.latitude, location.longitude),
  });
};

export interface MonitoredTrip {
  tripId: string;
  user: User;
  destinationAddress: string;
  createdAt: firestore.Timestamp;
}

/**
 * Fetches all active trips that the current user is a watcher for.
 * NOTE: This query requires a composite index in Firestore.
 * @returns A promise that resolves to an array of monitored trip objects.
 */
export const getMonitoredTrips = async (): Promise<MonitoredTrip[]> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    return [];
  }

  const tripsRef = firestore().collection('safeTrips');
  const snapshot = await tripsRef
    .where('status', '==', 'active')
    .where(`watchers.${currentUser.uid}`, '==', true)
    .get();

  if (snapshot.empty) {
    return [];
  }

  const tripPromises = snapshot.docs.map(async (doc) => {
    const tripData = doc.data();
    const userDoc = await firestore().collection('users').doc(tripData.userId).get();

    if (userDoc.exists) {
      return {
        tripId: doc.id,
        user: userDoc.data() as User,
        destinationAddress: tripData.destinationAddress,
        createdAt: tripData.createdAt,
      };
    }
    return null;
  });

  const trips = await Promise.all(tripPromises);

  // Filter out any nulls
  return trips.filter((trip): trip is MonitoredTrip => trip !== null);
};
