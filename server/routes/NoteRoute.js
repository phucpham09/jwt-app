const express = require("express");
const router = express.Router();
const Note = require("../models/NoteModel");


router.get("/", async (req, res) => {
    try {
        const notes = await Note.find(); // Lấy tất cả các ghi chú
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// Thêm một ghi chú mới
router.post("/add", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({
            title,
            content
        });
        const savedNote = await newNote.save(); // Lưu ghi chú mới vào MongoDB
        res.status(201).json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding note' });
    }
});

// Xóa một ghi chú theo ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedNote = await Note.findByIdAndDelete(id); // Xóa ghi chú theo ID
        if (deletedNote) {
            res.json(deletedNote);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting note' });
    }
});

module.exports = router;
