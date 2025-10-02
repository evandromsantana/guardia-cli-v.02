import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { User } from './userService'; // Import User interface

/**
 * Sends a guardian invitation to a user by their email.
 * @param targetEmail The email of the user to invite.
 */
export const sendGuardianInvite = async (targetEmail: string): Promise<void> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('Nenhum usuário logado para enviar o convite.');
  }

  if (currentUser.email?.toLowerCase() === targetEmail.toLowerCase()) {
    throw new Error('Você não pode convidar a si mesmo.');
  }

  // Find the target user by email
  const usersRef = firestore().collection('users');
  const querySnapshot = await usersRef.where('email', '==', targetEmail.toLowerCase()).limit(1).get();

  if (querySnapshot.empty) {
    throw new Error(`Nenhum usuário encontrado com o e-mail: ${targetEmail}`);
  }

  const targetUserDoc = querySnapshot.docs[0];
  const targetUid = targetUserDoc.id;

  // Create an invite document
  const invitesRef = firestore().collection('invites');
  await invitesRef.add({
    inviterUid: currentUser.uid,
    targetUid: targetUid,
    status: 'pending',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export interface PendingInvite {
  inviteId: string;
  inviter: User;
}

/**
 * Fetches all pending invitations for the currently logged-in user.
 * @returns A promise that resolves to an array of pending invite objects.
 */
export const getPendingInvites = async (): Promise<PendingInvite[]> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    return [];
  }

  const invitesRef = firestore().collection('invites');
  const snapshot = await invitesRef
    .where('targetUid', '==', currentUser.uid)
    .where('status', '==', 'pending')
    .get();

  if (snapshot.empty) {
    return [];
  }

  const invitePromises = snapshot.docs.map(async (doc) => {
    const inviteData = doc.data();
    const inviterDoc = await firestore().collection('users').doc(inviteData.inviterUid).get();

    if (inviterDoc.exists) {
      return {
        inviteId: doc.id,
        inviter: inviterDoc.data() as User,
      };
    }
    return null;
  });

  const invites = await Promise.all(invitePromises);

  // Filter out any nulls (if an inviter's profile was deleted)
  return invites.filter((invite): invite is PendingInvite => invite !== null);
};

/**
 * Responds to a pending invitation.
 * @param inviteId The ID of the invitation document.
 * @param response The response, either 'accepted' or 'declined'.
 */
export const respondToInvite = async (inviteId: string, response: 'accepted' | 'declined'): Promise<void> => {
  const inviteRef = firestore().collection('invites').doc(inviteId);

  if (response === 'declined') {
    await inviteRef.update({ status: 'declined' });
    return;
  }

  // If accepted, use a batch to ensure atomicity
  const batch = firestore().batch();

  const inviteDoc = await inviteRef.get();
  if (!inviteDoc.exists) {
    throw new Error("Convite não encontrado.");
  }
  const inviteData = inviteDoc.data()!;

  // 1. Update the invite status
  batch.update(inviteRef, { status: 'accepted' });

  // 2. Create the guardianship link for the inviter
  const guardianshipRef = firestore()
    .collection('users')
    .doc(inviteData.inviterUid)
    .collection('guardianships')
    .doc(inviteData.targetUid);
  
  batch.set(guardianshipRef, { status: 'accepted' });

  await batch.commit();
};
