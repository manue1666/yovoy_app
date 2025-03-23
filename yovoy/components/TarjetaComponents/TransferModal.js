import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Modal, Text, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '@env';

const TransferModal = ({ visible, onClose, sourceCardId, token, onTransfer }) => {
  const [targetCardId, setTargetCardId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!targetCardId || !amount || amount <= 0) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        sourceCardId,
        targetCardId, // Enviar el _ID de la tarjeta de destino
        amount: parseFloat(amount),
      };
      console.log('Datos enviados al backend:', payload); // Log para depuración

      const response = await fetch(`${API_BASE_URL}/api/cards/transfer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Respuesta del backend:', response); // Log para depuración

      if (!response.ok) {
        const errorData = await response.json(); // Obtener el mensaje de error del backend
        console.error('Error del backend:', errorData); // Log para depuración
        throw new Error(errorData.msg || 'Error al realizar la transferencia');
      }

      const data = await response.json();
      onTransfer(data.transaction);
      Alert.alert('Éxito', 'Transferencia realizada con éxito');
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo realizar la transferencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Transferir Saldo</Text>

        <Text style={styles.title}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="ID de la tarjeta de destino"
          value={targetCardId}
          onChangeText={setTargetCardId}
        />
        <Text style={styles.title}>monto</Text>
        <TextInput
          style={styles.input}
          placeholder="Monto a transferir"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#800080" />
        ) : (
          <Button title="Transferir" onPress={handleTransfer} />
        )}

        <Button title="Cerrar" onPress={onClose} color="#ccc" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#800080',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
  },
});

export default TransferModal;