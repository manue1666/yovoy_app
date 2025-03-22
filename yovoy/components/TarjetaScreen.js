import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TarjetaScreen = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [card, setCard] = useState(null);
  const [cardId, setCardId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener userId y token al cargar la pantalla
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (userId && token) {
        setUserId(userId);
        setToken(token);
        fetchUserCard(userId, token); // Obtener la tarjeta del usuario
      }
    };
    fetchUserData();
  }, []);

  // Obtener la tarjeta del usuario
  const fetchUserCard = async (userId, token) => {
    try {
      const response = await fetch(`http://192.168.1.81:4000/api/cards/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener la tarjeta');
      const data = await response.json();
      setCard(data.card);
      setCardId(data.card._id); // Guardar el ID de la tarjeta para usarlo en otras operaciones
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo obtener la tarjeta');
    }
  };

  // Crear una nueva tarjeta
  const handleCreateCard = async () => {
    try {
      const response = await fetch('http://192.168.1.81:4000/api/cards', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Error al crear la tarjeta');
      const data = await response.json();
      setCard(data.card);
      Alert.alert('Éxito', 'Tarjeta creada con éxito');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear la tarjeta');
    }
  };

  // Recargar saldo en la tarjeta
  const handleRechargeBalance = async () => {
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor que 0');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.81:4000/api/cards/recharge', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, amount: parseFloat(amount) }),
      });
      if (!response.ok) throw new Error('Error al recargar el saldo');
      const data = await response.json();
      setCard(data.card);
      setAmount('');
      Alert.alert('Éxito', 'Saldo recargado con éxito');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo recargar el saldo');
    }
  };

  // Obtener el saldo de la tarjeta
  const handleGetBalance = async () => {
    try {
      const response = await fetch(`http://192.168.1.81:4000/api/cards/balance/${cardId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener el saldo');
      const data = await response.json();
      Alert.alert('Saldo', `El saldo actual es: $${data.balance}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo obtener el saldo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vista de Tarjetas</Text>

      {card ? (
        <>
          <Text>Número de tarjeta: {card.cardNum}</Text>
          <Text>Saldo: ${card.cardBal}</Text>
        </>
      ) : (
        <Text>No tienes una tarjeta asociada.</Text>
      )}

      <Button title="Crear Tarjeta" onPress={handleCreateCard} disabled={!!card} />

      <TextInput
        style={styles.input}
        placeholder="Monto a recargar"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Recargar Saldo" onPress={handleRechargeBalance} disabled={!card} />

      <Button title="Obtener Saldo" onPress={handleGetBalance} disabled={!card} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: '#800080',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#800080',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default TarjetaScreen;
