import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { API_BASE_URL } from '@env';


const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            // Validar que los campos no estén vacíos
            if (!name || !email || !password) {
                Alert.alert("Error", "Por favor, completa todos los campos.");
                return;
            }

            // Hacer la solicitud al backend
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            // Verificar si el registro fue exitoso
            if (response.ok) {
                Alert.alert("Éxito", "Usuario registrado correctamente.");
                navigation.navigate("Login"); // Redirigir al login después del registro
            } else {
                Alert.alert("Error", data.msg || "Hubo un error al registrar el usuario.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Hubo un error al conectarse al servidor.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#888" // Color del placeholder
                value={name}
                onChangeText={setName}
            />

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

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
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

export default RegisterScreen;