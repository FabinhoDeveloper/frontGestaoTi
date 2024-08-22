const express = require("express")
const router = express.Router()

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")
const { default: axios } = require("axios")

router.get("/todas-os", async (req, res) => {
    console.log('Usuário:', req.session.user);
    
    if (!req.session.user) {
        return res.redirect('/'); // Redirecionar se não houver sessão
    }

    const userId = req.session.user.id;
    console.log('ID do Usuário:', userId);
    
    const response = await axios.get("http://localhost:8080/os/listar")
    const listasOs = response.data
    console.log(req.session.user)

    res.render("vizualizar_todas_os", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        ordensDeServico: listasOs,
        alert: req.session.alert || false
    })
})

router.get("/os-cadastradas", async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:8080/os/listar/${req.session.user.id}`);
        const listaOs = response.data;
    
        // Atualize a renderização com a lista de OS
        res.render("vizualizar_os_cadastradas", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico: listaOs
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_os_cadastradas", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                mensagem: "Nenhuma OS encontrada para este usuário."
            });
        } else {
            console.error('Erro ao buscar ordens de serviço:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }    
});



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