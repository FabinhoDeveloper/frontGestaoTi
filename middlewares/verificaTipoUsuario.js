module.exports = function verificaTipoUsuario(usuario) {
    if (!usuario) {
        throw new Error("Usuário não encontrado ou tipo de usuário indefinido");
    }

    switch (usuario.tipo) {
        case 'ADMINISTRADOR':
            return 'admin'
        case 'TECNICO':
            return 'tecnico'
        case 'USUARIO':
            return 'usuario'
    }
}