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

router.get("/os", authMiddleware.verificaLogin, (req, res) => {
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
            req.session.mensagem = "OS cadastrada com sucesso!"

            if (req.session.user.tipo !== 'PADRAO') {
                res.redirect("/vizualizar/todas-os")
            } else {
                res.redirect("/vizualizar/os-cadastradas")
            }
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
            // res.render('vizualizar_usuario', {
            //     alert: true,
            //     layout: verificaTipoUsuario(req.session.user),
            //     user: req.session.user
            // }) 

            req.session.alert = true
            res.redirect("/vizualizar/usuarios")
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    
})

router.delete("/os/concluir/:id", async (req, res) => {
    const {id} = req.params

    axios.post("http://localhost:8080/os/concluir", {
        id
    }).then(response => {
        req.session.alert = true
        if (req.session.user.tipo !== "PADRAO") {
            res.redirect("/vizualizar/todas-os")
        } else {
            res.redirect("/vizualizar/os-cadastradas")
        }
        
    })
})

module.exports = router