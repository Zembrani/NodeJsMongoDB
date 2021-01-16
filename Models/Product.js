const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Product = new Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("produtos", Product)