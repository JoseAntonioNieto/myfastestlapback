import exppress from "express";
import { Op } from "sequelize";
import QueryTypes from "sequelize";
import { sequelize } from "../database/database.js";
import { Circuitos } from "../models/Circuitos.js";

const circuitos = exppress.Router();

circuitos.get("/circuitos", async (req, res) => {

    const saltos = req.body.pagina * 9 - 9;

    try {
        let circuitos;

        if (req.body.pais && req.body.nombre) {
            const nombre = req.body.nombre;
            let respuesta = await sequelize.query(`SELECT * FROM circuitos WHERE LOWER(nombre) LIKE '%${nombre.toLowerCase()}%' AND ubicacion = '${req.body.pais}' LIMIT 9 OFFSET ${saltos};`, {type: QueryTypes.SELECT})
            circuitos = respuesta[0];
            /*
            await Circuitos.findAll({
                where: {
                    ubicacion: req.body.pais,
                    nombre: {
                        [Op.like]: `%${req.body.nombre}%`
                    }
                },
                limit: 9,
                offset: saltos
            });
            */
        } else if (req.body.pais) {
            circuitos = await Circuitos.findAll({
                where: {
                    ubicacion: req.body.pais
                },
                limit: 9,
                offset: saltos
            });
        } else if (req.body.nombre) {
            circuitos = await Circuitos.findAll({
                where: {
                    nombre: {
                        [Op.like]: `%${req.body.nombre}%`
                    }
                },
                limit: 9,
                offset: saltos
            });
        } else {
            circuitos = await Circuitos.findAll({
                limit: 9,
                offset: saltos
            });
        }
        
        res.status(200).json(circuitos);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

export default circuitos;