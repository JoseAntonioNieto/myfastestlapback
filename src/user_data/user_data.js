import express from "express";
import { verify, getId } from "../auth.js";
import { Usuarios } from "../models/Usuarios.js";

const user_data = express.Router();

/**
 * @swagger
 * tags:
 *  name: User Data
 *  description: Datos de usuario
 * /api/user_data:
 *  get:
 *      summary: Obtiene los datos de usuario
 *      tags: [User Data]
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Datos de usuario
 *              content:
 *                  application/json:
 *                      type: array
 * /api/rol_usuario:
 *  get:
 *      summary: Obtiene el rol del usuario
 *      tags: [User Data]
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Rol del usuario
 *              content:
 *                  application/json:
 *                      type: array
 * 
 */

user_data.get("/user_data", async (req, res) => {
    // req.headers["authentication"]
    try {
        const payload = await verify(req.headers["authentication"]);
        // const usuario_id = await getId(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);
        const rol = 'usuario';
        let usuario;
        const cantidad = await Usuarios.count({
            where: {
                // usuario_id: usuario_id
                user_id: user_id
            }
        });

        if (cantidad == 0) {
            usuario = await Usuarios.create({user_id, rol});
        }

        res.status(200).json(payload);
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err);
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