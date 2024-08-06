const router = require("express").Router();
import bodyParser from "body-parser";
router.post("/add", async(req, res) =>{
    try {
        const {title, content} = req.body;
        const result = await db.query("INSERT INTO note (title, content) VALUES ($1, $2) RETURNING *", [title, content]);
        const newNote = result.rows[0];
        res.status(201).json(newNote);
    } catch (error) {
        console.log(error);
    }
})