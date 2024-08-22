const express = require('express')
const router = express.Router()
const axios = require("axios")

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario");
const { verificaLoginTecnico } = require('../middlewares/authMiddlewares');



router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao encerrar a sessão!');
        }
        res.redirect('/'); // Redirecionar para a página de login após o logout
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.get(`http://localhost:8080/usuario/listar/email/${email}`);
        const usuarioValido = response.data;

        if (usuarioValido && usuarioValido.senha === password) {
            req.session.user = usuarioValido;
            console.log('Usuário salvo na sessão:', req.session.user);

            if (usuarioValido.tipo !== 'PADRAO') {
                res.redirect("/vizualizar/todas-os");
            } else {
                res.redirect("/vizualizar/os-cadastradas");
            }
        } else {
            res.render('login', {
                title: 'Login - Gestão TI',
                error: 'Email e/ou senha inválidos!',
                layout: 'login'
            });
        }
    } catch (error) {
        res.render("login", {
            layout: 'login',
            error: 'Erro ao processar a solicitação'
        });
    }
});




module.exports = router