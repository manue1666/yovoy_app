import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ActivityIndicator, Modal } from 'react-native';
import { API_BASE_URL } from '@env';

const RechargeModal = ({ visible, onClose, cardId, token, onRecharge }) => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'card' o 'paypal'

  const handleRecharge = async () => {
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor que 0');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv)) {
      Alert.alert('Error', 'Por favor, completa todos los campos de la tarjeta');
      return;
    }

    setIsPaying(true);

    // Simular un proceso de pago (2 segundos de espera)
    setTimeout(async () => {
      try {
        // Simular una respuesta exitosa del pago
        const paymentSuccess = Math.random() > 0.2; // 80% de éxito
        if (!paymentSuccess) {
          throw new Error('El pago falló. Por favor, intenta de nuevo.');
        }

        // Llamar al backend para recargar el saldo
        const response = await fetch(`${API_BASE_URL}/api/cards/recharge`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cardId, amount: parseFloat(amount) }),
        });
        if (!response.ok) throw new Error('Error al recargar el saldo');
        const data = await response.json();
        onRecharge(data.card);
        setAmount('');
        Alert.alert('Éxito', 'Pago realizado y saldo recargado con éxito');
        onClose(); // Cerrar el modal después de una recarga exitosa
      } catch (error) {
        console.error(error);
        Alert.alert('Error', error.message || 'No se pudo completar el pago');
      } finally {
        setIsPaying(false);
      }
    }, 2000); // Simular 2 segundos de procesamiento
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Recargar Saldo</Text>

        <TextInput
          style={styles.input}
          placeholder="Monto a recargar"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.subtitle}>Método de Pago</Text>

        <View style={styles.paymentMethodContainer}>
          <Button
            title="Tarjeta de Crédito"
            onPress={() => setPaymentMethod('card')}
            color={paymentMethod === 'card' ? '#800080' : '#ccc'}
          />
          <Button
            title="PayPal"
            onPress={() => setPaymentMethod('paypal')}
            color={paymentMethod === 'paypal' ? '#800080' : '#ccc'}
          />
        </View>

        {paymentMethod === 'card' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de expiración (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
            />
          </>
        )}

        {paymentMethod === 'paypal' && (
          <Text style={styles.paypalText}>Serás redirigido a PayPal para completar el pago.</Text>
        )}

        {isPaying ? (
          <ActivityIndicator size="large" color="#800080" />
        ) : (
          <Button title="Pagar" onPress={handleRecharge} disabled={!amount || !paymentMethod} />
        )}

        <Button title="Cerrar" onPress={onClose} color="#ccc"  />
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#800080',
    marginVertical: 10,
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
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '80%',
  },
  paypalText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RechargeModal;