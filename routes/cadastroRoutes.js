const express = require("express")
const router = express.Router()
const axios = require("axios")

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")

router.get('/usuario', (req, res) => {
    res.render("cadastrar_usuario", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user
    })
})

router.get("/os", (req, res) => {
    res.render("cadastrar_os", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user
    })
})

router.post("/os", async (req, res) => {
    const {descricao} = req.body;
    const {id} = req.session.user

    axios.post('http://localhost:8080/os/cadastrar', {
        descricao: descricao,
        id: id
    })
        .then(response => {
            res.render('vizualizar_todas_os', {
                alert: true,
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user
            }) // Ajuste a URL conforme necessário
            
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    
})

module.exports = router