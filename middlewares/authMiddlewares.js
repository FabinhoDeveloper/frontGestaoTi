module.exports = {
    verificaLoginAdministrador(req, res, next) {
        if (req.session.user && req.session.user.tipo === "ADMINISTRADOR") {
            next();
        } else {
            res.redirect('/?error=Não autorizado!');
        }
    },
    
    verificaLoginTecnicoOuAdministrador(req, res, next) {
        if (req.session.user && (req.session.user.tipo === "TECNICO" || req.session.user.tipo === "ADMINISTRADOR")) {
            next();
        } else {
            res.redirect('/?error=Não autorizado!');
        }
    },
    
    verificaLogin(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/?error=Não autorizado!');
        }
    }
    
}