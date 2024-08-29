const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddlewares")
const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")
// const { default: axios } = require("axios")

const api = require("../config/axiosConfig")

router.get("/todas-os", authMiddleware.verificaLoginTecnicoOuAdministrador, async (req, res) => {    
    try {
        const response = await api.get("/os/listar");
        const listaOs = response.data

        const ordensDeServico = Array.isArray(listaOs) ? listaOs.filter(os => os.status_os === "PENDENTE").reverse() : [];

        res.render("vizualizar_todas_os", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico,
            isAdmin: req.session.user.tipo === "ADMINISTRADOR",
            title: "Painel - Gestão TI"
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_todas_os", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                isAdmin: req.session.user.tipo === "ADMINISTRADOR",
                title: "Painel - Gestão TI"
            });
        } else {
            console.error('Erro ao buscar ordens de serviço:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }
});


router.get("/os-cadastradas", authMiddleware.verificaLogin, async (req, res) => {
    try {
        const response = await api.get(`/os/listar-por-usuario/${req.session.user.id}`)
        const listaOs = response.data

        const ordensDeServico = Array.isArray(listaOs) ? listaOs.reverse() : [];
        // Atualize a renderização com a lista de OS
        res.render("vizualizar_os_cadastradas", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico: ordensDeServico,
            isNotPadrao: req.session.user.tipo !== "PADRAO",
            title: "Registros - Gestão TI"
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_os_cadastradas", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                isNotPadrao: req.session.user.tipo !== "PADRAO",
                title: "Registros - Gestão TI"
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

        const response = await api.get(`/os/atribuicao/${id}`)
        const listaOs = response.data

        const ordensDeServico = Array.isArray(listaOs) ? listaOs.filter(os => os.status_os === "PENDENTE").reverse() : [];

        res.render("vizualizar_os_atribuidas", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico,
            title: "Atribuições - Gestão TI"
        })    
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_os_atribuidas", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                title: "Atribuições - Gestão TI"
            });
        } else {
            console.error('Erro ao buscar ordens de serviço:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

router.get("/cadastro-os", authMiddleware.verificaLogin, async (req, res) => {
    const response = await api.get("/usuario/listar")
    const tecnicos = response.data.filter(usuario => usuario.tipo !== "PADRAO");

    res.render("cadastrar_os", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        tipoUsuario: req.session.user.tipo,
        usuarioId: req.session.user.id,
        tecnicos,
        titulo: "Cadastrar nova OS",
        botao: "Cadastrar",
        editarDescricao: true,
        title: "Registro de OS - Gestão TI"
    })
})

router.get("/historico-os", authMiddleware.verificaLoginTecnicoOuAdministrador,async (req, res) => {
    try {
        const response = await api.get("/os/listar")
        const listaOs = response.data

        const ordensDeServico = Array.isArray(listaOs) ? listaOs.filter(os => os.status_os !== "PENDENTE").reverse() : [];

        res.render("vizualizar_historico_os", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico,
            title: "Histórico - Gestão TI"
        })    
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_historico_os", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                title: "Atribuições - Gestão TI"
            });
        } else {
            console.error('Erro ao buscar ordens de serviço:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

router.get("/atribuir/:id", authMiddleware.verificaLoginAdministrador, async (req, res) => {
    try {
        const idOs = req.params.id

        const response = await api.get("/usuario/listar")
        const tecnicos = response.data.filter(usuario => usuario.tipo !== "PADRAO");

        const osResponse = await api.get(`/os/listar/${idOs}`);
        const ordemDeServico = osResponse.data;

        res.render("atribuir_os", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            tipoUsuario: req.session.user.tipo,
            usuarioId: req.session.user.id,
            tecnicos,
            idOs,
            descricao: ordemDeServico.descricao,
            title: "Atribuição - Gestão TI"
        })
    } catch (error) {
        res.json({error: error.message})
    }
})


router.get("/usuarios", authMiddleware.verificaLoginAdministrador, async (req, res) => {
    try {
        const response = await api.get("/usuario/listar")
        const listaUsuarios = response.data.filter(usuario => usuario.id !== 1)

        res.render("vizualizar_usuario", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            listaUsuarios,
            title: "Lista de Usuários - Gestão TI"
        })
    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/cadastro-usuario', authMiddleware.verificaLoginAdministrador, (req, res) => {
    res.render("cadastrar_usuario", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        title: "Cadastro de Usuário - Gestão TI"
    })
})

router.get('/editar/:id', authMiddleware.verificaLoginAdministrador, async (req, res) => {
    try {
        const {id} = req.params
        
        const response = await api.get(`/usuario/listar/${id}`)
        const usuario = response.data

        res.render("editar_usuario", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            title: "Editar usuário - Gestão TI",
            usuario
        })

    } catch (error) {
        res.json({error: error.message})
    }
})




module.exports = router