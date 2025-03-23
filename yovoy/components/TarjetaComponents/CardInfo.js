import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CardInfo = ({ card }) => (
  <View style={styles.container}>
    <Text>Número de tarjeta: {card.cardNum}</Text>
    <Text>Saldo: ${card.cardBal}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});

export default CardInfo;