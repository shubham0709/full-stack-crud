const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: String,
    detail: String,
    user_id: String
});

const noteModel = mongoose.model("note", noteSchema);

module.exports = { noteModel };