import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const UsuarioScreen = () => (
  <ScrollView contentContainerStyle={styles.container}>
    {/* Foto de perfil */}
    <Image
      source={{ uri: 'https://i.pinimg.com/736x/18/22/b8/1822b85b882a0b02bd03890da2754c8c.jpg' }} // URL de una imagen de ejemplo
      style={styles.profilePicture}
    />

    {/* Nombre del usuario */}
    <Text style={styles.userName}>Juan Pérez</Text>

    {/* Título de las tarjetas */}
    <Text style={styles.sectionTitle}>Tarjetas vinculadas:</Text>

    {/* Lista de tarjetas */}
    <View style={styles.card}>
      <Text style={styles.cardText}>Visa - Terminación 1234</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.cardText}>MasterCard - Terminación 5678</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.cardText}>American Express - Terminación 9012</Text>
    </View>
  </ScrollView>
);

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 20,
  },
  card: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  cardText: {
    fontSize: 16,
    color: '#444',
  },
});

export default UsuarioScreen;

