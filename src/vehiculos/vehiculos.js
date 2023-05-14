import express from "express";
import { verify, getId } from "../auth.js";
import { Vehiculos } from "../models/Vehiculos.js";
import { UsuariosVehiculos } from "../models/Usuarios_Vehiculos.js";

const vehiculos = express.Router();

/**
 * @swagger
 * 
 * tags:
 *  name: Vehiculos
 *  description: Vehiculos del usuario
 * /api/vehiculos:
 *  post:
 *      summary: Inserta un vehiculo
 *      tags: [Vehiculos]
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: Vehiculo
 *            description: Vehiculo a insertar
 *            schema:
 *                  type: object
 *                  required:
 *                      -  matricula
 *                      -  nombre_conductor
 *                      -  dni_titular
 *                      -  nombre_titular
 *                  properties:
 *                      matricula:
 *                          type: string
 *                      nombre_conductor:
 *                          type: string
 *                      dni_titular:
 *                          type: string
 *                      nombre_titular:
 *                          type: string
 *      responses:
 *          200:
 *              description: Cliente creado
 *              content:
 *                  application/json:
 *                      type: array
 *  get:
 *      summary: Obtiene todos los vehiculos del usuario
 *      tags: [Vehiculos]
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Vehiculos del usuario
 *              content:
 *                  application/json:
 *                      type: array
 * /api/vehiculos/{matricula}:
 *  delete:
 *      summary: Elimina un vehiculo
 *      tags: [Vehiculos]
 *      parameters:
 *          - in: path
 *            name: matricula
 *            schema:
 *              type: string
 *            required: true
 *            description: Matricula del vehiculo a eliminar
 *      responses:
 *          200:
 *              description: Vehiculo eliminado
 *              content:
 *                  application/json:
 *                      type: array
 */

vehiculos.post("/vehiculos", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        const vehiculo_existe = await Vehiculos.count({
            where: {
                matricula: req.body.matricula
            }
        });

        if (vehiculo_existe == 0) {
            const vehiculo = await Vehiculos.create({
                matricula: req.body.matricula,
                nombre_conductor: req.body.nombre_conductor,
                dni_titular: req.body.dni_titular,
                nombre_titular: req.body.nombre_titular
            });
    
            await UsuariosVehiculos.create({
                matricula: req.body.matricula,
                user_id: user_id
            });
    
            res.status(200).json({
                ...vehiculo,
                insertado: "si"
            });
        } else {
            res.status(200).json({
                insertado: "no"
            });
        }

        
    } catch (err) {
        res.status(401).send(err.message);
    }
});

vehiculos.get("/vehiculos", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);
        const vehiculos_usuario = await UsuariosVehiculos.findAll({
            where: {
                user_id: user_id
            }
        });

        const matriculas = [];
        vehiculos_usuario.forEach(async element => {
            matriculas.push(element.matricula);
        });

        var vehiculos = [];
        for (let i = 0; i < matriculas.length; i++) {
            const vehiculo = await Vehiculos.findAll({
                where: {
                    matricula: matriculas[i]
                }
            });
            vehiculos.push(vehiculo[0]);
        }
        res.status(200).json(vehiculos);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

vehiculos.delete("/vehiculos/:matricula", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);
        await UsuariosVehiculos.destroy({
            where: {
                matricula: req.params.matricula,
                user_id: user_id
            }
        });

        const mat_veh_usu_ex = await UsuariosVehiculos.count({
            where: {
                matricula: req.params.matricula
            }
        });

        if (mat_veh_usu_ex == 0) {
            await Vehiculos.destroy({
                where: {
                    matricula: req.params.matricula
                }
            });
        }

        res.status(200).json({
            eliminado: true
        });
    } catch (err) {
        res.status(401).send(err.message);
    }
});

export default vehiculos;