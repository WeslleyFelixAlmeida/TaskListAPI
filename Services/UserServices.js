const bcrypt = require('bcrypt');
const UserModel = require('./../Models/UserModel');
const crypto = require("crypto");

const cadastroUsuario = async (nomeUsuario, senhaUsuario) => {
    try {
        const senhaCriptografada = await bcrypt.hash(senhaUsuario, 10);

        const criarUsuario = await UserModel.cadastrarUsuario({
            nomeUsuario: nomeUsuario,
            senhaUsuario: senhaCriptografada
        });

        return criarUsuario;
    } catch (err) {
        throw new Error('Erro ao cadastrar o usuário: ' + err.message);
    }
};

const loginProcesso = async (nomeUsuario, senhaUsuario) => {
    try {
        const data = await UserModel.loginProcesso({ nomeUsuario });

        const senhaValida = await bcrypt.compare(senhaUsuario, data[0].senhausuario);
        
        const token = crypto.randomBytes(5).toString("hex");

        await UserModel.adicionarToken(data[0].id, token);
        return [senhaValida, token];

    } catch (err) {
        throw new Error("Erro ao tentar realizar o login!" + err.message);
    }
}

const logout = async (idUsuarioSessao) => {
    try {
        const deslogar = await UserModel.logout({ token: idUsuarioSessao });
    } catch (err) {
        throw new Error("Erro ao deslogar" + err.message);
    }
}

const Islogged = async (idUsuarioSessao) => {
    try {
        const usuarioDadosSessao = await UserModel.buscarUsuarioPorToken({ token: idUsuarioSessao });

        const dataFimSessao = new Date(usuarioDadosSessao[0].horafinalizacao);
        const dataAtual = new Date();

        if (dataAtual >= dataFimSessao) {
            const removerSessaoAntigaUsuario = await UserModel.logout({ token: idUsuarioSessao });
            return false;
        }

        if (usuarioDadosSessao[0].idusuario) {
            return true;
        }

        return false;
    } catch (err) {
        throw new Error("Erro ao deslogar" + err.message);
    }
}

const perfil = async (idUsuarioSessao) => {
    try {
        const usuarioId = (await UserModel.buscarUsuarioPorToken({ token: idUsuarioSessao }))[0].idusuario;

        const usuarioDados = await UserModel.getUserInfos({ id: usuarioId });

        return usuarioDados;
    } catch (err) {
        throw new Error("Erro ao exibir perfil" + err.message);
    }
}

const alterarNomeUsuario = async (idUsuarioSessao, novoNomeUsuario) => {
    try {
        const checarExistenciaUsuario = await UserModel.checarExistenciaUsuario({ nomeUsuario: novoNomeUsuario });

        if (checarExistenciaUsuario) {
            return { err: true, message: "Usuário já existe! Tente novamente." }
        }

        const usuarioId = (await UserModel.buscarUsuarioPorToken({ token: idUsuarioSessao }))[0].idusuario;

        const updateName = await UserModel.alterarNomeUsuario({ id: usuarioId, nomeUsuario: novoNomeUsuario });

        const usuarioDados = await UserModel.getUserInfos({ id: usuarioId });

        return usuarioDados;
    } catch (err) {
        throw new Error("Erro ao alterar nome do usuário" + err);
    }
}

const alterarSenhaUsuario = async (idUsuarioSessao, senhaAntiga, senhaNova) => {
    try {
        const usuarioId = (await UserModel.buscarUsuarioPorToken({ token: idUsuarioSessao }))[0].idusuario;

        const senhaAntigaBanco = (await UserModel.getUserInfos({ id: usuarioId }))[0].senhausuario;

        const senhaConfere = await bcrypt.compare(senhaAntiga, senhaAntigaBanco);

        if (!senhaConfere) {
            return false;
        }

        const senhaNovaCriptografada = await bcrypt.hash(senhaNova, 10);

        const updatePassword = await UserModel.alterarSenhaUsuario({ id: usuarioId, senhaUsuario: senhaNovaCriptografada });

        return updatePassword;
    } catch (err) {
        throw new Error("Erro ao alterar senha do usuário" + err);
    }
}

const deletarConta = async (idUsuarioSessao) => {
    try {
        const usuarioId = (await UserModel.buscarUsuarioPorToken({ token: idUsuarioSessao }))[0].idusuario;

        const deleteAccount = await UserModel.deletarConta({ id: usuarioId });

        return deleteAccount;
    } catch (err) {
        throw new Error("Erro ao deletar conta" + err);
    }
}

module.exports = { cadastroUsuario, loginProcesso, logout, Islogged, perfil, alterarNomeUsuario, alterarSenhaUsuario, deletarConta };
