const UserService = require("./../Services/UserServices");

const cadastro = async (req, res) => {
    try {
        const { nomeUsuario, senhaUsuario, confirmarSenhaUsuario } = req.body;

        if ((!nomeUsuario || !senhaUsuario || !confirmarSenhaUsuario) || (senhaUsuario !== confirmarSenhaUsuario)) {
            res.status(500).json({ err: true });
            return;
        }

        const criarUsuario = await UserService.cadastroUsuario(nomeUsuario, senhaUsuario);

        res.status(201).json(true);

    } catch (err) {
        console.error(err);
        res.status(500).json(false);
    }
}

const login = async (req, res) => {
    try {
        const { nomeUsuario, senhaUsuario } = req.body;

        const loginProcesso = await UserService.loginProcesso(nomeUsuario, senhaUsuario);
        if (!loginProcesso[0]) {
            res.status(201).json(false);
            return;
        }

        res.cookie("auth_token", loginProcesso[1], {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000 //1 hora
        });

        res.status(201).json(true);

    } catch (err) {
        console.error(err);
        res.status(501).json(false);
    }
}

const perfil = async (req, res) => {//finalizar
    const token = req.cookies.auth_token || "";
    try {
        const usuarioDados = await UserService.perfil(token);

        res.status(201).json({ usuarioDados: usuarioDados[0].nomeusuario });
    } catch (error) {
        res.status(501).json({ message: "Erro ao tentar acessar o perfil" });
    }
}


const logout = async (req, res) => {
    try {
        const deslogar = await UserService.logout(req.cookies.auth_token);
    } catch (err) {
        return err;
    }

    res.clearCookie("auth_token", {
        path: "/",
        httpOnly: true,
        secure: false, // Em produção, use "true" se estiver com HTTPS
        sameSite: "Lax"
    });
    res.status(201).json({ message: "Deslogado com sucesso!" });
}

const Islogged = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";

    if (idUsuarioSessao) {
        try {
            const estaLogado = await UserService.Islogged(idUsuarioSessao);

            if (estaLogado) {
                res.status(201).json(estaLogado);
                return;
            }

            //Se o cookie expirou, deleta ele do banco de dados e retorna false para o front
            res.clearCookie("auth_token", {
                path: "/",
                httpOnly: true,
                secure: false, // Em produção, use "true" se estiver com HTTPS
                sameSite: "Lax"
            });

            res.status(201).json(false);

        } catch (err) {
            return err;
        }
    } else {
        res.status(201).json(false);
    }
}

const alterarNomeUsuario = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";
    const { usuarioUpdate } = req.body;

    const regex = /[^a-zA-Z0-9_.]/;

    if (regex.test(usuarioUpdate)) {
        res.status(201).json({ message: "Não foi possível alterar o nome de usuário, pois há caractéres especiais no nome." });
        return;
    }

    if (!idUsuarioSessao || !usuarioUpdate) {
        res.status(500).json({ err: true });
        return;
    }

    try {
        const alterarNomeUsuario = await UserService.alterarNomeUsuario(idUsuarioSessao, usuarioUpdate);

        if (alterarNomeUsuario.message && alterarNomeUsuario.err) {
            res.status(201).json({ message: alterarNomeUsuario.message });
            return null;
        }

        res.status(201).json(alterarNomeUsuario[0].nomeusuario);
    } catch (err) {
        res.status(501).json(false);
    }
}

const alterarSenhaUsuario = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";
    const { senhaAntigaUpdate, senhaUpdate } = req.body;

    if (!idUsuarioSessao || !senhaAntigaUpdate || !senhaUpdate) {
        res.status(500).json({ err: true });
        return;
    }

    try {
        const alterarSenhaUsuario = await UserService.alterarSenhaUsuario(idUsuarioSessao, senhaAntigaUpdate, senhaUpdate);

        if (!alterarSenhaUsuario) {
            res.status(201).json({ message: "As senha antiga está incorreta!" });
            return null;
        }

        res.status(201).json(true);
    } catch (err) {
        console.log(err);
        res.status(501).json(false);
    }
}

const deletarConta = async (req, res) => {
    const idUsuarioSessao = req.cookies.auth_token || "";
    if (!idUsuarioSessao) {
        res.status(500).json({ err: true });
        return;
    }

    try {
        const deletarConta = await UserService.deletarConta(idUsuarioSessao);

        res.clearCookie("auth_token", {
            path: "/",
            httpOnly: true,
            secure: false, // Em produção, use "true" se estiver com HTTPS
            sameSite: "Lax"
        });

        res.status(201).json(true);

    } catch (err) {
        res.status(501).json(false);
    }
}

module.exports = { cadastro, login, perfil, logout, Islogged, alterarNomeUsuario, alterarSenhaUsuario, deletarConta };