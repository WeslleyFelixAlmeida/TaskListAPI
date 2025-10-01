const TaskController = require("./../Controllers/TaskController");
const UserMiddleware = require('../Middlewares/UserMiddleware');

const express = require("express");
const router = express.Router();

router.get("/Tarefas/PuxarDadosTarefas", UserMiddleware.authMiddleware,TaskController.puxarTarefasBanco);

router.get("/Tarefas/PuxarDadosTarefaEspecifica/:id", UserMiddleware.authMiddleware, TaskController.puxarDadosTarefas);

router.post("/Tarefas/CriarTarefa", UserMiddleware.authMiddleware,TaskController.criarTarefa);
router.patch("/Tarefas/Descricao/:id", UserMiddleware.authMiddleware,TaskController.atualizarDescTarefa);
router.patch("/Tarefas/Titulo/:id", UserMiddleware.authMiddleware,TaskController.atualizarTituloTarefa);
router.patch("/Tarefas/DataFim/:id", UserMiddleware.authMiddleware,TaskController.atualizarDataFimTarefa);
// router.patch("/Tarefas/DataInicio/:id", UserMiddleware.authMiddleware,TaskController.atualizarDataInicioTarefa); Depois da pra fazer para a data inicio também
router.patch("/Tarefas/Status/:id", UserMiddleware.authMiddleware,TaskController.atualizarStatusTarefa);
router.delete("/Tarefas/Deletar/:id", UserMiddleware.authMiddleware,TaskController.deletarTarefa);

module.exports = router;