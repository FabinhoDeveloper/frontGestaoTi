const express = require("express")
const router = express.Router()
const axios = require("axios")

const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")
const authMiddleware = require("../middlewares/authMiddlewares")

const api = require("../config/axiosConfig") // Importação da URL padrão


router.post("/os", async (req, res) => {
    const {descricao, tecnicoId} = req.body;
    const {id} = req.session.user

    try {
        // Enviar dados para o endpoint de cadastro de OS
        await api.post('/os/cadastrar', {
            descricao: descricao,
            id: id,
            tecnicoId
        });

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
    

    api.post('/usuario/cadastrar', {
        nome,
        email,
        senha,
        tipo,
        local_de_trabalho
    })
        .then(response => {
            res.redirect("/vizualizar/usuarios")
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
        });
    
})

router.delete("/os/concluir/:id", async (req, res) => {
    const {id} = req.params

    api.post("/os/concluir", {
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

router.post("/atribuir/os", authMiddleware.verificaLogin, async (req, res) => {
    const { idOs, tecnicoId } = req.body;
    
    try {
        const osAtribuida = await api.post(`/os/atribuir/${idOs}`, { idUsuario: tecnicoId });

        res.redirect("/vizualizar/todas-os");
    } catch (error) {
        console.error("Erro ao atribuir OS:", error);
        res.status(500).send("Erro ao atribuir OS.");
    }
});


module.exports = router