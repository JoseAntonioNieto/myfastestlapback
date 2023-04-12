import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Circuitos = sequelize.define('circuito', {
    id_circuito: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});