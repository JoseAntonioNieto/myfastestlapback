import express from "express";
import { Reservas } from "../models/Reservas.js";
import { Circuitos } from "../models/Circuitos.js";
import { Usuarios } from "../models/Usuarios.js";
import { UsuariosReservas } from "../models/Usuarios_Reservas.js";
import { VehiculosReservas } from "../models/Vehiculos_Reservas.js";
import { verify, getId } from "../auth.js";
import QueryTypes from "sequelize";
import { sequelize } from "../database/database.js";
import { Op } from 'sequelize';

const reservas = express.Router();


/**
 * @swagger
 * tags:
 *  name: Reservas
 *  description: Reservas del circuto
 * /api/reservas/{idCircuito}:
 *  get:
 *      sumary: Obtener todas las reservas de un circuito
 *      tags: [Reservas]
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: idCircuito
 *            schema:
 *              type: number
 *            required: true
 *            description: Id del circuito
 *      responses:
 *          200:
 *              description: Reservas del circuito
 *              content:
 *                  application/json:
 *                      type: array
 * /api/reservas:
 *  post:
 *      sumary: Crear una reserva
 *      tags: [Reservas]
 *      consumes:
 *          - application/json
 *      schema:
 *          type: object
 *          required:
 *              - id_circuito
 *              - fecha
 *              - hora_inicio
 *              - hora_fin
 *              - titulo
 *          properties:
 *              id_circuito:
 *                  type: number
 *              fecha:
 *                  type: string
 *                  format: date
 *              hora_inicio:
 *                  type: string
 *                  format: time
 *              hora_fin:
 *                  type: string
 *                  format: time
 *              titulo:
 *                  type: string
 *      responses:
 *          200:
 *              description: Cliente creado
 *              content:
 *                  application/json:
 *                      type: array
 * /api/reservas/{id}:
 *  delete:
 *      summary: Elimina una reserva
 *      tags: [Reservas]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: Id de la reserva a eliminar
 *      responses:
 *          200:
 *              description: Reserva eliminada
 *              content:
 *                  application/json:
 *                      type: array
 */

reservas.get("/reservas/:idCircuito", async (req, res) => {
    const idCircuito = parseInt(req.params.idCircuito);
    try {
        const date = new Date();

        date.setDate(date.getDate() + 1);

        const fechaComparar = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        const reservas = await Reservas.findAll({
            where: {
                id_circuito: idCircuito,
                fecha: {
                    [Op.gt]: fechaComparar
                }
            }
        })

        const circuito = await Circuitos.findOne({
            where: {
                id_circuito: idCircuito
            }
        });

        res.status(200).json([
            {
                nombreCircuito: circuito.nombre
            },
            reservas
        ]);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

reservas.post("/reservas", async (req, res) => {
    const reserva = req.body;
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);

        const usuario = await Usuarios.findOne({
            where: {
                usuario_id: usuario_id
            }
        });

        if (usuario.rol == "admin") {
            const max_id_reserva = await sequelize.query(`SELECT MAX(id_reserva) FROM reservas`);
            const id_reserva = max_id_reserva[0][0].max + 1;
            const reserva_insertar = {
                id_reserva: id_reserva,
                ...reserva
            }
            const reservaGuardada = await Reservas.create(reserva_insertar);
            res.status(200).json(reservaGuardada);
        } else {
            res.status(401).send("El rol que tienes asignado no puede realizar esta acción");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
})

reservas.delete("/reservas/:id", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);

        const usuario = await Usuarios.findOne({
            where: {
                usuario_id: usuario_id
            }
        });

        if (usuario.rol == "admin") { 
            const id = parseInt(req.params.id);

            await UsuariosReservas.destroy({
                where: {
                    id_reserva: id
                }
            })

            await VehiculosReservas.destroy({
                where: {
                    id_reserva: id
                }
            })

            await Reservas.destroy({
                where: {
                    id_reserva: id
                }
            })

            res.status(200).json({
                eliminado: true
            });
        }  else {
            res.status(401).send("El rol que tienes asignado no puede realizar esta acción");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
})

export default reservas;