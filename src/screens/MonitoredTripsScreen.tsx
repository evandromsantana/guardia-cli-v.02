import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getMonitoredTrips, MonitoredTrip } from '../firebase/tripService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// This screen will be part of a new "Monitoring" stack or the root stack
type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const MonitoredTripsScreen = ({ navigation }: Props) => {
  const [trips, setTrips] = useState<MonitoredTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const monitoredTrips = await getMonitoredTrips();
        setTrips(monitoredTrips);
      } catch (error) {
        console.error("Failed to fetch monitored trips:", error);
      } finally {
        setLoading(false);
      }
    };

    // Re-fetch when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrips();
    });

    return unsubscribe;
  }, [navigation]);

  const renderTripItem = ({ item }: { item: MonitoredTrip }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => {
        // Navigate to the map view for this trip
        // We'll reuse TripMonitoringScreen for now, but it needs modification
        navigation.navigate('TripMonitoring', {
          tripId: item.tripId,
          mode: 'monitoring',
        });
      }}
    >
      <Text style={styles.userName}>{item.user.displayName}</Text>
      <Text style={styles.destination}>Indo para: {item.destinationAddress}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Buscando trajetos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.tripId}
        ListHeaderComponent={<Text style={styles.title}>Trajetos Monitorados</Text>}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>Ninguém que você monitora está em um trajeto ativo.</Text>
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
  tripItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  destination: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default MonitoredTripsScreen;
