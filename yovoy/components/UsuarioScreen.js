import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UsuarioScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      // Obtener el userId y el token desde AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        console.log("No se encontró el userId o el token");
        setLoading(false);
        return;
      }

      // Hacer una solicitud al backend para obtener los datos del usuario
      const response = await fetch(`http://192.168.1.78:4000/api/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }

      const data = await response.json(); // Convertir la respuesta a JSON
      setUser(data.user); // Guardar los datos del usuario en el estado
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    } finally {
      setLoading(false); // Detener la carga
    }
  };

  // Ejecutar la función al cargar la pantalla
  useEffect(() => {
    fetchUserData();
  }, []);

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#800080" />
      </View>
    );
  }

  // Mostrar la vista del perfil
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Foto de perfil */}
      <Image
        source={{ uri: user?.profilePicture || 'https://i.pinimg.com/736x/18/22/b8/1822b85b882a0b02bd03890da2754c8c.jpg' }} // Usar una imagen por defecto si no hay foto de perfil
        style={styles.profilePicture}
      />

      {/* Nombre del usuario */}
      <Text style={styles.userName}>{user?.name || "Usuario"}</Text>

      {/* Correo electrónico */}
      <Text style={styles.cardText}>Correo: {user?.email || "No disponible"}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UsuarioScreen;