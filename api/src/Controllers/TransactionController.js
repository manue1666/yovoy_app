import { TransactionModel } from "../Models/TransactionModel.js";
import { CardModel } from "../Models/CardModel.js";

// Crear una nueva transacción
export const createTransaction = async (req, res) => {
    try {
        const { cardId, amount, type } = req.body;

        // Validar que los datos estén completos
        if (!cardId || !amount || !type) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Verificar que el tipo de transacción sea válido
        if (!["recarga", "pago"].includes(type)) {
            return res.status(400).json({ msg: "Tipo de transacción no válido" });
        }

        // Buscar la tarjeta asociada
        const card = await CardModel.findById(cardId);
        if (!card) {
            return res.status(404).json({ msg: "Tarjeta no encontrada" });
        }

        // Validar el saldo en caso de un pago
        if (type === "pago" && card.cardBal < amount) {
            return res.status(400).json({ msg: "Saldo insuficiente" });
        }

        // Crear la transacción
        const transaction = await TransactionModel.create({
            cardId,
            amount,
            type,
            status: "pendiente", // Estado inicial
        });

        // Actualizar el saldo de la tarjeta
        if (type === "recarga") {
            card.cardBal += amount;
        } else if (type === "pago") {
            card.cardBal -= amount;
        }
        await card.save();

        // Actualizar el estado de la transacción a "completada"
        transaction.status = "completada";
        await transaction.save();

        // Respuesta exitosa
        return res.status(201).json({
            msg: "Transacción creada con éxito",
            transaction,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al crear la transacción" });
    }
};

// Obtener el historial de transacciones de una tarjeta
export const getTransactionsByCard = async (req, res) => {
    try {
        const { cardId } = req.params;

        // Validar que el cardId esté presente
        if (!cardId) {
            return res.status(400).json({ msg: "Se requiere el ID de la tarjeta" });
        }

        // Buscar las transacciones de la tarjeta
        const transactions = await TransactionModel.find({ cardId }).sort({ timestamp: -1 }); // Ordenar por fecha descendente
        if (transactions.length === 0) {
            return res.status(404).json({ msg: "No se encontraron transacciones para esta tarjeta" });
        }

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Transacciones obtenidas con éxito",
            transactions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al obtener las transacciones" });
    }
};

// Actualizar el estado de una transacción
export const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;

        // Validar que los datos estén completos
        if (!transactionId || !status) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Verificar que el estado sea válido
        if (!["pendiente", "completada", "fallida"].includes(status)) {
            return res.status(400).json({ msg: "Estado no válido" });
        }

        // Buscar la transacción
        const transaction = await TransactionModel.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ msg: "Transacción no encontrada" });
        }

        // Actualizar el estado de la transacción
        transaction.status = status;
        await transaction.save();

        // Respuesta exitosa
        return res.status(200).json({
            msg: "Estado de la transacción actualizado con éxito",
            transaction,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al actualizar el estado de la transacción" });
    }
};

export const transferBalance = async (req, res) => {
    try {
        const { sourceCardId, targetCardId, amount } = req.body;

        // Validar que los datos estén completos
        if (!sourceCardId || !targetCardId || !amount) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Verificar que el monto sea positivo
        if (amount <= 0) {
            return res.status(400).json({ msg: "El monto debe ser mayor que 0" });
        }

        // Buscar las tarjetas de origen y destino
        const sourceCard = await CardModel.findById(sourceCardId);
        const targetCard = await CardModel.findById(targetCardId);

        if (!sourceCard || !targetCard) {
            return res.status(404).json({ msg: "Tarjeta no encontrada" });
        }

        // Verificar que el saldo sea suficiente en la tarjeta de origen
        if (sourceCard.cardBal < amount) {
            return res.status(400).json({ msg: "Saldo insuficiente" });
        }

        // Realizar la transferencia
        sourceCard.cardBal -= amount;
        targetCard.cardBal += amount;

        // Guardar los cambios en ambas tarjetas
        await sourceCard.save();
        await targetCard.save();

        // Registrar la transacción de transferencia
        const transaction = await TransactionModel.create({
            cardId: sourceCardId,
            targetCardId, // Tarjeta de destino
            amount,
            type: "transferencia",
            status: "completada",
        });

        // Respuesta exitosa
        return res.status(201).json({
            msg: "Transferencia realizada con éxito",
            transaction,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Hubo un error al realizar la transferencia" });
    }
};