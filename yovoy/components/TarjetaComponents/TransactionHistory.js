import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Modal, Button, Alert } from 'react-native';
import { API_BASE_URL } from '@env';

const TransactionHistory = ({ visible, onClose, cardId, token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && cardId) {
      fetchTransactions();
    }
  }, [visible]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/transactions/card/${cardId}`;
      console.log('URL de la solicitud:', url); // Log para depuración
      console.log('Token:', token); // Log para depuración

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del backend:', response); // Log para depuración

      if (!response.ok) {
        const errorData = await response.json(); // Obtener el mensaje de error del backend
        console.error('Error del backend:', errorData); // Log para depuración
        throw new Error(errorData.msg || 'Error al obtener las transacciones');
      }

      const data = await response.json();
      console.log('Datos recibidos:', data); // Log para depuración
      setTransactions(data.transactions || []); // Asegurarse de que transactions sea un array
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo obtener el historial de transacciones');
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionType}>Tipo: {item.type}</Text>
      <Text style={styles.transactionAmount}>Monto: ${item.amount}</Text>
      <Text style={styles.transactionStatus}>Estado: {item.status}</Text>
      <Text style={styles.transactionDate}>
        Fecha: {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Historial de Transacciones</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#800080" />
        ) : transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text>No hay transacciones registradas.</Text>
        )}

        <Button title="Cerrar" onPress={onClose} color="#800080" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#555',
  },
  transactionStatus: {
    fontSize: 14,
    color: '#555',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default TransactionHistory;