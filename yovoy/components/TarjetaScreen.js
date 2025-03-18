// TarjetaScreen
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TarjetaScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Esta es la vista de Tarjetotas</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  text: {
    fontSize: 20,
    color: '#800080',
  },
});

export default TarjetaScreen;
