import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  getPendingInvites,
  PendingInvite,
  respondToInvite,
} from '../firebase/guardianService';

const PendingInvitesScreen = () => {
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const pendingInvites = await getPendingInvites();
      setInvites(pendingInvites);
    } catch (error) {
      console.error("Failed to fetch invites:", error);
      Alert.alert("Erro", "Não foi possível buscar os convites pendentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleResponse = async (
    inviteId: string,
    response: 'accepted' | 'declined'
  ) => {
    try {
      await respondToInvite(inviteId, response);
      Alert.alert('Sucesso', `Convite ${response === 'accepted' ? 'aceito' : 'recusado'}.`);
      // Refresh the list
      fetchInvites();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const renderInvite = ({ item }: { item: PendingInvite }) => (
    <View style={styles.inviteItem}>
      <Text style={styles.inviteText}>
        <Text style={styles.inviterName}>{item.inviter.displayName}</Text> te convidou para ser guardiã.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Recusar"
          onPress={() => handleResponse(item.inviteId, 'declined')}
          color="#E53935"
        />
        <Button
          title="Aceitar"
          onPress={() => handleResponse(item.inviteId, 'accepted')}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Buscando convites...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={invites}
        renderItem={renderInvite}
        keyExtractor={(item) => item.inviteId}
        ListHeaderComponent={<Text style={styles.title}>Convites Pendentes</Text>}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>Você não tem nenhum convite pendente.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  inviteItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  inviteText: {
    fontSize: 16,
    marginBottom: 16,
  },
  inviterName: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PendingInvitesScreen;
