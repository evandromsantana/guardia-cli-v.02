import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// This is a simplified navigation type for demonstration.
// For a complex app, you might use CompositeNavigationProp.
type HomeScreenNavigationProp = NativeStackNavigationProp<any>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tela Principal</Text>
      <Text style={styles.welcomeText}>Bem-vindo, {auth().currentUser?.displayName}!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Novo Trajeto"
          onPress={() => navigation.navigate('StartTrip')}
        />
        <View style={{ marginTop: 20 }} />
        <Button title="Sair" onPress={handleSignOut} color="#888" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 60,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
  }
});

export default HomeScreen;
