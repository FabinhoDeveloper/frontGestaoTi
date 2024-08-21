const express = require('express')
const router = express.Router()
const axios = require("axios")

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")



router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao encerrar a sessão!');
        }
        res.redirect('/login'); // Redirecionar para a página de login após o logout
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.get(`http://localhost:8080/usuario/listar/email/${email}`);
        const usuarioValido = response.data;

        if (usuarioValido && usuarioValido.senha === password) {
            req.session.user = usuarioValido; // Define o usuário na sessão
            res.render('vizualizar_todas_os', {
                layout: verificaTipoUsuario(req.session.user)
            });
        } else {
            res.render('login', { title: 'Login - Gestão TI', error: 'Email ou senha inválidos!' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao realizar login' });
    }
});


module.exports = router