import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardInfo from './TarjetaComponents/CardInfo';
import CreateCardButton from './TarjetaComponents/CreateCardButton';
import BalanceButton from './TarjetaComponents/BalanceButton';
import RechargeModal from './TarjetaComponents/RechargeModal';
import TransactionHistory from './TarjetaComponents/TransactionHistory'; 
import TransferModal from './TarjetaComponents/TransferModal'; 
import { API_BASE_URL } from '@env';


const TarjetaScreen = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [card, setCard] = useState(null);
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false); 
  const [isTransactionHistoryVisible, setIsTransactionHistoryVisible] = useState(false); 
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false); 
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (userId && token) {
        setUserId(userId);
        setToken(token);
        fetchUserCard(userId, token);
      }
    };
    fetchUserData();
  }, []);

  const fetchUserCard = async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cards/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener la tarjeta');
      const data = await response.json();
      setCard(data.card);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo obtener la tarjeta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vista de Tarjetas</Text>

      {card ? (
        <CardInfo card={card} />
      ) : (
        <Text>No tienes una tarjeta asociada.</Text>
      )}

      {!card && <CreateCardButton userId={userId} token={token} onCreate={setCard} />}

      {card && (
        <>
          {/* Botón para abrir el modal de recarga */}
          <Button
            title="Recargar Saldo"
            onPress={() => setIsRechargeModalVisible(true)}
          />

          {/* Botón para abrir el modal de transferencia */}
          <Button
            title="Transferir Saldo"
            onPress={() => setIsTransferModalVisible(true)}
          />

          {/* Botón para abrir el modal de historial de transacciones */}
          <Button
            title="Ver Historial de Transacciones"
            onPress={() => setIsTransactionHistoryVisible(true)}
          />

          <BalanceButton cardId={card._id} token={token} />
        </>
      )}

      {/* Modal de recarga de saldo */}
      <RechargeModal
        visible={isRechargeModalVisible}
        onClose={() => setIsRechargeModalVisible(false)}
        cardId={card?._id}
        token={token}
        onRecharge={setCard}
      />

      {/* Modal de historial de transacciones */}
      <TransactionHistory
        visible={isTransactionHistoryVisible}
        onClose={() => setIsTransactionHistoryVisible(false)}
        cardId={card?._id}
        token={token}
      />

      {/* Modal de transferencia de saldo */}
      <TransferModal
        visible={isTransferModalVisible}
        onClose={() => setIsTransferModalVisible(false)}
        sourceCardId={card?._id}
        token={token}
        onTransfer={() => {
          // Actualizar el saldo de la tarjeta después de la transferencia
          fetchUserCard(userId, token);
        }}
      />
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
});

export default TarjetaScreen;