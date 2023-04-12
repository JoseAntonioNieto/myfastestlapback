import exppress from "express";
import { Circuitos } from "../models/Circuitos.js";

const circuitos = exppress.Router();

circuitos.get("/circuitos", async (req, res) => {
    try {
        const circuitos = Circuitos.findAll();
        res.status(200).json(circuitos);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

export default circuitos;