import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Home from '../pages/Home';
import BookDetails from '../pages/livro/BookDetails';
import Favoritos from '../pages/Favoritos';
import NearbyLibraries from '../pages/NearbyLibraries';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#f0f0f0',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Livros"
        component={Home}
        options={({ navigation }) => ({
          title: '📚 Biblioteca',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Favoritos')}
            >
              <Icon name="favorite" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Detalhes" component={BookDetails} />
      <Stack.Screen
        name="Favoritos"
        component={Favoritos}
        options={{ title: '❤️ Meus Favoritos' }}
      />
      <Stack.Screen
        name="NearbyLibraries"
        component={NearbyLibraries}
        options={{ title: '📍 Bibliotecas Próximas' }}
      />
    </Stack.Navigator>
  );
}
