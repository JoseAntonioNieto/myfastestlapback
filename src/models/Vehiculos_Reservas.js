import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const VehiculosReservas = sequelize.define('vehiculos_reserva', {
    id_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    matricula: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    timestamps: false
});