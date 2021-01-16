const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../Models/usuarioAdmin')
const UsuarioAdmin = mongoose.model("usuarioadmin")
const passport = require('passport')
const { adminIsOn } = require('../helpers/adminIsOn')

router.get('/', (req, res) => {
    res.render("admin/index", { admin: adminIsOn(req, res) })
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/sobrenos",
        failureRedirect: "/admin",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect("/admin")
})

module.exports = router