import express from "express";
import { Reservas } from "../models/Reservas.js";
import { Circuitos } from "../models/Circuitos.js";

const reservas = express.Router();

reservas.get("/reservas/:idCircuito", async (req, res) => {
    const idCircuito = parseInt(req.params.idCircuito);
    try {
        const reservas = await Reservas.findAll({
            where: {
                id_circuito: idCircuito
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