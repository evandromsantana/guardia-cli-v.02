import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { getGuardians, User } from '../firebase/userService';
import { startSafeTrip } from '../firebase/tripService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'StartTrip'>;

const StartTripScreen = ({ navigation }: Props) => {
  const [destination, setDestination] = useState('');
  const [availableGuardians, setAvailableGuardians] = useState<User[]>([]);
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingTrip, setStartingTrip] = useState(false);

  useEffect(() => {
    const fetchGuardians = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const guardianList = await getGuardians(currentUser.uid);
          setAvailableGuardians(guardianList);
        } catch (error) {
          console.error("Failed to fetch guardians:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGuardians();
  }, []);

  const toggleGuardianSelection = (uid: string) => {
    setSelectedGuardians(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleStartTrip = async () => {
    if (!destination.trim()) {
      Alert.alert("Destino Vazio", "Por favor, informe o seu destino.");
      return;
    }
    if (selectedGuardians.length === 0) {
      Alert.alert("Nenhuma Guardiã", "Selecione ao menos uma guardiã para monitorar seu trajeto.");
      return;
    }
    setStartingTrip(true);
    try {
      const tripId = await startSafeTrip(destination.trim(), selectedGuardians);
      // Navigate to the monitoring screen, replacing the current screen
      navigation.replace('TripMonitoring', { tripId, mode: 'self' });
    } catch (error: any) {
      Alert.alert("Erro ao Iniciar Trajeto", error.message);
      setStartingTrip(false);
    }
  };

  const renderGuardianItem = ({ item }: { item: User }) => {
    const isSelected = selectedGuardians.includes(item.uid);
    return (
      <TouchableOpacity
        style={[styles.guardianItem, isSelected && styles.guardianItemSelected]}
        onPress={() => toggleGuardianSelection(item.uid)}
      >
        <Text style={styles.guardianName}>{item.displayName}</Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Buscando guardiãs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Para onde você vai?"
          value={destination}
          onChangeText={setDestination}
        />
        <Text style={styles.subtitle}>Selecione as guardiãs para te acompanhar:</Text>
        <FlatList
          data={availableGuardians}
          renderItem={renderGuardianItem}
          keyExtractor={item => item.uid}
          ListEmptyComponent={<Text style={styles.emptyText}>Você não tem guardiãs para selecionar.</Text>}
        />
      </View>
      <View style={styles.footer}>
        <Button
          title={startingTrip ? 'Iniciando...' : 'Iniciar Trajeto'}
          onPress={handleStartTrip}
          disabled={startingTrip}
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
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  guardianItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  guardianItemSelected: {
    backgroundColor: '#e0f7ff',
  },
  guardianName: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    padding: 20,
  },
});

export default StartTripScreen;
