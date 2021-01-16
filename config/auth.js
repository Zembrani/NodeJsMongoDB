const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../Models/usuarioAdmin")
const usuarioAdmin = mongoose.model("usuarioadmin")

module.exports = function(passport) {

    passport.use(new localStrategy({ usernameField: 'login', passwordField: 'senha' }, (login, senha, done) => {
        usuarioAdmin.findOne({ login: login }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: "Esta conta não existe" })
            }

            bcrypt.compare(senha, usuario.senha, (error, batem) => {
                if (batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, { message: "Senha incorreta" })
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        usuarioAdmin.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}