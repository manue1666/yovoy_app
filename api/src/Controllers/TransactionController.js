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
        console.log('Card ID recibido:', cardId); // Log para depuración

        if (!cardId) {
            return res.status(400).json({ msg: "Se requiere el ID de la tarjeta" });
        }

        // Verificar si la tarjeta existe
        const card = await CardModel.findById(cardId);
        if (!card) {
            console.log('Tarjeta no encontrada'); // Log para depuración
            return res.status(404).json({ msg: "Tarjeta no encontrada" });
        }

        // Buscar las transacciones de la tarjeta
        const transactions = await TransactionModel.find({ cardId }).sort({ timestamp: -1 });
        console.log('Transacciones encontradas:', transactions); // Log para depuración

        // Devolver un array vacío si no hay transacciones
        return res.status(200).json({
            msg: "Transacciones obtenidas con éxito",
            transactions: transactions || [], // Devolver un array vacío si no hay transacciones
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
        const { sourceCardId, targetCardId, amount } = req.body; // Cambiar a targetCardId
        console.log('Datos recibidos:', { sourceCardId, targetCardId, amount }); // Log para depuración

        // Validar que los datos estén completos
        if (!sourceCardId || !targetCardId || !amount) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Verificar que el monto sea positivo
        if (amount <= 0) {
            return res.status(400).json({ msg: "El monto debe ser mayor que 0" });
        }

        // Buscar la tarjeta de origen
        const sourceCard = await CardModel.findById(sourceCardId);
        if (!sourceCard) {
            console.log('Tarjeta de origen no encontrada'); // Log para depuración
            return res.status(404).json({ msg: "Tarjeta de origen no encontrada" });
        }

        // Buscar la tarjeta de destino por su _ID
        const targetCard = await CardModel.findById(targetCardId);
        if (!targetCard) {
            console.log('Tarjeta de destino no encontrada'); // Log para depuración
            return res.status(404).json({ msg: "Tarjeta de destino no encontrada" });
        }

        // Verificar que el saldo sea suficiente en la tarjeta de origen
        if (sourceCard.cardBal < amount) {
            console.log('Saldo insuficiente'); // Log para depuración
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
            targetCardId: targetCard._id, // Usar el ID de la tarjeta de destino
            amount,
            type: "transferencia",
            status: "completada",
        });

        console.log('Transferencia realizada con éxito:', transaction); // Log para depuración

        // Respuesta exitosa
        return res.status(201).json({
            msg: "Transferencia realizada con éxito",
            transaction,
        });
    } catch (error) {
        console.error('Error en transferBalance:', error); // Log para depuración
        return res.status(500).json({ msg: "Hubo un error al realizar la transferencia" });
    }
};