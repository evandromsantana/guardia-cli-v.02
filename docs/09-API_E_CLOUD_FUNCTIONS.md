# Referência de API e Cloud Functions

Este documento detalha a interface de comunicação entre o frontend e o backend (Firebase), incluindo as funções server-side (Cloud Functions) que orquestram a lógica de negócio crítica.

## 1. Frontend Services (`src/services/`)

Funções que o aplicativo chamará para interagir com o Firestore.

#### `authService.ts`

* `signInWithGoogle()`: Orquestra o fluxo de autenticação com Google. Se o usuário for novo, chama `userService.createUserProfile` para criar um perfil no Firestore com os dados do Google.
* `signOut()`: Desloga o usuário do Firebase e do Google Sign-In.

#### `userService.ts`

* `createUserProfile(user, displayName, phoneNumber?, photoURL?)`: Cria o documento do usuário na coleção `users` após o cadastro, usando os dados providenciados (seja do fluxo de social login ou outro).
* `getUserProfile(uid)`: Busca os dados de um perfil de usuário.

#### `guardiansService.ts`

* `inviteGuardian(targetPhoneNumber)`: Cria um convite (possivelmente em uma coleção `invites`) e dispara uma Cloud Function para notificar o alvo.
* `respondToInvite(inviteId, status)`: Atualiza o status de um convite para 'accepted' ou 'declined' e, em caso de aceite, estabelece a relação na subcoleção `guardianships`.
* `listGuardians(uid)`: Retorna a lista de guardiãs de uma usuária.

#### `chatService.ts`

* `createChatRoom(user1Id, user2Id)`: Cria ou retorna uma sala de chat existente entre dois usuários.
* `getChatsForUser(uid)`: Retorna a lista de chats de um usuário.
* `getMessagesForChat(chatId, callback)`: Escuta as mensagens de um chat em tempo real.
* `sendMessage(chatId, senderId, text)`: Envia uma mensagem para um chat.

#### `tripService.ts`

* `startSafeTrip(uid, destination, watchers)`: Cria um novo documento na coleção `safeTrips`.
* `updateTripLocation(tripId, currentLocation)`: Atualiza a localização em tempo real do trajeto.
* `endSafeTrip(tripId)`: Muda o status do trajeto para 'completed' e dispara uma Cloud Function para notificar os observadores.

## 2. Cloud Functions (Lógica no Servidor)

Funções críticas que rodam no ambiente seguro do Firebase.

* **`onPanicAlertTriggered(data)`**
  * **Gatilho:** HTTPS (chamada diretamente pelo app).
  * **Ação:**
        1. Recebe o `uid` da usuária, sua `lastKnownLocation` e, opcionalmente, a `audioFileUrl`.
        2. Busca o Círculo de Guardiãs da usuária no Firestore.
        3. Para cada guardiã, envia uma notificação PUSH (via Firebase Cloud Messaging) e um SMS (via Twilio) com a mensagem de alerta e o `deepLink` para o Painel do Guardião.
        4. Cria um documento na coleção `alerts` com a localização e a URL do áudio.

* **`onSafeTripEnded(tripId)`**
  * **Gatilho:** Firestore (na atualização de um documento em `safeTrips` para status 'completed').
  * **Ação:**
        1. Busca os `watchers` (observadores) do trajeto.
        2. Envia uma notificação PUSH para cada um informando que a usuária "chegou bem".

* **`sendGuardianInviteNotification(inviteData)`**
  * **Gatilho:** HTTPS ou Firestore (na criação de um novo convite).
  * **Ação:**
        1. Verifica se o número de telefone convidado corresponde a um usuário existente.
        2. Se sim, envia uma notificação PUSH in-app sobre o convite.
        3. Se não, poderia futuramente enviar um SMS com um link para baixar o aplicativo.
