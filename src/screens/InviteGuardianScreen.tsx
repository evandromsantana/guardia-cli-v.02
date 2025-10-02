import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '../navigation/GuardianNavigator';
import { sendGuardianInvite } from '../firebase/guardianService';

type InviteGuardianScreenNavigationProp = NativeStackNavigationProp<
  GuardianStackParamList,
  'InviteGuardian'
>;

type Props = {
  navigation: InviteGuardianScreenNavigationProp;
};

const InviteGuardianScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }
    setLoading(true);
    try {
      await sendGuardianInvite(email.trim());
      Alert.alert(
        'Sucesso!',
        'Convite enviado com sucesso. Ele aparecerá na sua lista assim que for aceito.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Erro ao Enviar Convite', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>E-mail da pessoa a ser convidada:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title={loading ? 'Enviando...' : 'Enviar Convite'}
          onPress={handleInvite}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default InviteGuardianScreen;
