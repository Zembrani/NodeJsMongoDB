const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()

//Rotas
const admin = require('./routes/admin')
const sobrenos = require('./routes/sobrenos')
const produtos = require('./routes/produtos')
const localizacao = require('./routes/localizacao')
const contato = require('./routes/contato')

const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require('./config/auth')(passport)


// Configurações
// Sessão
app.use(session({
        secret: "chave123",
        resave: true,
        saveUninitialized: true
    }))
    // Iniciando o passport, deve ser exatamente aqui, entre a sessão e o flash
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Midleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

// Body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/loja").then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Falha ao se conectar: " + err)
})

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Rotas
app.get('/', (req, res) => {
    res.render('home')
})

app.use('/sobrenos', sobrenos)
app.use('/produtos', produtos)
app.use('/localizacao', localizacao)
app.use('/contato', contato)
app.use('/admin', admin)

// outros
const PORT = 8090
app.listen(PORT, () => {
    console.log("Servidor rodando!...")
})