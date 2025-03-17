import { model, Schema } from "mongoose";


const CardSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    cardNum: {
        type: Number,
        required: true,
        unique: true, // Asegura que el número de tarjeta sea único
    },
    cardBal: {
        type: Number,
        required: true,
        default: 0, // Saldo inicial en 0
    },

})

export const CardModel = model("cards",CardSchema)