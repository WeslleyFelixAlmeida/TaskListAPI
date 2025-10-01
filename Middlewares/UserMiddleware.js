const UserModel = require("../Models/UserModel");

const authMiddleware = async (req, res, next) => {
    const idUsuarioSessao = req.cookies.auth_token || "";

    if(idUsuarioSessao){
        try {
            const usuario = (await UserModel.buscarUsuarioPorToken({token: idUsuarioSessao}))[0].idusuario;
            
            if (usuario) {
                next();
            }
            else{
                res.status(403).json(false);
            }
        }
        catch (err) {
            return res.status(500).json({message: "Erro interno no servidor" });
        }
    }
};

module.exports = { authMiddleware };