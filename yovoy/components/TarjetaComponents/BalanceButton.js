import React from 'react';
import { Button, Alert } from 'react-native';
import { API_BASE_URL } from '@env';

const BalanceButton = ({ cardId, token }) => {
  const handleGetBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards/balance/${cardId}`, {
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

  return <Button title="Obtener Saldo" onPress={handleGetBalance} />;
};

export default BalanceButton;