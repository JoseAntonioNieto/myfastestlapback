import express from "express";
import { verify, getId } from "../auth.js";
import { Reservas } from "../models/Reservas.js";
import { Circuitos } from "../models/Circuitos.js";
import { UsuariosReservas } from "../models/Usuarios_Reservas.js";
import { VehiculosReservas } from "../models/Vehiculos_Reservas.js";
import { UsuariosVehiculos } from "../models/Usuarios_Vehiculos.js";

const reservas_usuario = express.Router();

reservas_usuario.get("/usuario/reservas", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);

        const reservas_usuario = await UsuariosReservas.findAll({
            where: {
                usuario_id: usuario_id
            }
        });

        const todosCircuitos = [];

        for (let i = 0; i < reservas_usuario.length; i++) {
            const reserva = await Reservas.findOne({
                where: {
                    id_reserva: reservas_usuario[i].id_reserva
                }
            })

            const circuito = await Circuitos.findOne({
                where: {
                    id_circuito: reserva.id_circuito
                }
            });

            todosCircuitos.push([reserva, {
                circuito: circuito.nombre
            }]);
        }

        res.status(200).json(todosCircuitos);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

reservas_usuario.post("/usuario/reservas", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);

        let respuesta;

        const usuarioHaReservado = await UsuariosReservas.count({
            where: {
                usuario_id: usuario_id,
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
                usuario_id: usuario_id,
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

reservas_usuario.delete("/usuario/reservas", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);

        const reserva_usuario = await UsuariosReservas.destroy({
            where: {
                usuario_id: usuario_id,
                id_reserva: req.body.id_reserva
            }
        });

        const vehiculosDelUsuario = await UsuariosVehiculos.findAll({
            where: {
                usuario_id: usuario_id
            }
        });

        for (let i = 0; i < vehiculosDelUsuario.length; i++) {
            const reserva_vehiculo = await VehiculosReservas.destroy({
                where: {
                    id_reserva: req.body.id_reserva,
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

export default reservas_usuario;