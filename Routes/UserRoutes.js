const UserController = require('../Controllers/UserController');
const UserMiddleware = require('../Middlewares/UserMiddleware');

const express = require('express');
const router = express.Router();

router.post('/User/Cadastro', UserController.cadastro);
router.post('/User/Login', UserController.login);
router.get('/User/Islogged', UserController.Islogged);
router.get('/User/Logout', UserMiddleware.authMiddleware, UserController.logout);
router.get('/User/Perfil', UserMiddleware.authMiddleware, UserController.perfil);
router.patch('/User/AlterarUsuario', UserMiddleware.authMiddleware, UserController.alterarNomeUsuario);
router.patch('/User/AlterarSenhaUsuario', UserMiddleware.authMiddleware, UserController.alterarSenhaUsuario);
router.delete('/User/DeletarConta', UserMiddleware.authMiddleware, UserController.deletarConta);

module.exports = router;