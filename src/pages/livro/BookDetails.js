import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import api from '../../services/Api';
import { traduzirTexto } from '../../services/TraducaoApi';
import { useFavorites } from '../../context/FavoritosContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const cacheMemoria = {};

export default function BookDetails({ route }) {
  const { livro } = route.params;
  const [descricao, setDescricao] = useState('');
  const [tituloTraduzido, setTituloTraduzido] = useState(livro.title);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Hook para obter as dimensões da tela
  const { width } = useWindowDimensions();

  const isTablet = width >= 600;

  useEffect(() => {
    const fetchDescricao = async () => {
      try {

        // Chave do cache baseada no ID do livro
        const chaveCache = livro.key;

        //  Verifica se já existe no cache
        if (cacheMemoria[chaveCache]) {
          const { tituloPT, sinopsePT } = cacheMemoria[chaveCache];
          setTituloTraduzido(tituloPT);
          setDescricao(sinopsePT);
          console.log('📚 Retornando do cache em memória:', chaveCache);
          return;
        }

        // Se não estiver em cache, busca da api e posteriormente traduz
        const response = await api.get(`${livro.key}.json`);
        let desc = response.data.description;

        if (desc) {
          if (typeof desc === 'object') desc = desc.value;
        } else {
          desc = 'Sinopse não disponível.';
        }
   
        const [tituloPT, sinopsePT] = await Promise.all([
          traduzirTexto(livro.title),
          traduzirTexto(desc),
        ]);
  
        setTituloTraduzido(tituloPT);
        setDescricao(sinopsePT);
  
        cacheMemoria[chaveCache] = { tituloPT, sinopsePT };
      } catch (err) {
        setDescricao('Sinopse não disponível.');
      }
    };
    fetchDescricao();
  }, [livro.key]);

  const imageUrl = livro.cover_i
    ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
    : null;

  return (
    <ScrollView
      style={[styles.container, isTablet && styles.containerTablet]}
      contentContainerStyle={isTablet && styles.scrollContentTablet}
    >

     <TouchableOpacity 
      style={styles.favoriteButton}
      onPress={() => toggleFavorite(livro)}
    >
      <Icon 
        name={isFavorite(livro.key) ? "favorite" : "favorite-border"} 
        size={28} 
        color={isFavorite(livro.key) ? "#FF6B6B" : "#666"} 
      />
    </TouchableOpacity>

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.cover, isTablet && styles.coverTablet]}
        />
      )}
      <View style={[styles.infoContainer, isTablet && styles.infoContainerTablet]}>
        <Text style={[styles.titulo, isTablet && styles.tituloTablet]}>
          {tituloTraduzido}
        </Text>
        {livro.author_name && (
          <Text style={[styles.author, isTablet && styles.authorTablet]}>
            {livro.author_name.join(', ')}
          </Text>
        )}
        {livro.first_publish_year && (
          <Text style={[styles.year, isTablet && styles.yearTablet]}>
            Ano: {livro.first_publish_year}
          </Text>
        )}
      </View>
      <Text style={[styles.synopsisTitle, isTablet && styles.synopsisTitleTablet]}>
        Sinopse
      </Text>
      <Text style={[styles.synopsis, isTablet && styles.synopsisTablet]}>
        {descricao}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 12,
  },
  containerTablet: {
    padding: 24,
  },
  scrollContentTablet: {
    alignItems: 'center', 
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  infoContainerTablet: {
    marginLeft: 24, 
    maxWidth: 600, 
    alignSelf: 'center', 
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  tituloTablet: {
    fontSize: 24,
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  authorTablet: {
    fontSize: 18, 
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  yearTablet: {
    fontSize: 18, 
    marginBottom: 12,
  },
  cover: {
    width: '100%',
    height: 300,
    marginBottom: 12,
    borderRadius: 8,
  },
  coverTablet: {
    height: 400,
    marginBottom: 24,
  },
  synopsisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  synopsisTitleTablet: {
    fontSize: 20, 
    marginTop: 24,
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  synopsisTablet: {
    fontSize: 16, 
    marginBottom: 24,
    maxWidth: 600, 
    alignSelf: 'center', 
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
});
