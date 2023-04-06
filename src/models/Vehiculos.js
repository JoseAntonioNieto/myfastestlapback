import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Vehiculos = sequelize.define('vehiculo', {
    matricula: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nombre_conductor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni_titular: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre_titular: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});