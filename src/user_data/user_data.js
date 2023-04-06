import express from "express";
import { verify, getId } from "../auth.js";
import { Usuarios } from "../models/Usuarios.js";

const user_data = express.Router();

user_data.get("/user_data", async (req, res) => {
    // req.headers["authentication"]
    try {
        const payload = await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);
        const rol = 'usuario';
        let usuario;
        const cantidad = await Usuarios.count({
            where: {
                usuario_id: usuario_id
            }
        });

        if (cantidad == 0) {
            usuario = await Usuarios.create({usuario_id, rol});
        }

        res.status(200).json(payload);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

user_data.get("/rol_usuario", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);
        const usuario = await Usuarios.findByPk(usuario_id);
        res.status(200).json({
            rol: usuario.rol
        });
    } catch (err) {
        res.status(401).send(err.message);
    }
});

export default user_data;