import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth } from '../../firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const SignInScreen = () => {
  useEffect(() => {
    // O webClientId é obtido do seu arquivo google-services.json
    // no android, ou GoogleService-Info.plist no iOS.
    // Geralmente está em client -> oauth_client -> client_id de tipo 3
    GoogleSignin.configure({
      webClientId: 'SEU_WEB_CLIENT_ID_AQUI', // Cole seu Web Client ID aqui
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { user } = await GoogleSignin.signIn();

      if (!user.idToken) {
        throw new Error("O token de ID do Google não foi recebido.");
      }
      
      Alert.alert('Sucesso', 'Login com Google realizado. Autenticando com Firebase...');

      const googleCredential = GoogleAuthProvider.credential(user.idToken);

      // Autentica com Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log('Usuário autenticado no Firebase:', userCredential.user);
      Alert.alert('Firebase', 'Usuário autenticado com sucesso!');

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelado', 'Login cancelado pelo usuário.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Aguarde', 'O login já está em progresso.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Erro', 'Serviços do Google Play não estão disponíveis ou desatualizados.');
      } else {
        Alert.alert('Erro', `Ocorreu um erro no login: ${error.message}`);
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login com Google" onPress={signIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
