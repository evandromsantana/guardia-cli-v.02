import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
import Logo from '../components/common/Logo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const SignInScreen = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '285764900701-0ms0urjjbt46nupka8ba1jj0n13skjto.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      Alert.alert(
        'Login bem-sucedido!',
        `Bem-vindo(a), ${userCredential.user.displayName}!`,
      );
      console.log(userCredential);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Text style={styles.title}>Bem-vinda ao Guardiã</Text>
        <Text style={styles.subtitle}>Sua segurança em primeiro lugar.</Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Continuar com Google"
          onPress={onGoogleButtonPress}
          color="#4285F4"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default SignInScreen;
