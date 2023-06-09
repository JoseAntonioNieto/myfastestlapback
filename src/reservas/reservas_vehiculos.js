import express from "express";
import { verify, getId } from "../auth.js";
import { Vehiculos } from "../models/Vehiculos.js";
import { VehiculosReservas } from "../models/Vehiculos_Reservas.js";
import { Reservas } from "../models/Reservas.js";
import { Usuarios } from "../models/Usuarios.js";
import { Circuitos } from "../models/Circuitos.js";

const reservas_vehiculos = express.Router();

/**
 * @swagger
 * tags:
 *  name: Vehiculos_Reserva
 *  description: Vehiculo de la reserva
 * /api/vehiculos/reservas/{id}:
 *  get:
 *      sumary: Obtener todas las reservas de un circuito
 *      tags: [Vehiculos_Reserva]
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: Id de la reserva
 *      responses:
 *          200:
 *              description: Vehiculos de la reserva
 *              content:
 *                  application/json:
 *                      type: array
 */

reservas_vehiculos.get('/vehiculos/reservas/:id', async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        const usuario = await Usuarios.findOne({
            where: {
                user_id: user_id
            }
        });

        if (usuario.rol == "admin") {
            const vehiculos =  await VehiculosReservas.findAll({
                where: {
                    id_reserva: req.params.id
                }
            });

            const arrVehiculos = [];

            for (let i = 0; i < vehiculos.length; i++) {
                const vehiculo = await Vehiculos.findOne({
                    where: {
                        matricula: vehiculos[i].matricula
                    }
                });

                const reserva = await Reservas.findOne({
                    where: {
                        id_reserva: vehiculos[i].id_reserva,
                    }
                })

                const circuito = await Circuitos.findOne({
                    where: {
                        id_circuito: reserva.id_circuito
                    }
                });

                arrVehiculos.push({
                    nombre_circuito: circuito.nombre,
                    nombre_reserva: reserva.titulo,
                    ...vehiculo.dataValues,
                });
            }

            res.status(200).json(arrVehiculos);
        } else {
            res.status(401).send("El rol que tienes asignado no puede realizar esta acción");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
})

export default reservas_vehiculos;