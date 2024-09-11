const express = require("express")
const router = express.Router()

const api = require("../config/axiosConfig") // Importação da URL padrão

router.post('/os', async (req, res) => {
    const { descricao, tecnicoId } = req.body;
    const { id } = req.session.user;
        
    try {
        // Enviar dados para o endpoint de cadastro de OS
        await api.post('/os/cadastrar', {
            descricao: descricao,
            id: id,
            tecnicoId
        });
        
        // Enviar uma resposta indicando sucesso
        res.json({ success: true, message: 'OS cadastrada com sucesso' });
    } catch (error) {
        // Enviar uma resposta indicando erro
        res.json({ success: false, message: 'Erro ao cadastrar OS' });
    }   
});

router.post('/os/atribuir/:id', async (req, res) => {
    const {id} = req.params
    const {idUsuario} = req.body

    try {
        await api.post(`/os/atribuir/${id}`, {
            idUsuario
        })

        res.json({ success: true, message: 'OS atribuída com sucesso' });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao cadastrar OS' });
    }
})

router.post("/os/concluir/:id", async (req, res) => {
    const {id} = req.params

    try {
        await api.post(`/os/concluir/${id}`)

        res.json({ success: true, message: 'OS concluída com sucesso' });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao concluir OS' });
    }
})

router.post("/os/cancelar/:id", async (req, res) => {
    const {id} = req.params

    try {
        await api.post(`/os/cancelar/${id}`)

        res.json({ success: true, message: 'OS cancelada com sucesso' });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao cancelar OS' });
    }
})

router.post("/usuario", async (req, res) => {
    const {nome, email, senha, tipo, local_de_trabalho} = req.body;
    
    try {
        await api.post('/usuario/cadastrar', {
            nome,
            email,
            senha,
            tipo,
            local_de_trabalho
        })
        
        res.json({ success: true, message: 'Usuário cadastrado com sucesso' });

    } catch (error) {
        res.json({ success: false, message: 'Erro ao cadastrar usuário' });
    }
})

router.put("/usuario/editar/:idUsuario", async (req, res) => {
    const {idUsuario} = req.params
    const {nome, email, senha, tipo, local_de_trabalho} = req.body;

    try {
        await api.put(`/usuario/editar/${idUsuario}`, {
            nome,
            email,
            senha,
            tipo,
            local_de_trabalho
        })
        
        res.json({ success: true, message: 'Usuário editado com sucesso' });

    } catch (error) {
        res.json({ success: false, message: 'Erro ao editar usuário' });
    }
})

router.delete("/usuario/deletar/:id", async (req, res) => {
    const {id} = req.params

    try {
        await api.delete(`/usuario/deletar/${id}`)

        res.json({ success: true, message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao deletar usuário' });
    }
}) 


module.exports = router