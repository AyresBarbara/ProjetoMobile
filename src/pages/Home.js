import { useEffect, useState } from 'react';

import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text, useWindowDimensions, TouchableOpacity} from 'react-native';

import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';

import { buscarLivros, carregarLivrosPadrao } from '../services/LivroService';

export default function Home({ navigation }) {
  
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false); 
  const [erro, setErro] = useState(null);
  const livrosPadrao = ['harry potter', 'senhor dos aneis', 'o pequeno principe'];
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;

  // Carrega a lista e chama a função de livros iniciais/padrão
  useEffect(() => {
    const carregar = async () => {
      setLoading(true); 

      try {
        const resultados = await carregarLivrosPadrao(livrosPadrao);
        setLivros(resultados); 
      } catch (err) {
        console.error('Erro ao carregar livros padrão:', err);
        setErro('Falha ao carregar lista inicial.'); 
      } finally {
        setLoading(false); 
      }
    };
    carregar(); 
  }, []); 

  const handleBuscarLivros = async () => {
    if (!busca.trim()) return; 
    setLoading(true); 
    setErro(null); 
    try {
      const resultados = await buscarLivros(busca);
      setLivros(resultados); 
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setErro('Falha ao buscar livros. Tente novamente.'); 
    } finally {
      setLoading(false); 
    }
  };

  // Define toda a estrutura visual e as dimensões (celular ou tablet) da sua tela  
  return (
    <SafeAreaView style={styles.container}>
      {/* Componente de busca, com estilo adaptado para tablet */}
      <SearchBar
        value={busca}
        onChangeText={setBusca}
        onSubmitEditing={handleBuscarLivros}
        style={isTablet ? styles.searchBarTablet : styles.searchBar}
      />
      <TouchableOpacity 
        style={[
          styles.menuButton,
          isTablet && styles.menuButtonTablet
        ]}
        onPress={() => navigation.navigate('NearbyLibraries')}
      >
        <Text style={styles.menuButtonText}>📍 Encontrar Bibliotecas Próximas</Text>
      </TouchableOpacity>
      {}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={isTablet ? 'large' : 'small'} color="#333" />
        </View>
      )}
      {}
      {!loading && erro && (
        <Text style={[styles.erroTexto, isTablet && styles.erroTextoTablet]}>
          {erro}
        </Text>
      )}
      {}
      {!loading && !erro && (
        <BookList
          livros={livros}
          onSelect={(livro) => navigation.navigate('Detalhes', { livro })}
          isTablet={isTablet} // Passa todo o contexto de dimensões de layout do tablet para o BookList
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16, 
  },
  searchBar: {
    marginVertical: 8,
  },
  searchBarTablet: {
    marginVertical: 16,
    maxWidth: 600, 
    alignSelf: 'center', 
  },
   menuButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  menuButtonTablet: {
    padding: 16,
    marginVertical: 15,
    maxWidth: 400,
    alignSelf: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erroTexto: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  erroTextoTablet: {
    fontSize: 20, 
    marginTop: 30,
  },
});
