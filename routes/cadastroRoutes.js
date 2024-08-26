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

router.get("/os", authMiddleware.verificaLogin, async (req, res) => {
    const response = await axios.get("http://localhost:8080/usuario/listar")
    const tecnicos = response.data.filter(usuario => usuario.tipo !== "PADRAO");

    res.render("cadastrar_os", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        tipoUsuario: req.session.user.tipo,
        usuarioId: req.session.user.id,
        tecnicos
    })
})

router.post("/os", async (req, res) => {
    const {descricao, tecnicoId} = req.body;
    const {id} = req.session.user

    try {
        // Enviar dados para o endpoint de cadastro de OS
        await axios.post('http://localhost:8080/os/cadastrar', {
            descricao: descricao,
            id: id,
            tecnicoId
        });

        // Definir mensagens de sucesso na sessão
        req.session.alert = true;
        req.session.mensagem = "OS cadastrada com sucesso!";

        // Redirecionar com base no tipo de usuário
        if (req.session.user.tipo !== 'PADRAO') {
            res.redirect("/vizualizar/todas-os");
        } else {
            res.redirect("/vizualizar/os-cadastradas");
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);

        // Tratar erro (opcional, você pode definir uma mensagem de erro na sessão ou redirecionar para uma página de erro)
        req.session.alert = false;
        req.session.mensagem = "Erro ao cadastrar OS. Tente novamente mais tarde.";
        res.redirect("/vizualizar/os-cadastradas"); // Redirecionar para uma página apropriada em caso de erro
    }
});

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