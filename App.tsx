import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SignInScreen from './src/screens/SignIn/SignInScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <SignInScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;