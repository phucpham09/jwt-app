const express = require("express");
const router = express.Router();
const Note = require("../models/NoteModel");
const { userVerification } = require("../middleware/authMiddleware");

// Sử dụng middleware cho các tuyến đường
router.use(userVerification);

// Lấy tất cả các ghi chú của người dùng cụ thể
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
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
      content,
      userId: req.userId, // Lưu userId vào ghi chú
    });
    const savedNote = await newNote.save();
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
    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: req.userId });
    if (deletedNote) {
      res.json(deletedNote);
    } else {
      res.status(404).json({ message: 'Note not found or unauthorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;
