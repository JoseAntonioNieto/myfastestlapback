import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const UsuariosVehiculos = sequelize.define('usuarios_vehiculo', {
    matricula: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    timestamps: false
});