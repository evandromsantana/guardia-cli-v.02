import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

export const onSafeTripUpdate = functions.firestore
  .document("safeTrips/{tripId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Check if the trip status changed from 'active' to 'completed'
    if (beforeData.status === "active" && afterData.status === "completed") {
      functions.logger.log(`Trip ${context.params.tripId} completed.`);

      const userId = afterData.userId;
      const watchers = afterData.watchers;

      if (!watchers || Object.keys(watchers).length === 0) {
        functions.logger.log("No watchers for this trip.");
        return null;
      }

      // Get the name of the user who completed the trip
      const userDoc = await db.collection("users").doc(userId).get();
      const userName = userDoc.data()?.displayName || "Uma usuária";

      const watcherIds = Object.keys(watchers);

      // Get the FCM tokens for all watchers
      const tokenPromises = watcherIds.map((uid) =>
        db.collection("users").doc(uid).get()
      );
      const tokenDocs = await Promise.all(tokenPromises);

      const tokens = tokenDocs
        .map((doc) => doc.data()?.fcmToken)
        .filter((token): token is string => !!token);

      if (tokens.length === 0) {
        functions.logger.log("No FCM tokens found for watchers.");
        return null;
      }

      // Send a notification to all watchers
      const payload: admin.messaging.MessagingPayload = {
        notification: {
          title: "Chegada Segura!",
          body: `${userName} chegou bem ao seu destino.`,
        },
      };

      functions.logger.log(`Sending notification to ${tokens.length} tokens.`);
      return messaging.sendToDevice(tokens, payload);
    }

    return null;
  });
