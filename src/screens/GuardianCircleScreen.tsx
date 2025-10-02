import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { getGuardians, User } from '../firebase/userService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '../navigation/GuardianNavigator';

type GuardianCircleScreenNavigationProp = NativeStackNavigationProp<
  GuardianStackParamList,
  'GuardianCircle'
>;

type Props = {
  navigation: GuardianCircleScreenNavigationProp;
};

const GuardianCircleScreen = ({ navigation }: Props) => {
  const [guardians, setGuardians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardians = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const guardianList = await getGuardians(currentUser.uid);
          setGuardians(guardianList);
        } catch (error) {
          console.error("Failed to fetch guardians:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Re-fetch when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchGuardians();
    });

    return unsubscribe;
  }, [navigation]);

  const renderGuardian = ({ item }: { item: User }) => (
    <View style={styles.guardianItem}>
      <Text style={styles.guardianName}>{item.displayName}</Text>
      <Text style={styles.guardianEmail}>{item.email}</Text>
    </View>
  );

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
      <FlatList
        data={guardians}
        renderItem={renderGuardian}
        keyExtractor={(item) => item.uid}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>Você ainda não adicionou nenhuma guardiã.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <Button
          title="Ver Convites Pendentes"
          onPress={() => navigation.navigate('PendingInvites')}
          color="#888"
        />
        <View style={{ marginTop: 10 }} />
        <Button
          title="Convidar Nova Guardiã"
          onPress={() => navigation.navigate('InviteGuardian')}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  guardianItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  guardianName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  guardianEmail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
  },
});

export default GuardianCircleScreen;
