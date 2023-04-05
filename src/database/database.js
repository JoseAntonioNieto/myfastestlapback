import dotenv from "dotenv";
import Sequelize from "sequelize";

dotenv.config();
const DB_URI = process.env.DB_URI;

export const sequelize = new Sequelize(DB_URI)