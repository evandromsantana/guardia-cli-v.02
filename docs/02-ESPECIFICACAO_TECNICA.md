# Especificação Técnica: Guardiã

**Versão:** 1.2 (Login Social)

## 1. Stack Tecnológico

* **Frontend (Aplicativo):** React Native, React Navigation (Navegação), React Query (Gerenciamento de Estado/Dados), Zod (Validação), React Native Maps (Mapas), `@react-native-google-signin/google-signin` (Autenticação Social)
* **Backend (BaaS):** Firebase (Authentication, Firestore, Cloud Storage, Cloud Functions)
* **Banco de Dados:** Firestore (NoSQL)
* **Mapas e Geolocalização:** Google Maps Platform (APIs de Mapa Estático e Dinâmico)
* **Alertas SMS:** Twilio (ou serviço similar, integrado via Cloud Functions)

## 2. Modelo de Dados (Firestore/NoSQL)

No Firestore, os dados são organizados em coleções de documentos.

#### Coleção `users`

*Documentos nesta coleção terão o mesmo ID do usuário no Firebase Authentication.*

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `uid` | string | ID do Documento (o mesmo do Firebase Auth) |
| `displayName` | string | Nome de exibição do usuário (vindo do Google) |
| `email` | string | E-mail do usuário (vindo do Google) |
| `phoneNumber` | string | (Opcional) Número do celular do usuário |
| `photoUrl` | string | (Opcional) URL da foto de perfil (vinda do Google) |
| `bio` | string | (Opcional) Pequena biografia do usuário |
| `timeBalance` | number | Saldo de tempo do usuário em minutos |
| `memberSince` | timestamp | Data de criação da conta |
| `location` | object | (Opcional) Última localização conhecida do usuário |


#### Coleção `guardianships`

*Subcoleção dentro de cada documento de usuário.*

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `guardianUid` | string | ID do usuário que é o guardião |
| `status` | string | 'pending', 'accepted' |

#### Coleção `safeTrips`

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `userId` | string | ID do usuário em viagem |
| `status` | string | 'active', 'completed', 'cancelled' |
| `destinationAddress`| string | Endereço de destino |
| `watchers` | map | Mapa com os UIDs dos guardiões observando |

#### Coleção `alerts`

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `userId` | string | ID do usuário em perigo |
| `status` | string | 'active', 'resolved' |
| `lastKnownLocation`| geopoint | Coordenadas em tempo real |
| `audioFileUrl` | string | (v1.1) Link para o áudio no Cloud Storage |

## 3. Autenticação

A autenticação de usuários é gerenciada pelo **Firebase Authentication**, configurado para usar o provedor **Google Sign-In**.

O fluxo é o seguinte:
1. O usuário inicia o processo de login através do botão "Continuar com Google" no aplicativo.
2. A biblioteca `@react-native-google-signin/google-signin` gerencia o fluxo nativo de autenticação com a conta Google do dispositivo.
3. Após a autenticação bem-sucedida com o Google, um `idToken` é obtido.
4. Este token é usado para criar uma credencial do Firebase, que por sua vez é usada para autenticar o usuário no backend do Firebase (`signInWithCredential`).
5. Se for o primeiro login do usuário, um perfil correspondente é criado na coleção `users` do Firestore, utilizando os dados (nome, email, foto) fornecidos pelo Google.
