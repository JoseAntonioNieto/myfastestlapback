import express from "express";
import { verify, getId } from "../auth.js";
import { Reservas } from "../models/Reservas.js";
import { Circuitos } from "../models/Circuitos.js";
import { UsuariosReservas } from "../models/Usuarios_Reservas.js";

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

export default reservas_usuario;