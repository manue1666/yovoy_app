import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Importa tus vistas
import RutaScreen from "./components/RutaScreen";
import TarjetaScreen from "./components/TarjetaScreen";
import UsuarioScreen from "./components/UsuarioScreen";
import LoginScreen from "./components/LoginScreen"; // Nueva pantalla de Login
import RegisterScreen from "./components/RegisterScreen"; // Nueva pantalla de Registro

// Crea el Tab Navigator y el Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente para el Bottom Tab Navigator (pantallas principales)
const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Tarjeta" // Página inicial
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Ruta") {
                        iconName = "directions";
                    } else if (route.name === "Tarjeta") {
                        iconName = "credit-card";
                    } else if (route.name === "Usuario") {
                        iconName = "person";
                    }

                    // Retorna el ícono correspondiente
                    return <Icon name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor: "#800080",
                tabBarInactiveTintColor: "gray",
                // Estilo de la barra
                tabBarStyle: {
                    backgroundColor: "#f2f2f2", // Fondo de la barra
                    height: 100, // Altura de la barra
                    paddingBottom: 10, // Espaciado interno inferior
                },
                tabBarItemStyle: {
                    paddingVertical: 15, // Espaciado de los ítems
                },
                tabBarLabelStyle: {
                    fontSize: 15, // Tamaño del texto
                    fontWeight: "bold", // Estilo del texto
                },
            })}
        >
            <Tab.Screen name="Ruta" component={RutaScreen} />
            <Tab.Screen name="Tarjeta" component={TarjetaScreen} />
            <Tab.Screen name="Usuario" component={UsuarioScreen} />
        </Tab.Navigator>
    );
};

// Componente principal de la aplicación
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Pantallas de autenticación */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }} // Oculta el header en Login
                />
                <Stack.Screen
                    name="Registro"
                    component={RegisterScreen}
                    options={{ headerShown: false }} // Oculta el header en Registro
                />

                {/* Pantallas principales (Bottom Tab Navigator) */}
                <Stack.Screen
                    name="Main"
                    component={MainTabs}
                    options={{ headerShown: false }} // Oculta el header en las pantallas principales
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;