// src/pages/NearbyLibraries.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert 
} from 'react-native';
import * as Location from 'expo-location';

const NearbyLibraries = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      console.log('Solicitando permissão de localização...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permissão de localização negada. Ative a localização para encontrar bibliotecas próximas.');
        setLoading(false);
        return;
      }

      console.log('Obtendo posição atual...');
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      console.log('Localização obtida:', location.coords);
      setLocation(location);
      
      // Buscar bibliotecas
      await findNearbyPlaces(location.coords.latitude, location.coords.longitude);
      
    } catch (err) {
      console.error('Erro na localização:', err);
      setError('Erro ao obter localização: ' + err.message);
      setLoading(false);
    }
  };

  const findNearbyPlaces = async (lat, lng) => {
    try {
      console.log('Buscando locais próximos...');
      
      // API gratuita - OpenStreetMap Overpass
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="library"](around:5000,${lat},${lng});
          node["shop"="books"](around:5000,${lat},${lng});
          way["amenity"="library"](around:5000,${lat},${lng});
          way["shop"="books"](around:5000,${lat},${lng});
        );
        out center;
      `;

      const encodedQuery = encodeURIComponent(overpassQuery);
      const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
      
      console.log('Fazendo requisição para:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      if (data.elements && data.elements.length > 0) {
        const places = data.elements.map((place, index) => {
          const placeLat = place.lat || (place.center && place.center.lat) || lat;
          const placeLon = place.lon || (place.center && place.center.lon) || lng;
          
          return {
            id: place.id || index.toString(),
            name: place.tags?.name || `Biblioteca ${index + 1}`,
            type: place.tags?.amenity === 'library' ? 'biblioteca' : 'livraria',
            address: place.tags?.['addr:street'] || 'Endereço não disponível',
            latitude: placeLat,
            longitude: placeLon,
            distance: calculateDistance(lat, lng, placeLat, placeLon)
          };
        });
        
        console.log('Locais processados:', places);
        setLibraries(places);
      } else {
        // Fallback: criar dados de exemplo baseados na localização
        console.log('Nenhum local encontrado, criando dados de exemplo...');
        createSampleLibraries(lat, lng);
      }
      
    } catch (err) {
      console.error('Erro na busca:', err);
      // Fallback em caso de erro na API
      createSampleLibraries(lat, lng);
    } finally {
      setLoading(false);
    }
  };

  const createSampleLibraries = (lat, lng) => {
    // Criar alguns locais de exemplo baseados na localização real
    const sampleLibraries = [
      {
        id: '1',
        name: 'Biblioteca Central',
        type: 'biblioteca',
        address: 'Próximo à sua localização',
        latitude: lat + 0.005,
        longitude: lng + 0.005,
        distance: calculateDistance(lat, lng, lat + 0.005, lng + 0.005)
      },
      {
        id: '2',
        name: 'Livraria do Conhecimento',
        type: 'livraria',
        address: 'Zona central',
        latitude: lat - 0.003,
        longitude: lng + 0.002,
        distance: calculateDistance(lat, lng, lat - 0.003, lng + 0.002)
      },
      {
        id: '3',
        name: 'Biblioteca Municipal',
        type: 'biblioteca',
        address: 'Área urbana',
        latitude: lat + 0.001,
        longitude: lng - 0.004,
        distance: calculateDistance(lat, lng, lat + 0.001, lng - 0.004)
      }
    ];
    
    setLibraries(sampleLibraries);
    setError('Dados de exemplo (API temporariamente indisponível)');
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? 
      `${Math.round(distance * 1000)} m` : 
      `${distance.toFixed(1)} km`;
  };

  const openInMaps = (lat, lon, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${name}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas');
      }
    });
  };

  const retryLocation = () => {
    setLoading(true);
    setError(null);
    setLibraries([]);
    getLocation();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
        <Text style={styles.loadingSubtext}>Procurando bibliotecas próximas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Locais de Leitura Próximos</Text>
      
      {error && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>{error}</Text>
        </View>
      )}
      
      <Text style={styles.subtitle}>
        {libraries.length > 0 ? `Encontrados ${libraries.length} locais próximos` : 'Buscando locais...'}
      </Text>
      
      {libraries.length === 0 && !loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Nenhum local encontrado</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryLocation}>
            <Text style={styles.retryButtonText}>🔄 Buscar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={libraries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.libraryItem}
              onPress={() => openInMaps(item.latitude, item.longitude, item.name)}
            >
              <Text style={styles.libraryName}>
                {item.type === 'biblioteca' ? '📚 ' : '📖 '}{item.name}
              </Text>
              <Text style={styles.libraryDistance}>📍 {item.distance}</Text>
              <Text style={styles.libraryType}>
                {item.type === 'biblioteca' ? 'Biblioteca Pública' : 'Livraria'}
              </Text>
              <Text style={styles.libraryAddress}>
                🏠 {item.address}
              </Text>
              <Text style={styles.mapsLink}>
                🗺️ Toque para ver no Maps
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <TouchableOpacity style={styles.retryButton} onPress={retryLocation}>
        <Text style={styles.retryButtonText}>🔄 Buscar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  libraryItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  libraryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  libraryDistance: {
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  libraryType: {
    color: '#e67e22',
    fontWeight: '500',
    marginBottom: 4,
  },
  libraryAddress: {
    color: '#34495e',
    marginBottom: 4,
    lineHeight: 18,
  },
  mapsLink: {
    color: '#27ae60',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default NearbyLibraries;