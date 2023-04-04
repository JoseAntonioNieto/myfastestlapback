import express from "express";
import cors from "cors";
import user_data from "./user_data/user_data.js";
import { sequelize } from "./database/database.js";

const app =  express();

app.use(cors())

app.use(express.json());

app.use("/api", user_data);

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

app.listen(5000, () => console.log('Servidor iniciado en el puerto 5000'));