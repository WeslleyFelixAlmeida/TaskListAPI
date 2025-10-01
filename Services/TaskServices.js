const TaskModel = require("./../Models/TaskModel");
const UserModel = require("./../Models/UserModel");

const criarTarefa = async (titulo, status, descricao, idSessaoUsuario, dataInicioTarefa, dataFimTarefa) => {
    try {
        const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

        const addTarefa = await TaskModel.criarTarefa({
            titulo: titulo,
            descricao: descricao,
            idUsuario: idUsuario,
            status: status,
            dataInicioTarefa: dataInicioTarefa,
            dataFimTarefa: dataFimTarefa
        });

        return addTarefa;
    } catch (err) {
        throw new Error("Erro ao adicionar tarefa, tente novamente" + err);
    }
}

const atualizarDescTarefa = async (id, descricao, idSessaoUsuario) => {
    const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

    try {
        const updateDescTarefa = await TaskModel.atualizarDescTarefa({
            id: id,
            descricao: descricao,
            idUsuario: idUsuario
        });
        return updateDescTarefa;
    } catch (err) {
        throw new Error("Erro ao atualizar tarefa!" + err);
    }
}

const atualizarTituloTarefa = async (id, titulo, idSessaoUsuario) => {
    const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

    try {
        const updateTituloTarefa = await TaskModel.atualizarTituloTarefa({
            id: id,
            titulo: titulo,
            idUsuario: idUsuario
        });

        return updateTituloTarefa;
    } catch (err) {
        throw new Error("Erro ao atualizar tarefa!" + err);
    }
}


const atualizarDataFimTarefa = async (id, novaDataFim, idSessaoUsuario) => {
    const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

    try {
        const updateDateEndTask = await TaskModel.atualizarDataFimTarefa({
            id: id,
            dataFimTarefa: novaDataFim,
            idUsuario: idUsuario
        });

        return updateDateEndTask;
    } catch (err) {
        throw new Error("Erro ao atualizar tarefa!" + err);
    }
}

const deletarTarefa = async (id, idSessaoUsuario) => {
    const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

    try {
        const deleteTarefa = await TaskModel.deletarTarefa({
            id: id,
            idUsuario: idUsuario
        });
        return deleteTarefa;
    } catch (err) {
        throw new Error("Erro ao deletar tarefa!" + err);
    }
}

const puxarTarefasBanco = async (idSessaoUsuario) => {
    try {
        const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

        const getTasksInfo = await TaskModel.puxarTarefasBanco({
            id: idUsuario
        });

        if (!getTasksInfo) {
            return null;
        }

        return getTasksInfo;
    } catch (err) {
        throw new Error("Erro ao buscar tarefas!" + err);
    }
}

const puxarDadosTarefas = async (idTarefa, idSessaoUsuario) => {
    try {
        const idUsuario = (await UserModel.buscarUsuarioPorToken({ token: idSessaoUsuario }))[0].idusuario;

        const getTaskInfo = await TaskModel.puxarDadosTarefa(idTarefa, idUsuario);

        if (!getTaskInfo[0]) {
            return null;
        }

        return getTaskInfo;
    } catch (err) {
        throw new Error("Erro ao buscar tarefa específica");
    }
}

const alterarStatusTarefa = async (id, statusTarefa) => {
    try {
        const updateStatusTask = await TaskModel.alterarStatusTarefa({ id: id, statusID: statusTarefa });

        return updateStatusTask;
    } catch (err) {
        throw new Error("Erro ao alterar status da tarefa");
    }
}

module.exports = { criarTarefa, atualizarDescTarefa, atualizarTituloTarefa, deletarTarefa, puxarTarefasBanco, puxarDadosTarefas, atualizarDataFimTarefa, alterarStatusTarefa };