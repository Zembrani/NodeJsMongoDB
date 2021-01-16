const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../Models/InfoContato')
const InfoContato = mongoose.model("infoContato")
const { adminIsOn } = require('../helpers/adminIsOn')

router.get('/', (req, res) => {

    InfoContato.find().then((contatos) => {
        const context = {
            todosContatos: contatos.map(contatos => {
                return {
                    id: contatos._id,
                    contato: contatos.contato
                }
            })
        }
        res.render("contato/index", { contatos: context.todosContatos, admin: adminIsOn(req, res) })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar o conteúdo")
        res.redirect("contato/index")
    })
})

router.get('/add', (req, res) => {
    res.render('contato/add')
})

router.post('/add/new', (req, res) => {
    //Validação do formulário

    var error = []
    if (!req.body.contato || typeof req.body.contato == undefined || typeof req.body.contato == null) {
        error.push({ text: "Nome inválido" })
    }

    if (error.length > 0) {
        res.render("contato/", { error: error })
    } else {
        const newContato = {
            contato: req.body.contato,
        }
        new InfoContato(newContato).save().then(() => {
            req.flash("success_msg", "Contato cadastrado com sucesso!")
            res.redirect("/contato/")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao cadastrar o contato, tente novamente.")
            res.redirect("/contato/")
        })
    }
})

router.get('/update/:id', (req, res) => {
    InfoContato.find({ _id: req.params.id }, 'contato', { limit: 1 }).then((contato) => {
        const context = {
            contatoVar: contato.map(contato => {
                return {
                    id: contato._id,
                    contato: contato.contato,
                }
            })
        }
        res.render('contato/update', { contatovar: context.contatoVar })
    }).catch((err) => {
        req.flash("error_msg", "Este contato não existe")
        res.redirect("/contato")
    })
})

router.post('/update', (req, res) => {
    var error = []
    if (!req.body.contato || typeof req.body.contato == undefined || typeof req.body.contato == null) {
        error.push({ text: "Contato inválido" })
    }

    if (error.length > 0) {
        InfoContato.find({ _id: req.body.id }, 'contato', { limit: 1 }).then((contato) => {

            const context = {
                contatoVar: contato.map(contato => {
                    return {
                        id: contato._id,
                        contato: contato.contato,
                    }
                })
            }
            res.render('contato/update', { contatovar: context.contatoVar, error: error })
        })
    } else {
        InfoContato.findOne({ _id: req.body.id }, 'contato', { limit: 1 }).then((contato) => {

            contato.contato = req.body.contato

            contato.save().then(() => {
                req.flash("success_msg", "Contato alterado com sucesso!")
                res.redirect("/contato")
            }).catch((err) => {
                req.flash("error_msg", "Falha ao salvar a alteração.")
                res.redirect("/contato")
            })
        }).catch((err) => {
            req.flash("error_msg", "Contato não encontrado.")
            res.redirect("/contato")
        })
    }
})

router.post("/deletar", (req, res) => {
    InfoContato.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Contato excluido com sucesso.")
        res.redirect("/contato")
    }).catch((err) => {
        req.flash("error_msg", "Falha ao excluir contato.")
        res.redirect("/contato")
    })
})
module.exports = router