const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UsuarioAdmin = new Schema({
    login: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    online: {
        type: Number,
        default: 0
    }

})

mongoose.model("usuarioadmin", UsuarioAdmin)