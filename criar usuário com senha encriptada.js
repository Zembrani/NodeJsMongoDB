var bcrypt = require('bcrypt')

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync('loja123', salt);

const usuarioAdmin = {
    login: 'Admin',
    senha: hash
}

new UsuarioAdmin(usuarioAdmin).save().then(() => {
    req.flash("success_msg", "Usuário cadastrado com sucesso!")
    res.redirect("/admin")
}).catch((err) => {
    req.flash("error_msg", "Houve erro ao cadastrar o Usuário, tente novamente.")
    res.redirect("/admin")
})