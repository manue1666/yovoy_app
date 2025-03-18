import { UserModel } from "../Models/UsersModel.js";
import jwt from "jsonwebtoken";

// Registro de usuarios
export const registerUsers = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar que los datos estén completos
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        // Crear el usuario (sin encriptar la contraseña)
        const user = await UserModel.create({
            name,
            email,
            password, // Guardar la contraseña en texto plano
        });

        // Respuesta exitosa
        return res.status(201).json({
            msg: "Usuario creado con éxito",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al crear el usuario" });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que los datos estén completos
        if (!email || !password) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Buscar el usuario por correo
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "El usuario no existe" });
        }

        // Verificar la contraseña (comparación en texto plano)
        if (password !== user.password) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // Generar un token JWT
        const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Inicio de sesión exitoso",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token, // Enviar el token al frontend
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al iniciar sesión" });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (_req, res) => {
    try {
        const allUsers = await UserModel.find({}, { password: 0 }); // Excluir la contraseña de la respuesta
        if (allUsers.length === 0) {
            return res.status(404).json({ msg: "No hay usuarios registrados" });
        }

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Usuarios obtenidos con éxito",
            allUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al obtener usuarios" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Obtener el userId desde los parámetros de la URL
        const user = await UserModel.findById(userId, { password: 0 }); // Excluir la contraseña
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al obtener el perfil del usuario" });
    }
};