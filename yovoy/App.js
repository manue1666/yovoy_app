import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importa tus vistas
import RutaScreen from './components/RutaScreen';
import TarjetaScreen from './components/TarjetaScreen';
import UsuarioScreen from './components/UsuarioScreen';

// Crea el Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Tarjeta" // Página inicial
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Ruta') {
              iconName = 'directions';
            } else if (route.name === 'Tarjeta') {
              iconName = 'credit-card';
            } else if (route.name === 'Usuario') {
              iconName = 'person';
            }

            // Retorna el ícono correspondiente
            return <Icon name={iconName} size={size} color={color} />;
          },


          tabBarActiveTintColor: '#800080',
          tabBarInactiveTintColor: 'gray',
          // Estilo de la barra
          tabBarStyle: {
            backgroundColor: '#f2f2f2',  // Fondo de la barra
            height: 100,                  // Altura de la barra
            paddingBottom: 10,           // Espaciado interno inferior
          },
          tabBarItemStyle: {
            paddingVertical: 15,          // Espaciado de los ítems
          },
          tabBarLabelStyle: {
            fontSize: 15,                // Tamaño del texto
            fontWeight: 'bold',          // Estilo del texto
          },
          
        })}
      >
        <Tab.Screen name="Ruta" component={RutaScreen} />
        <Tab.Screen name="Tarjeta" component={TarjetaScreen} />
        <Tab.Screen name="Usuario" component={UsuarioScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
