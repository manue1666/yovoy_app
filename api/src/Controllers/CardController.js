import { CardModel } from "../Models/CardModel.js";

// Crear una nueva tarjeta (solo una por usuario)
export const createCard = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validar que el userId esté presente
        if (!userId) {
            return res.status(400).json({ msg: "Se requiere el ID del usuario" });
        }

        // Verificar si el usuario ya tiene una tarjeta
        const existingCard = await CardModel.findOne({ userId });
        if (existingCard) {
            return res.status(400).json({ msg: "El usuario ya tiene una tarjeta" });
        }

        // Generar un número de tarjeta único
        const cardNum = generateCardNumber();

        // Crear la tarjeta
        const card = await CardModel.create({
            userId,
            cardNum,
            cardBal: 0, // Saldo inicial en 0
        });

        // Respuesta exitosa
        return res.status(201).json({
            msg: "Tarjeta creada con éxito",
            card,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al crear la tarjeta" });
    }
};

// Función para generar un número de tarjeta único
const generateCardNumber = () => {
    const min = 1000000000000000; // Número de 16 dígitos (mínimo)
    const max = 9999999999999999; // Número de 16 dígitos (máximo)
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Obtener todas las tarjetas de un usuario
export const getCardsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validar que el userId esté presente
        if (!userId) {
            return res.status(400).json({ msg: "Se requiere el ID del usuario" });
        }

        // Buscar la tarjeta del usuario (solo debería haber una)
        const card = await CardModel.findOne({ userId });
        if (!card) {
            return res.status(404).json({ msg: "No se encontró una tarjeta para este usuario" });
        }

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Tarjeta obtenida con éxito",
            card,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al obtener la tarjeta" });
    }
};

// Recargar saldo en una tarjeta
export const rechargeBalance = async (req, res) => {
    try {
        const { cardId, amount } = req.body;

        // Validar que los datos estén completos
        if (!cardId || !amount) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Verificar que el monto sea positivo
        if (amount <= 0) {
            return res.status(400).json({ msg: "El monto debe ser mayor que 0" });
        }

        // Buscar la tarjeta
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ msg: "Tarjeta no encontrada" });
        }

        // Actualizar el saldo
        card.cardBal += amount;
        await card.save();

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Saldo recargado con éxito",
            card,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al recargar el saldo" });
    }
};

// Obtener el saldo de una tarjeta
export const getCardBalance = async (req, res) => {
    try {
        const { cardId } = req.params;

        // Validar que el cardId esté presente
        if (!cardId) {
            return res.status(400).json({ msg: "Se requiere el ID de la tarjeta" });
        }

        // Buscar la tarjeta
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ msg: "Tarjeta no encontrada" });
        }

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Saldo obtenido con éxito",
            balance: card.cardBal,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al obtener el saldo" });
    }
};