import express from "express";
import verify from "../auth.js";

const user_data = express.Router();

user_data.get("/user_data", async (req, res) => {
    // req.headers["authentication"]
    try {
        const payload = await verify(req.headers["authentication"]);
        res.status(200).json(payload);
    } catch (err) {
        res.status(401).send(err.message);
    }
});

export default user_data;