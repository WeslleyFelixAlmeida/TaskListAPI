const UserModel = require("../Models/UserModel");

const authMiddleware = async (req, res, next) => {
    // Permite preflight passar
    if (req.method === "OPTIONS") {
        return next();
    }

    const idUsuarioSessao = req.cookies.auth_token || "";

    if (!idUsuarioSessao) {
        return res.status(401).json(false);
    }

    try {
        const usuarioData = await UserModel.buscarUsuarioPorToken({ token: idUsuarioSessao });

        if (usuarioData && usuarioData[0] && usuarioData[0].idusuario) {
            return next();
        } else {
            return res.status(403).json(false);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};

module.exports = { authMiddleware };
