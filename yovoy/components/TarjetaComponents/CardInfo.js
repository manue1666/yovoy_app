import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const CardInfo = ({ card }) => {
  
  console.log('ID de la tarjeta:', card?._id);

  return (
    <View style={styles.container}>
      <Text>Número de tarjeta: {card?.cardNum}</Text>
      <Text>Saldo: ${card?.cardBal}</Text>
      
      {card?._id ? (
        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>Escanea este código para recibir transferencias</Text>
          <QRCode
            value={card._id.toString()} 
            size={200}
            color="#800080"
            backgroundColor="#ffffff"
          />
        </View>
      ) : (
        <Text style={{ color: 'red' }}>No hay ID para generar QR</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    height: 250, // Espacio fijo para el QR
  },
  qrText: {
    fontSize: 16,
    color: '#800080',
    marginBottom: 10,
  },
});

export default CardInfo;