module.exports = {
    verificaLoginAdministrador(req, res, next) {
        if (req.session.user.tipo === "ADMINISTRADOR") {
            next()
        } else {
            res.redirect('/login?error=Não autorizado!');
        }
    },

    verificaLoginTecnico(req, res, next) {
        if (req.session.user.tipo === "TECNICO") {
            next()
        } else {
            res.redirect('/login?error=Não autorizado!');
        }
    },

    verificaLogin(req, res, next) {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/login?error=Não autorizado!');
        }
    }
}