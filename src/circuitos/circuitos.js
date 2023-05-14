import exppress from "express";
import { Op } from "sequelize";
import QueryTypes from "sequelize";
import { sequelize } from "../database/database.js";
import { Circuitos } from "../models/Circuitos.js";
import { Usuarios } from "../models/Usuarios.js";
import { verify, getId } from "../auth.js";
import { CircuitosUsuarios } from "../models/Circuitos_Usuarios.js";

const circuitos = exppress.Router();

/**
 * @swagger
 * tags:
 *  name: Circuitos
 *  description: Circuitos
 * /api/getCircuitos:
 *  post:
 *      sumary: Obtener todos los circuitos
 *      tags: [Circuitos]
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: Filtros
 *            description: Filtros para obtener los circuitos
 *            schema:
 *                  type: object
 *                  required:
 *                      - pagina
 *                      - pais
 *                      - nombre
 *                  properties:
 *                      pagina:
 *                          type: number
 *                      pais:
 *                          type: string
 *                      nombre:
 *                          type: string
 *      responses:
 *          200:
 *              description: Reserva realizada
 *              content:
 *                  application/json:
 *                      type: array
 * /api/circuito/{id}:
 *  get:
 *      sumary: Informacion del circuito
 *      tags: [Circuitos]
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: Id del circuito
 *      responses:
 *          200:
 *              description: Informacion del circuito
 *              content:
 *                  application/json:
 *                      type: array
 * /api/circuitosUsuario:
 *  get:
 *      summary: Circuitos del que es administrador el usuario
 *      tags: [Circuitos]
 *      consumes:
 *          - application/json
 *      responses:
 *          200:
 *              description: Circuitos del que es administrador el usuario
 *              content:
 *                  application/json:
 *                      type: array
 */

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

circuitos.get("/circuito/:id", async (req, res) => {
    try {
        const circuito = await Circuitos.findOne({
            where: {
                id_circuito: req.params.id
            }
        });
        res.status(200).json(circuito);
    } catch (err) {
        res.status(404).send(err.message);
    }

});

circuitos.get("/circuitosUsuario", async (req, res) => {
    try {
        console.log(req.headers["authentication"]);
        await verify(req.headers["authentication"]);
        const user_id = await getId(req.headers["authentication"]);

        const usuario = await Usuarios.findOne({
            where: {
                user_id: user_id
            }
        });

        if (usuario.rol == "admin") {
            const circuitos = await CircuitosUsuarios.findAll({
                where: {
                    user_id: user_id
                },
            });
            const circuitoTotal = [];

            for (let i = 0; i < circuitos.length; i++) {
                const circuito = await Circuitos.findOne({
                    where: {
                        id_circuito: circuitos[i].id_circuito
                    }
                });

                circuitoTotal.push(circuito);
            }
            res.status(200).json(circuitoTotal);
        } else {
            res.status(401).send("El rol que tienes asignado no puede realizar esta acción");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
    
})

export default circuitos;