import express from "express";
import { Reservas } from "../models/Reservas.js";
import { Circuitos } from "../models/Circuitos.js";
import { Op } from 'sequelize';

const reservas = express.Router();

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

export default reservas;