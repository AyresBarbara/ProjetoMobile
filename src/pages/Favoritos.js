import { View, Text, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import Livro from './livro/BookCard';
import { useFavorites } from '../context/FavoritosContext';

export default function Favoritos({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <Text style={[styles.titulo, isTablet && styles.tituloTablet]}>
        📚 Meus Favoritos
      </Text>
      {favorites.length === 0 ? (
        <Text style={[styles.vazio, isTablet && styles.vazioTablet]}>
          Nenhum livro favoritado ainda.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.key}
          contentContainerStyle={isTablet && styles.listContentTablet}
          renderItem={({ item }) => (
            <View style={isTablet && styles.itemContainerTablet}>
              <Livro
                data={item}
                onPress={() => navigation.navigate('BookDetails', { livro: item })}
              />
              <TouchableOpacity
                style={[styles.botaoRemover, isTablet && styles.botaoRemoverTablet]}
                onPress={() => removeFavorite(item.key)}
              >
                <Text style={[styles.textoRemover, isTablet && styles.textoRemoverTablet]}>
                  Remover dos Favoritos
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  containerTablet: {
    padding: 24,
  },
  titulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tituloTablet: {
    fontSize: 28,
    marginBottom: 24,
  },
  vazio: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
  },
  vazioTablet: {
    fontSize: 18,
    marginTop: 100,
  },
  listContentTablet: {
    alignItems: 'center',
  },
  itemContainerTablet: {
    maxWidth: 600,
    width: '100%',
  },
  botaoRemover: {
    backgroundColor: '#ff5555',
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  botaoRemoverTablet: {
    padding: 14, 
    marginBottom: 28,
    borderRadius: 10,
  },
  textoRemover: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  textoRemoverTablet: {
    fontSize: 16,
  },
});
