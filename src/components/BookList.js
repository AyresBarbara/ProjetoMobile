import { TouchableOpacity, FlatList } from 'react-native';

import Livro from '../pages/livro/BookCard';

export default function BookList({ livros, onSelect }) {
  return (
    <TouchableOpacity>
      <FlatList
       // Define a origem dos dados (a lista de livros)
        data={livros}
        
        // Define uma chave única para cada item da lista
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Livro
            data={item}                    
            onPress={() => onSelect(item)}  
          />
        )}

        showsVerticalScrollIndicator={true}

        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </TouchableOpacity>
  );
}

