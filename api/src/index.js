import mongoose from "mongoose";
import  app from "./app.js";

async function main() {
    try {
        await mongoose.connect("mongodb://localhost:27017/yovoy");
        console.log("aplicacion conectada a la bd");
        app.listen(4000, ()=>{
            console.log("aplicacion corriendo")
            console.log("http://127.0.0.1:4000")
        })
    } catch (error) {
        console.log("algo fallo con la base de datos")
    }
}

main()