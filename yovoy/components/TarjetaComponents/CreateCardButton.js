import React from 'react';
import { Button, Alert } from 'react-native';
import { API_BASE_URL } from '@env';

const CreateCardButton = ({ userId, token, onCreate }) => {
  const handleCreateCard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Error al crear la tarjeta');
      const data = await response.json();
      onCreate(data.card);
      Alert.alert('Éxito', 'Tarjeta creada con éxito');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear la tarjeta');
    }
  };

  return <Button title="Crear Tarjeta" onPress={handleCreateCard} />;
};

export default CreateCardButton;