
import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (book) => {
    setFavorites(prev => {

      // Validação para evitar duplicatas
      if (prev.some(fav => fav.key === book.key)) {
        return prev;
      }
      return [...prev, book];
    });
  };

  const removeFavorite = (bookKey) => {
    setFavorites(prev => prev.filter(book => book.key !== bookKey));
  };

  const isFavorite = (bookKey) => {
    return favorites.some(book => book.key === bookKey);
  };

  const toggleFavorite = (book) => {
    if (isFavorite(book.key)) {
      removeFavorite(book.key);
    } else {
      addFavorite(book);
    }
  };

    // O método provider disponibliza dados e funções para que seus componentes filhos possam acessá-las diretamente
  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Função que garante o contexto dos favoritos e retorna os dados para os componentes que o reutilizam
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }
  return context;
};