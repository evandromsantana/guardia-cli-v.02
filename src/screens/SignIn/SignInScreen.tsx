import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { auth } from '../../firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// import LogoGuard from '../../components/Logo';

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
      const signInResponse = await GoogleSignin.signIn();

      // Para depuração: veja a estrutura completa da resposta no console
      console.log(
        'Resposta do Google Sign-In:',
        JSON.stringify(signInResponse, null, 2),
      );

      const idToken = (signInResponse as any).idToken; // Acessa o idToken diretamente

      if (!idToken) {
        throw new Error(
          'O token de ID do Google não foi recebido. Verifique a resposta do login no console.',
        );
      }

      Alert.alert(
        'Sucesso',
        'Login com Google realizado. Autenticando com Firebase...',
      );

      const googleCredential = GoogleAuthProvider.credential(idToken);

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
        Alert.alert(
          'Erro',
          'Serviços do Google Play não estão disponíveis ou desatualizados.',
        );
      } else {
        Alert.alert('Erro', `Ocorreu um erro no login: ${error.message}`);
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <LogoGuard /> */}
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
