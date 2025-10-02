import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  SafeAreaView,
} from 'react-native';

// Placeholder data type for a guardian
interface Guardian {
  id: string;
  name: string;
}

const GuardianCircleScreen = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);

  const renderGuardian = ({ item }: { item: Guardian }) => (
    <View style={styles.guardianItem}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meu Círculo de Guardiãs</Text>
      <FlatList
        data={guardians}
        renderItem={renderGuardian}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Você ainda não adicionou nenhuma guardiã.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <Button
          title="Convidar Nova Guardiã"
          onPress={() => {
            /* TODO: Implementar navegação para tela de convite */
          }}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guardianItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  footer: {
    padding: 20,
  },
});

export default GuardianCircleScreen;
