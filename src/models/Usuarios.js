import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Usuarios = sequelize.define('usuario', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});