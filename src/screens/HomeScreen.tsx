import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
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
      <Text>Bem-vindo, {auth().currentUser?.displayName}!</Text>
      <Button title="Sair" onPress={handleSignOut} />
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
    marginBottom: 20,
  },
});

export default HomeScreen;
