const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const InfoContato = new Schema({
    contato: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("infoContato", InfoContato)