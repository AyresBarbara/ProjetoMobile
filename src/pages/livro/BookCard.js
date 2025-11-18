import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import defaultCover from '../../../assets/defaultCover.png';


import { traduzirTexto } from '../../services/TraducaoApi';


export default function Livro({ data, onPress }) {

  const [tituloTraduzido, setTituloTraduzido] = useState(data.title);
  const [imageSource, setImageSource] = useState(defaultCover);

  // Hook para obter as dimensões da tela
  const { width } = useWindowDimensions();
  
  const isTablet = width >= 600;

  // Hook que executa a tradução quando o título do livro muda
  useEffect(() => {
    traduzirTexto(data.title).then(setTituloTraduzido);
  }, [data.title]);

  // Hook para retornar as capas da Api OpenLibrary
    useEffect(() => {
    setImageSource(
      data?.cover_i
        ? { uri: `https://covers.openlibrary.org/b/id/${data.cover_i}-L.jpg` }
        : defaultCover
    );
    }, [data]);

  if (!data) return null;
  
  return (
    <TouchableOpacity
      style={[styles.card, isTablet && styles.cardTablet]}
      onPress={onPress}
    >
      
        <Image
          source={ imageSource || defaultCover }
          style={[styles.cover, isTablet && styles.coverTablet]}
        />
      
      <View style={[styles.info, isTablet && styles.infoTablet]}>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          {tituloTraduzido}
        </Text>
        {data.author_name && (
          <Text style={[styles.author, isTablet && styles.authorTablet]}>
            {data.author_name.join(', ')}
          </Text>
        )}
        {data.first_publish_year && (
          <Text style={[styles.year, isTablet && styles.yearTablet]}>
            Ano: {data.first_publish_year}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',        
    backgroundColor: '#282828',    
    borderRadius: 10,            
    margin: 10,               
    padding: 10,                 
    elevation: 4,                
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTablet: {
    margin: 16,                 
    padding: 16,                
    maxWidth: 600,              
    alignSelf: 'center',        
  },
  cover: {
    width: 80,                  
    height: 120,                
    borderRadius: 8,           
  },
  coverTablet: {
    width: 120,                 
    height: 180,               
  },
  info: {
    flex: 1,                   
    marginLeft: 10,            
    justifyContent: 'center',  
  },
  infoTablet: {
    marginLeft: 20,            
  },
  title: {
    fontSize: 16,             
    fontWeight: 'bold',
    color: '#f0f0f0',      
  },
  titleTablet: {
    fontSize: 20,            
  },
  author: {
    color: '#f0f0f0',           
    marginTop: 4,            
  },
  authorTablet: {
    fontSize: 16,            
    marginTop: 8,            
  },
  year: {
    color: '#f0f0f0',          
    marginTop: 4,         
  },
  yearTablet: {
    fontSize: 16,           
    marginTop: 8,           
  },
});
