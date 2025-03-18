import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // Validar que los campos no estén vacíos
            if (!email || !password) {
                Alert.alert("Error", "Por favor, completa todos los campos.");
                return;
            }

            // Hacer la solicitud al backend
            const response = await fetch("http://192.168.1.78:4000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // Verificar si el login fue exitoso
            if (response.ok) {
                // Guardar el userId y el token en AsyncStorage
                await AsyncStorage.setItem('userId', data.user._id);
                await AsyncStorage.setItem('token', data.token);

                console.log("Inicio de sesión exitoso. userId y token guardados.");
                navigation.navigate("Main"); // Redirigir a las pantallas principales
            } else {
                Alert.alert("Error", data.msg || "Hubo un error al iniciar sesión.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Hubo un error al conectarse al servidor.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#888" // Color del placeholder
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#888" // Color del placeholder
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                <Text style={styles.link}>¿No tienes una cuenta? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f2f2f2",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#800080",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
        color: "#000", // Color del texto
        placeholderTextColor: "#888", // Color del placeholder
    },
    button: {
        width: "100%",
        height: 40,
        backgroundColor: "#800080",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    link: {
        color: "#800080",
        textDecorationLine: "underline",
    },
});

export default LoginScreen;