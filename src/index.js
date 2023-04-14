import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import user_data from "./user_data/user_data.js";
import vehiculos from "./vehiculos/vehiculos.js";
import circuitos from "./circuitos/circuitos.js";
import { sequelize } from "./database/database.js";

import "./models/Usuarios.js";
import "./models/Vehiculos.js";
import "./models/Usuarios_Vehiculos.js";

dotenv.config();
const PORT = process.env.PORT;

const app =  express();

app.use(cors())

app.use(express.json());

try {
  await sequelize.sync({alert: true});
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use("/api", user_data);
app.use("/api", vehiculos);
app.use("/api", circuitos);

app.listen(PORT, () => console.log('Servidor iniciado en el puerto 5000'));