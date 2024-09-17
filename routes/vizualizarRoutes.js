const express = require("express")
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddlewares")
const verificaTipoUsuario = require("../middlewares/verificaTipoUsuario")
// const { default: axios } = require("axios")

const api = require("../config/axiosConfig")

const baseURL = "http://192.168.2.140:8081"

router.get("/todas-os", authMiddleware.verificaLoginTecnicoOuAdministrador, async (req, res) => {    
    try {
        const response = await api.get("/os/listar");
        const listaOs = response.data

        const ordensDeServico = Array.isArray(listaOs) ? listaOs.filter(os => os.status_os === "PENDENTE").reverse() : [];

        res.render("vizualizar_todas_os", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            usuarioId: req.session.user.id,
            ordensDeServico,
            isAdmin: req.session.user.tipo === "ADMINISTRADOR",
            title: "Painel - Gestão TI",
            baseURL
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_todas_os", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                isAdmin: req.session.user.tipo === "ADMINISTRADOR",
                title: "Painel - Gestão TI",
                baseURL
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
            title: "Registros - Gestão TI",
            baseURL
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_os_cadastradas", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                isNotPadrao: req.session.user.tipo !== "PADRAO",
                title: "Registros - Gestão TI",
                baseURL
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

        console.log(ordensDeServico)

        res.render("vizualizar_os_atribuidas", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            ordensDeServico,
            title: "Atribuições - Gestão TI",
            baseURL
        })    
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_os_atribuidas", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                title: "Atribuições - Gestão TI",
                baseURL
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
        isNotPadrao: req.session.user.tipo !== "PADRAO",
        tecnicos,
        titulo: "Cadastrar nova OS",
        botao: "Cadastrar",
        editarDescricao: true,
        title: "Registro de OS - Gestão TI",
        baseURL
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
            title: "Histórico - Gestão TI",
        })    
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_historico_os", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                title: "Atribuições - Gestão TI",
            });
        } else {
            console.error('Erro ao buscar ordens de serviço:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

// Nova rota de finalizar OS

router.get("/finalizar-os/:id", authMiddleware.verificaLoginTecnicoOuAdministrador, async (req, res) => {
    const {id} = req.params
    
    try {
        const response = await api.get(`/os/listar/${id}`)
        const os = response.data

        res.render("finalizar-os", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            descricao: os.descricao,
            title: "Concluir OS - Gestão TI",
        })    
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_historico_os", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                title: "Atribuições - Gestão TI",
            });
        } else {
            console.error('Erro ao buscar ordens de serviço:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }
})

router.get("/editar-os/:id", authMiddleware.verificaLogin, async (req, res) => {
    const {id} = req.params
    
    try {
        const response = await api.get(`/os/listar/${id}`)
        const os = response.data

        const responseTecnico = await api.get("/usuario/listar")
        const tecnicos = responseTecnico.data.filter(usuario => usuario.tipo !== "PADRAO");

        res.render("editar_os", {
            layout: verificaTipoUsuario(req.session.user),
            user: req.session.user,
            descricao: os.descricao,
            title: "Editar OS - Gestão TI",
            botao: "Editar",
            isNotPadrao: req.session.user.tipo !== "PADRAO",
            tipoUsuario: req.session.user.tipo,
            tecnicos,
            os
        })    
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.render("vizualizar_historico_os", {
                layout: verificaTipoUsuario(req.session.user),
                user: req.session.user,
                ordensDeServico: [],
                title: "Atribuições - Gestão TI",
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
            title: "Atribuição - Gestão TI",
            baseURL
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
            title: "Lista de Usuários - Gestão TI",
            baseURL
        })
    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/cadastro-usuario', authMiddleware.verificaLoginAdministrador, (req, res) => {
    res.render("cadastrar_usuario", {
        layout: verificaTipoUsuario(req.session.user),
        user: req.session.user,
        title: "Cadastro de Usuário - Gestão TI",
        baseURL
    })
})

router.get('/novo-usuario', (req, res) => {
    res.render("novo_usuario", {
        layout: 'login',
        title: "Cadastre-se - Gestão TI",
        baseURL
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
            usuario,
            baseURL
        })

    } catch (error) {
        res.json({error: error.message})
    }
})




module.exports = router