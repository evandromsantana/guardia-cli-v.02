import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import { endSafeTrip, updateTripLocation } from '../firebase/tripService';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'TripMonitoring'>;

const TripMonitoringScreen = ({ route, navigation }: Props) => {
  const { tripId, mode } = route.params;
  const [endingTrip, setEndingTrip] = useState(false);
  const [position, setPosition] = useState<Region | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mode === 'self') {
      // User is on their own trip, get location from device GPS
      let watchId: number | null = null;

      const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Permissão de localização negada.');
            return;
          }
        }

        watchId = Geolocation.watchPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            const newPosition = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
            setPosition(newPosition);
            mapRef.current?.animateToRegion(newPosition, 1000);
            updateTripLocation(tripId, { latitude, longitude }).catch(console.error);
          },
          err => setError(err.message),
          { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 },
        );
      };

      requestLocationPermission();

      return () => {
        if (watchId !== null) Geolocation.clearWatch(watchId);
      };
    } else {
      // User is monitoring a trip, get location from Firestore
      const subscriber = firestore()
        .collection('safeTrips')
        .doc(tripId)
        .onSnapshot(doc => {
          const data = doc.data();
          const location = data?.lastKnownLocation;
          if (location) {
            const newPosition = {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setPosition(newPosition);
            mapRef.current?.animateToRegion(newPosition, 1000);
          }
          if (data?.status === 'completed') {
            Alert.alert("Trajeto Finalizado", "A usuária chegou ao seu destino.");
          }
        });

      return () => subscriber();
    }
  }, [tripId, mode]);

  const handleEndTrip = async () => {
    setEndingTrip(true);
    try {
      await endSafeTrip(tripId);
      Alert.alert('Trajeto Finalizado', 'Seu trajeto foi concluído com segurança.', [
        { text: 'OK', onPress: () => navigation.navigate('App') },
      ]);
    } catch (e: any) {
      Alert.alert('Erro', 'Não foi possível finalizar o trajeto.');
      setEndingTrip(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {position ? (
        <MapView ref={mapRef} style={styles.map} initialRegion={position}>
          <Marker coordinate={position} title="Posição da Usuária" />
        </MapView>
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>{error ? `Erro: ${error}` : 'Obtendo localização...'}</Text>
        </View>
      )}
      {mode === 'self' && (
        <View style={styles.footer}>
          <Button
            title={endingTrip ? 'Finalizando...' : 'Finalizar Trajeto'}
            onPress={handleEndTrip}
            disabled={endingTrip}
            color="#E53935"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default TripMonitoringScreen;
