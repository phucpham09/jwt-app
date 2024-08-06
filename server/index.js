const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const { MONGO_URL, PORT } = process.env;
const Note = require('./models/NoteModel'); 
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);

// Lấy tất cả các ghi chú
app.get("/", async (req, res) => {
  try {
    const notes = await Note.find(); // Lấy tất cả các ghi chú
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Thêm một ghi chú mới
app.post("/add", async (req, res) => {
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
app.delete("/delete/:id", async (req, res) => {
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

