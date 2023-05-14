import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const CircuitosUsuarios = sequelize.define('usuarios_circuito', {
    id_circuito: {
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