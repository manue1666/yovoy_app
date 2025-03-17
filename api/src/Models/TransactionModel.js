import { model, Schema } from "mongoose";


const TransactionSchema = new Schema({
    cardId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "cards",
    },
    targetCardId: { // Nuevo campo para la tarjeta de destino
        type: Schema.Types.ObjectId,
        ref: "cards",
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["recarga", "pago", "transferencia"], // Agregar "transferencia"
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pendiente", "completada", "fallida"],
        default: "pendiente",
    },
});

export const TransactionModel = model("transactions", TransactionSchema)