"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSafeTripUpdate = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
exports.onSafeTripUpdate = functions.firestore
    .document("safeTrips/{tripId}")
    .onUpdate(async (change, context) => {
    var _a;
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
        const userName = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.displayName) || "Uma usuária";
        const watcherIds = Object.keys(watchers);
        // Get the FCM tokens for all watchers
        const tokenPromises = watcherIds.map((uid) => db.collection("users").doc(uid).get());
        const tokenDocs = await Promise.all(tokenPromises);
        const tokens = tokenDocs
            .map((doc) => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.fcmToken; })
            .filter((token) => !!token);
        if (tokens.length === 0) {
            functions.logger.log("No FCM tokens found for watchers.");
            return null;
        }
        // Send a notification to all watchers
        const payload = {
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
//# sourceMappingURL=index.js.map