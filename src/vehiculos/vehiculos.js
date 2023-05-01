import express from "express";
import { verify, getId } from "../auth.js";
import { Vehiculos } from "../models/Vehiculos.js";
import { UsuariosVehiculos } from "../models/Usuarios_Vehiculos.js";

const vehiculos = express.Router();

vehiculos.post("/vehiculos", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);

        const vehiculo_existe = await Vehiculos.count({
            where: {
                matricula: req.body.matricula
            }
        });

        if (vehiculo_existe == 0) {
            const vehiculo = await Vehiculos.create({
                matricula: req.body.matricula,
                nombre_conductor: req.body.nombre_conductor,
                dni_titular: req.body.dni_titular,
                nombre_titular: req.body.nombre_titular
            });
    
            await UsuariosVehiculos.create({
                matricula: req.body.matricula,
                usuario_id: usuario_id
            });
    
            res.status(200).json(vehiculo);
        } else {
            res.status(200).json({
                eliminado: false
            });
        }

        
    } catch (err) {
        res.status(401).send(err.message);
    }
});

vehiculos.get("/vehiculos", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);
        const vehiculos_usuario = await UsuariosVehiculos.findAll({
            where: {
                usuario_id: usuario_id
            }
        });

        const matriculas = [];
        vehiculos_usuario.forEach(async element => {
            matriculas.push(element.matricula);
        });

        var vehiculos = [];
        for (let i = 0; i < matriculas.length; i++) {
            const vehiculo = await Vehiculos.findAll({
                where: {
                    matricula: matriculas[i]
                }
            });
            vehiculos.push(vehiculo[0]);
        }
        res.status(200).json(vehiculos);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

vehiculos.delete("/vehiculos/:matricula", async (req, res) => {
    try {
        await verify(req.headers["authentication"]);
        const usuario_id = await getId(req.headers["authentication"]);
        await UsuariosVehiculos.destroy({
            where: {
                matricula: req.params.matricula,
                usuario_id: usuario_id
            }
        });

        const mat_veh_usu_ex = await UsuariosVehiculos.count({
            where: {
                matricula: req.params.matricula
            }
        });

        if (mat_veh_usu_ex == 0) {
            await Vehiculos.destroy({
                where: {
                    matricula: req.params.matricula
                }
            });
        }

        res.status(200).json({
            eliminado: true
        });
    } catch (err) {
        res.status(401).send(err.message);
    }
});

export default vehiculos;