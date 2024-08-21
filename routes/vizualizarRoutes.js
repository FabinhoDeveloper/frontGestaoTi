const express = require("express")
const router = express.Router()

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")

router.get("/todas-os", async (req, res) => {
    res.render("vizualizar_todas_os", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user
    })
})

router.get("/os-cadastradas", async (req, res) => {
    res.render("vizualizar_os_cadastradas", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user
    })
})

router.get("/os-atribuidas", async (req, res) => {
    res.render("vizualizar_os_atribuidas", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user
    })
})

router.get("/usuarios", async (req, res) => {
    res.render("vizualizar_usuario", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user
    })
})

module.exports = router