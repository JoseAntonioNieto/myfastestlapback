import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import user_data from "./user_data/user_data.js";
import vehiculos from "./vehiculos/vehiculos.js";
import circuitos from "./circuitos/circuitos.js";
import reservas from "./reservas/reservas.js";
import reservas_usuario from "./reservas/reservas_usuario.js";
import reservas_vehiculos from "./reservas/reservas_vehiculos.js";
import { sequelize } from "./database/database.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import "./models/Usuarios.js";
import "./models/Vehiculos.js";
import "./models/Usuarios_Vehiculos.js";
import "./models/Reservas.js";
import "./models/Usuarios_Reservas.js"
import "./models/Circuitos.js"

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// Swagger
const options = {
  definition: {
    info: {
      title: "Api MyFastestLap",
      version: "0.1.0",
      description:
        "Documentacion Api de las reservas en circuitos",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Jose Antonio",
        url: "https://github.com/JoseAntonioNieto",
        email: "gokugamer243@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "authentication",
        }
      }
    },
  },
  apis: ["./src/vehiculos/vehiculos.js", "./src/user_data/user_data.js", "./src/reservas/reservas.js", "./src/reservas/reservas_vehiculos.js",
  "./src/reservas/reservas_usuario.js", "./src/circuitos/circuitos.js"],
};

const specs = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// Swagger

app.use(cors());

app.use(express.json());

try {
  await sequelize.sync({ alert: true });
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use("/api", user_data);
app.use("/api", vehiculos);
app.use("/api", circuitos);
app.use("/api", reservas);
app.use("/api", reservas_usuario);
app.use("/api", reservas_vehiculos);

app.listen(PORT, () => console.log('Servidor iniciado en el puerto 5000'));