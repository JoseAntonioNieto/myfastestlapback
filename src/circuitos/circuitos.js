import exppress from "express";
import { Op } from "sequelize";
import QueryTypes from "sequelize";
import { sequelize } from "../database/database.js";
import { Circuitos } from "../models/Circuitos.js";

const circuitos = exppress.Router();

circuitos.post("/getCircuitos", async (req, res) => {

    const saltos = req.body.pagina * 9 - 9;

    try {
        let circuitos;
        let numeroCircuitos;

        if ((req.body.pais && req.body.pais != "") && (req.body.nombre && req.body.nombre != "")) {
            const nombre = req.body.nombre;
            const respuesta = await sequelize.query(`SELECT * FROM circuitos WHERE LOWER(nombre) LIKE '%${nombre.toLowerCase()}%' AND ubicacion = '${req.body.pais}' LIMIT 9 OFFSET ${saltos};`, {type: QueryTypes.SELECT})
            circuitos = respuesta[0];

            const respuestaCantidad = await sequelize.query(`SELECT COUNT(*) FROM circuitos WHERE LOWER(nombre) LIKE '%${nombre.toLowerCase()}%' AND ubicacion = '${req.body.pais}';`, {type: QueryTypes.SELECT});
            numeroCircuitos = parseInt(respuestaCantidad[0][0].count);
        } else if (req.body.pais && req.body.pais != "") {
            circuitos = await Circuitos.findAll({
                where: {
                    ubicacion: req.body.pais
                },
                limit: 9,
                offset: saltos
            });

            numeroCircuitos = await Circuitos.count({
                where: {
                    ubicacion: req.body.pais
                },
            });
        } else if (req.body.nombre && req.body.nombre != "") {
            const nombre = req.body.nombre;
            const respuesta = await sequelize.query(`SELECT * FROM circuitos WHERE LOWER(nombre) LIKE '%${nombre.toLowerCase()}%' LIMIT 9 OFFSET ${saltos};`, {type: QueryTypes.SELECT});
            circuitos = respuesta[0];

            const respuestaCantidad = await sequelize.query(`SELECT COUNT(*) FROM circuitos WHERE LOWER(nombre) LIKE '%${nombre.toLowerCase()}%';`, {type: QueryTypes.SELECT});
            numeroCircuitos = parseInt(respuestaCantidad[0][0].count);
        } else {
            circuitos = await Circuitos.findAll({
                limit: 9,
                offset: saltos
            });
            numeroCircuitos = await Circuitos.count();
        }
        
        res.status(200).json([circuitos, {
            cantidadCircuitos: numeroCircuitos
        }]);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

export default circuitos;