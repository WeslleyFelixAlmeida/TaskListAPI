const UserService = require("./../Services/UserServices");

const cadastro = async (req, res) => {
    try {
        const { nomeUsuario, senhaUsuario, confirmarSenhaUsuario } = req.body;

        if (!nomeUsuario || !senhaUsuario || !confirmarSenhaUsuario || senhaUsuario !== confirmarSenhaUsuario) {
            return res.status(400).json({ err: true, message: "Dados inválidos" });
        }

        await UserService.cadastroUsuario(nomeUsuario, senhaUsuario);
        return res.status(201).json(true);

    } catch (err) {
        console.error(err);
        return res.status(500).json(false);
    }
};

const login = async (req, res) => {
    try {
        const { nomeUsuario, senhaUsuario } = req.body;
        const loginProcesso = await UserService.loginProcesso(nomeUsuario, senhaUsuario);

        if (!loginProcesso[0]) {
            return res.status(401).json(false);
        }

        res.cookie("auth_token", loginProcesso[1], {
            httpOnly: true,
            secure: true,       // sempre true
            sameSite: "None",   // necessário para cross-origin
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json(true);

    } catch (err) {
        console.error(err);
        return res.status(500).json(false);
    }
};

const perfil = async (req, res) => {
    const token = req.cookies.auth_token || "";
    try {
        const usuarioDados = await UserService.perfil(token);
        return res.status(200).json({ usuarioDados: usuarioDados[0].nomeusuario });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao tentar acessar o perfil" });
    }
};

const logout = async (req, res) => {
    try {
        await UserService.logout(req.cookies.auth_token);
    } catch (err) {
        console.error(err);
    }

    res.clearCookie("auth_token", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    return res.status(200).json({ message: "Deslogado com sucesso!" });
};

const Islogged = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";

    if (!idUsuarioSessao) return res.status(200).json(false);

    try {
        const estaLogado = await UserService.Islogged(idUsuarioSessao);

        if (estaLogado) return res.status(200).json(estaLogado);

        // Cookie expirado ou inválido
        res.clearCookie("auth_token", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json(false);

    } catch (err) {
        console.error(err);
        return res.status(500).json(false);
    }
};

const alterarNomeUsuario = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";
    const { usuarioUpdate } = req.body;

    if (!idUsuarioSessao || !usuarioUpdate) return res.status(400).json({ err: true });

    const regex = /[^a-zA-Z0-9_.]/;
    if (regex.test(usuarioUpdate)) {
        return res.status(400).json({ message: "Nome contém caracteres inválidos." });
    }

    try {
        const resultado = await UserService.alterarNomeUsuario(idUsuarioSessao, usuarioUpdate);

        if (resultado.message && resultado.err) {
            return res.status(400).json({ message: resultado.message });
        }

        return res.status(200).json(resultado[0].nomeusuario);

    } catch (err) {
        console.error(err);
        return res.status(500).json(false);
    }
};

const alterarSenhaUsuario = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";
    const { senhaAntigaUpdate, senhaUpdate } = req.body;

    if (!idUsuarioSessao || !senhaAntigaUpdate || !senhaUpdate) {
        return res.status(400).json({ err: true });
    }

    try {
        const resultado = await UserService.alterarSenhaUsuario(idUsuarioSessao, senhaAntigaUpdate, senhaUpdate);

        if (!resultado) {
            return res.status(400).json({ message: "A senha antiga está incorreta!" });
        }

        return res.status(200).json(true);

    } catch (err) {
        console.error(err);
        return res.status(500).json(false);
    }
};

const deletarConta = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";
    if (!idUsuarioSessao) return res.status(400).json({ err: true });

    try {
        await UserService.deletarConta(idUsuarioSessao);

        res.clearCookie("auth_token", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json(true);

    } catch (err) {
        console.error(err);
        return res.status(500).json(false);
    }
};

module.exports = {
    cadastro,
    login,
    perfil,
    logout,
    Islogged,
    alterarNomeUsuario,
    alterarSenhaUsuario,
    deletarConta
};
