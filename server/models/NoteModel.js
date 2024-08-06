const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Your title is required"],
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Your content is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  });
  
  
module.exports = mongoose.model("Note", noteSchema);