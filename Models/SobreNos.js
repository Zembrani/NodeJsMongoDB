const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const SobreNos = new Schema({
    titulo: {
        type: String,
        required: true
    },
    sobre: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("sobrenos", SobreNos)