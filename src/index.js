import express from "express";
import cors from "cors";
import user_data from "./user_data/user_data.js";

const app =  express();

app.use(cors())

app.use(express.json());

app.use("/api", user_data);

app.listen(5000, () => console.log('Servidor iniciado en el puerto 5000'));