const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddlewares")
const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")
const { default: axios } = require("axios")

router.get("/todas-os", authMiddleware.verificaLoginTecnicoOuAdministrador ,async (req, res) => {    
    if (!req.session.user) {
        return res.redirect('/'); // Redirecionar se não houver sessão
    }

    // const userId = req.session.user.id;
    
    const response = await axios.get("http://localhost:8080/os/listar")
    const listasOs = response.data

    res.render("vizualizar_todas_os", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        ordensDeServico: listasOs.reverse(),
        alert: req.session.alert,
        isAdmin: req.session.user.tipo === "ADMINISTRADOR"
    })
})

router.get("/os-cadastradas", authMiddleware.verificaLogin, async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:8080/os/listar/${req.session.user.id}`);
        const listaOs = response.data;

        // Atualize a renderização com a lista de OS
        res.render("vizualizar_os_cadastradas", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico: listaOs.reverse(),
            isNotPadrao: req.session.user.tipo !== "PADRAO"
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

router.get("/os-atribuidas", authMiddleware.verificaLoginTecnicoOuAdministrador, async (req, res) => {
    try {
        const id = req.session.user.id

        const response = await axios.get(`http://localhost:8080/os/atribuicao/${id}`)
        const listaOs = response.data

        console.log(listaOs)

        res.render("vizualizar_os_atribuidas", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico: listaOs.reverse()
        })    
    } catch (error) {
        
    }
    
    
})

router.get("/usuarios", authMiddleware.verificaLoginAdministrador, async (req, res) => {
    const response = await axios.get("http://localhost:8080/usuario/listar")
    const listaUsuarios = response.data

    res.render("vizualizar_usuario", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        listaUsuarios
    })
})

module.exports = router