import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const UsuariosReservas = sequelize.define('usuarios_reserva', {
    id_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    timestamps: false
});