const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../Models/SobreNos')
const SobreNos = mongoose.model("sobrenos")
const { adminIsOn } = require('../helpers/adminIsOn')

router.get('/', (req, res) => {

    SobreNos.find({}, 'sobre titulo', {}).then((sobrenos) => {
        const context = {
            sobre: sobrenos.map(sobrenos => {
                return {
                    id: sobrenos._id,
                    sobre: sobrenos.sobre,
                    titulo: sobrenos.titulo
                }
            })
        }
        res.render("sobrenos/index", { sobrenos: context.sobre, admin: adminIsOn(req, res) })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar o conteúdo")
        res.redirect("sobrenos/index")
    })
})

router.get('/add', (req, res) => {
    res.render('sobrenos/add')
})

router.post('/add', (req, res) => {
    //Validação do formulário

    var error = []
    if (!req.body.sobre || typeof req.body.sobre == undefined || typeof req.body.sobre == null) {
        error.push({ text: "Nome inválido" })
    }

    if (!req.body.titulo || typeof req.body.titulo == undefined || typeof req.body.titulo == null) {
        error.push({ text: "Nome inválido" })
    }

    if (error.length > 0) {
        res.render("sobrenos/", { error: error })
    } else {
        const newTexto = {
            sobre: req.body.sobre,
            titulo: req.body.titulo
        }
        new SobreNos(newTexto).save().then(() => {
            req.flash("success_msg", "Texto cadastrado com sucesso!")
            res.redirect("/sobrenos/")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao cadastrar o texto, tente novamente.")
            res.redirect("/sobrenos/")
        })
    }
})

router.get("/update/:id", (req, res) => {
    SobreNos.find({ _id: req.params.id }, 'sobre titulo', { limit: 1 }).then((sobrenos) => {
        const context = {
            sobre: sobrenos.map(sobrenos => {
                return {
                    id: sobrenos._id,
                    titulo: sobrenos.titulo,
                    sobre: sobrenos.sobre
                }
            })
        }
        res.render("sobrenos/update", { sobrenos: context.sobre })
    }).catch((err) => {
        req.flash("error_msg", "Não é possivel acessar esta tela")
        res.redirect("/sobrenos")
    })
})

router.post("/update", (req, res) => {
    var error = []
    if (!req.body.sobre || typeof req.body.sobre == undefined || typeof req.body.sobre == null) {
        error.push({ text: "Texto inválido" })
    }
    if (error.length > 0) {
        SobreNos.find({ _id: req.body.id }, 'sobre titulo', { limit: 1 }).then((sobrenos) => {
            const context = {
                sobre: sobrenos.map(sobrenos => {
                    return {
                        id: sobrenos._id,
                        titulo: sobrenos.titulo,
                        sobre: sobrenos.sobre
                    }
                })
            }
            res.render("sobrenos", { sobrenos: context.sobre, admin: true, error: error })
        })
    } else {

        SobreNos.findOne({ _id: req.body.id }, 'sobre titulo', { limit: 1 }).then((sobrenos) => {

            sobrenos.titulo = req.body.titulo
            sobrenos.sobre = req.body.sobre

            sobrenos.save().then(() => {
                req.flash("success_msg", "Texto Sobre nós alterado com sucesso!")
                res.redirect("/sobrenos")
            }).catch((err) => {
                req.flash("error_msg", "Falha ao salvar o texto.")
                res.redirect("/sobrenos")
            })
        }).catch((err) => {
            req.flash("error_msg", "Falha ao encontrar o texto.")
            res.redirect("/sobrenos")
        })
    }
})

router.post("/deletar", (req, res) => {
    SobreNos.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Texto excluido com sucesso.")
        res.redirect("/sobrenos")
    }).catch((err) => {
        req.flash("error_msg", "Falha ao excluir o texto.")
        res.redirect("/sobrenos")
    })
})

module.exports = router