import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const RutaScreen = () => {
    const webViewRef = useRef(null); // Referencia al WebView

    // Función para centrar el mapa en la ubicación del usuario
    const centerMap = () => {
        if (webViewRef.current) {
            webViewRef.current.postMessage('centerMap'); // Enviar mensaje al WebView
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Esta es la vista de Rutas</Text>
            <WebView
                ref={webViewRef} // Asignar la referencia al WebView
                source={{ uri: 'file:///android_asset/map.html' }} // Ruta al archivo HTML
                style={styles.map}
                onMessage={(event) => {
                    // Manejar mensajes desde el WebView si es necesario
                    console.log('Mensaje desde el WebView:', event.nativeEvent.data);
                }}
            />
            {/* Botón para centrar el mapa */}
            <TouchableOpacity style={styles.button} onPress={centerMap}>
                <Text style={styles.buttonText}>Centrar en mi ubicación</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    text: {
        fontSize: 20,
        color: '#800080',
        textAlign: 'center',
        marginVertical: 10, // Espacio entre el texto y el mapa
    },
    map: {
        flex: 1, // El mapa ocupará el resto del espacio disponible
        width: '100%',
    },
    button: {
        position: 'absolute', // Posicionar el botón sobre el mapa
        bottom: 20, // Distancia desde la parte inferior
        alignSelf: 'center', // Centrar horizontalmente
        backgroundColor: '#800080', // Color de fondo del botón
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff', // Color del texto del botón
        fontSize: 16,
    },
});

export default RutaScreen;