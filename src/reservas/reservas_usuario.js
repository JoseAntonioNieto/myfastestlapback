import express from "express";
import { verify, getId } from "../auth.js";
import { Reservas } from "../models/Reservas.js";
import { Circuitos } from "../models/Circuitos.js";
import { UsuariosReservas } from "../models/Usuarios_Reservas.js";
import { VehiculosReservas } from "../models/Vehiculos_Reservas.js";
import { UsuariosVehiculos } from "../models/Usuarios_Vehiculos.js";
import { Usuarios } from "../models/Usuarios.js";
import { Op } from 'sequelize';

const reservas_usuario = express.Router();

/**
 * @swagger
 * tags:
 *  name: Vehiculos_Reserva
 *  description: Vehiculo de la reserva
 * /api/usuario/reservas:
 *  get:
 *      summary: Obtiene las reservas del usuario
 *      tags: [Reservas_Usuario]
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Reservas del usuario
 *              content:
 *                  application/json:
 *                      type: array
 *  post:
 *      sumary: Realiza una reserva
 *      tags: [Reservas_Usuario]
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: Reserva del usuario
 *            description: Reserva del usuario
 *            schema:
 *                  type: object
 *                  required:
 *                      - id_reserva
 *                      - matricula
 *                  properties:
 *                      id_reserva:
 *                          type: number
 *                      matricula:
 *                          type: string
 *      responses:
 *          200:
 *              description: Reserva realizada
 *              content:
 *                  application/json:
 *                      type: array
 * /api/usuario/reservas/{id_reserva}:
 *  delete:
 *      summary: Cancela una reserva
 *      tags: [Reservas_Usuario]
 *      parameters:
 *          - in: path
 *            name: id_reserva
 *            schema:
 *              type: number
 *            required: true
 *            description: Id de la reserva a cancelar
 *      responses:
 *          200:
 *              description: Reserva cancelada
 *              content:
 *                  application/json:
 *                      type: array
 * /api/admin/reservas/{matricula}/{id_reserva}:
 *  delete:
 *      summary: Cancela una reserva
 *      tags: [Reservas_Usuario]
 *      parameters:
 *          - in: path
 *            name: matricula
 *            schema:
 *              type: number
 *            required: true
 *            description: Matricula del vehiculo
 *          - in: path
 *            name: id_reserva
 *            schema:
 *              type: number
 *            required: true
 *            description: Id de la reserva a cancelar
 *      responses:
 *          200:
 *              description: Reserva cancelada
 *              content:
 *                  application/json:
 *                      type: array
 */

reservas_usuario.get("/usuario/reservas", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        const date = new Date();

        date.setDate(date.getDate() + 1);

        const fechaComparar = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        const reservas_usuario = await UsuariosReservas.findAll({
            where: {
                user_id: user_id
            }
        });

        const todosCircuitos = [];

        for (let i = 0; i < reservas_usuario.length; i++) {
            const reserva = await Reservas.findOne({
                where: {
                    id_reserva: reservas_usuario[i].id_reserva,
                    fecha: {
                        [Op.gt]: fechaComparar
                    }
                }
            })

            if (reserva != null) {

                const circuito = await Circuitos.findOne({
                    where: {
                        id_circuito: reserva.id_circuito
                    }
                });

                todosCircuitos.push([reserva, {
                    circuito: circuito.nombre
                }]);
            }
        }

        res.status(200).json(todosCircuitos);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

reservas_usuario.post("/usuario/reservas", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        let respuesta;

        const usuarioHaReservado = await UsuariosReservas.count({
            where: {
                user_id: user_id,
                id_reserva: req.body.id_reserva
            }
        })

        const vehiculoEstaEnReserva = await VehiculosReservas.count({
            where: {
                id_reserva: req.body.id_reserva,
                matricula: req.body.matricula
            }
        })

        if (usuarioHaReservado == 0 && vehiculoEstaEnReserva == 0) {
            const reserva_usuario = await UsuariosReservas.create({
                user_id: user_id,
                id_reserva: req.body.id_reserva
            });

            const reserva_vehiculo = await VehiculosReservas.create({
                id_reserva: req.body.id_reserva,
                matricula: req.body.matricula
            });

            respuesta = {
                realizada: "si"
            }
        } else {
            respuesta = {
                realizada: "no"
            }
        }

        res.status(200).json(respuesta);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

reservas_usuario.delete("/usuario/reservas/:id_reserva", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        const reserva_usuario = await UsuariosReservas.destroy({
            where: {
                user_id: user_id,
                id_reserva: parseInt(req.params.id_reserva)
            }
        });

        const vehiculosDelUsuario = await UsuariosVehiculos.findAll({
            where: {
                user_id: user_id
            }
        });

        for (let i = 0; i < vehiculosDelUsuario.length; i++) {
            const reserva_vehiculo = await VehiculosReservas.destroy({
                where: {
                    id_reserva: parseInt(req.params.id_reserva),
                    matricula: vehiculosDelUsuario[i].matricula
                }
            });
        }

        res.status(200).json({
            eliminada: "si"
        });
    } catch (err) {
        res.status(401).send(err.message);
    }

});

reservas_usuario.delete("/admin/reservas/:matricula/:id_reserva", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        const usuario = await Usuarios.findOne({
            where: {
                user_id: user_id
            }
        });

        if (usuario.rol == "admin") {
            const matricula = req.params.matricula;

            const usuario_vehiculo = await UsuariosVehiculos.findOne({
                where: {
                    matricula: matricula
                }
            });

            await UsuariosReservas.destroy({
                where: {
                    id_reserva: req.params.id_reserva,
                    user_id: usuario_vehiculo.user_id
                }
            })

            await VehiculosReservas.destroy({
                where: {
                    id_reserva: req.params.id_reserva,
                    matricula: matricula
                }
            })

            res.status(200).json({
                eliminada: "si"
            });
        } else {
            res.status(401).send("El rol que tienes asignado no puede realizar esta acción");
        }
    } catch (err) {
        res.status(401).send(err.message);
        console.log(err);
    }
});

export default reservas_usuario;