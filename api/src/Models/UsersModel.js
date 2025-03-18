import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, validar correo opcional
    },
    password: {
        type: String,
        required: true,
    },
});



export const UserModel = model("users", UserSchema);