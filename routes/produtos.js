const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../Models/Product')
const Product = mongoose.model("produtos")
const { adminIsOn } = require('../helpers/adminIsOn')

router.get('/', (req, res) => {
    Product.find().then((produtos) => {
        const context = {
            todosProdutos: produtos.map(produtos => {
                return {
                    id: produtos._id,
                    nome: produtos.nome,
                    descricao: produtos.descricao
                }
            })
        }
        res.render("produtos/index", { produtos: context.todosProdutos, admin: adminIsOn(req, res) })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar os produtos")
        res.redirect("/produtos")
    })
})


router.get('/addprod', (req, res) => {
    res.render('produtos/addprod')
})

router.post('/addprod/new', (req, res) => {
    //Validação do formulário

    var error = []
    if (!req.body.name || typeof req.body.name == undefined || typeof req.body.name == null) {
        error.push({ text: "Nome inválido" })
    }

    if (!req.body.description || typeof req.body.description == undefined || typeof req.body.description == null) {
        error.push({ text: "Descrição inválida" })
    }

    if (error.length > 0) {
        res.render("produtos/addprod", { error: error })
    } else {
        const newProduct = {
            nome: req.body.name,
            descricao: req.body.description
        }
        new Product(newProduct).save().then(() => {
            req.flash("success_msg", "Produto cadastrado com sucesso!")
            res.redirect("/produtos/addprod")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao cadastrar o produto, tente novamente.")
            res.redirect("/produtos/addprod")
        })
    }
})

router.get('/updateprod/:id', (req, res) => {
    Product.find({ _id: req.params.id }, 'nome descricao', { limit: 1 }).then((produto) => {
        const context = {
            produtoVar: produto.map(produto => {
                return {
                    id: produto._id,
                    nome: produto.nome,
                    descricao: produto.descricao
                }
            })
        }

        res.render('produtos/updateprod', { produto: context.produtoVar })
    }).catch((err) => {
        req.flash("error_msg", "Este produto não existe")
        res.redirect("/produtos")
    })
})

router.post("/update", (req, res) => {

    var error = []
    if (!req.body.name || typeof req.body.name == undefined || typeof req.body.name == null) {
        error.push({ text: "Nome inválido" })
    }

    if (!req.body.description || typeof req.body.description == undefined || typeof req.body.description == null) {
        error.push({ text: "Descrição inválida" })
    }

    if (error.length > 0) {
        Product.find({ _id: req.body.id }, 'nome descricao', { limit: 1 }).then((produto) => {
            const context = {
                produtoVar: produto.map(produto => {
                    return {
                        id: produto._id,
                        nome: produto.nome,
                        descricao: produto.descricao
                    }
                })
            }
            res.render("produtos/updateprod", { produto: context.produtoVar, admin: adminIsOn(req, res), error: error })
        })
    } else {

        Product.findOne({ _id: req.body.id }, { limit: 1 }).then((produto) => {

            produto.nome = req.body.name
            produto.descricao = req.body.description

            produto.save().then(() => {
                req.flash("success_msg", "Produto alterado com sucesso!")
                res.redirect("/produtos")
            }).catch((err) => {
                req.flash("error_msg", "Falha ao salvar a alteração.")
                res.redirect("/produtos")
            })
        }).catch((err) => {
            req.flash("error_msg", "Produto não encontrado.")
            res.redirect("/produtos")
        })
    }
})

router.post("/deletar", (req, res) => {
    Product.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Produto excluido com sucesso.")
        res.redirect("/produtos")
    }).catch((err) => {
        req.flash("error_msg", "Falha ao excluir o produto.")
        res.redirect("/produtos")
    })
})

module.exports = router