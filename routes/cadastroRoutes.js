const express = require("express")
const router = express.Router()
const axios = require("axios")

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")
const authMiddleware = require("../middlewares/authMiddlewares")


router.get('/usuario', authMiddleware.verificaLoginAdministrador, (req, res) => {
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

    // const response = await axios.get("http://localhost:8080/os/listar")
    // const listasOs = response.data

    axios.post('http://localhost:8080/os/cadastrar', {
        descricao: descricao,
        id: id
    })
        .then(response => {
            // res.render('vizualizar_todas_os', {
            //     alert: true,
            //     layout: verificaTipoUsuario(req.session.user),
            //     user: req.session.user,
            //     ordensDeServico: listasOs

            // }) 
            req.session.alert = true
            res.redirect("/vizualizar/todas-os")
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    
})

router.post("/usuario", async (req, res) => {
    const {nome, email, senha, tipo, local_de_trabalho} = req.body;
    

    axios.post('http://localhost:8080/usuario/cadastrar', {
        nome,
        email,
        senha,
        tipo,
        local_de_trabalho
    })
        .then(response => {
            res.render('vizualizar_usuario', {
                alert: true,
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user
            }) 
            
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    
})

module.exports = router