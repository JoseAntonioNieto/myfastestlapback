import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Reservas = sequelize.define('reserva', {
    id_reserva: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_circuito: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});