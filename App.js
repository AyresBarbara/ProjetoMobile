import { NavigationContainer } from '@react-navigation/native';
import Navegador from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/context/FavoritosContext';

export default function App() {
  return (
    <FavoritesProvider>
    <NavigationContainer>
      <Navegador />
    </NavigationContainer>
    </FavoritesProvider>
  );
}
