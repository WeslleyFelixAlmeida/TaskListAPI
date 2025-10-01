const TaskService = require("./../Services/TaskServices");

const criarTarefa = async (req, res) => {
    const idSessaoUsuario = req.cookies.auth_token;
    const { titulo, descricao, dataInicioTarefa, dataFimTarefa } = req.body;
    let status = "";

    //Verificar o status de acordo com as datas informadas:
    const dataInicio = new Date(dataInicioTarefa);
    const dataFim = new Date(dataFimTarefa);

    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(0, 0, 0, 0);

    const diferencaTempo = dataFim.getTime() - dataInicio.getTime();

    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    if (diferencaDias < 0) {
        status = 3;
    } else if (diferencaDias <= 3) {
        status = 4;
    } else {
        status = 1;
    }

    if (!idSessaoUsuario) {
        throw new Error("Erro ao criar tarefa!");
    }

    try {
        const criarTarefa = await TaskService.criarTarefa(titulo, status, descricao, idSessaoUsuario, dataInicioTarefa, dataFimTarefa);

        res.status(201).json(true)
    } catch (err) {
        res.status(500).json(false);
    }
}

const atualizarDescTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const descricao = req.body.descricao;
        const idSessaoUsuario = req.cookies.auth_token;

        if (!descricao || !idSessaoUsuario) {
            throw new Error("Erro ao atualizar tarefa!");
        }

        const atualizarDescTarefa = await TaskService.atualizarDescTarefa(id, descricao, idSessaoUsuario);

        const puxarDadosTarefas = await TaskService.puxarDadosTarefas(id, idSessaoUsuario);

        res.status(201).json({
            message: "Descrição atualizada com sucesso!",
            descNova: puxarDadosTarefas[0].descricao
        });
    } catch (err) {
        return res.status(501).json({ error: true });
    }
}

const atualizarTituloTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const titulo = req.body.tituloAlterar;
        const idSessaoUsuario = req.cookies.auth_token;

        if (!titulo || !idSessaoUsuario) {
            throw new Error("Erro ao atualizar tarefa!");
        }

        const atualizarTituloTarefa = await TaskService.atualizarTituloTarefa(id, titulo, idSessaoUsuario);

        const puxarDadosTarefas = await TaskService.puxarDadosTarefas(id, idSessaoUsuario);

        res.status(201).json({
            message: "Titulo atualizado com sucesso!",
            tituloNovo: puxarDadosTarefas[0].titulo
        });
    } catch (err) {
        return res.status(501).json({ error: true });
    }
}

const atualizarDataFimTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const dataFim = req.body.dataFimAlterar;
        const idSessaoUsuario = req.cookies.auth_token;

        if (!dataFim || !idSessaoUsuario) {
            throw new Error("Erro ao atualizar tarefa!");
        }

        const atualizarTituloTarefa = await TaskService.atualizarDataFimTarefa(id, dataFim, idSessaoUsuario);

        const puxarDadosTarefas = await TaskService.puxarDadosTarefas(id, idSessaoUsuario);

        res.status(201).json({
            message: "Data de finalização atualizada com sucesso!",
            dataFimNova: puxarDadosTarefas[0].dataFimTarefaFormatada
        });
    } catch (err) {
        return res.status(501).json({ error: true });
    }
}

const deletarTarefa = async (req, res) => {
    const idSessaoUsuario = req.cookies.auth_token;

    if (!idSessaoUsuario) {
        throw new Error("Erro ao deletar tarefa!");
    }

    try {
        const { id } = req.params;

        const deletarTarefa = await TaskService.deletarTarefa(id, idSessaoUsuario);

        res.status(201).json({
            message: "Tarefa deletada com sucesso!",
            deletarTarefa
        });
    } catch (err) {
        return res.status(501).json({ error: true });
    }
}

const puxarTarefasBanco = async (req, res) => {
    try {
        const idSessaoUsuario = req.cookies.auth_token || "";

        const tarefasUsuario = await TaskService.puxarTarefasBanco(idSessaoUsuario);

        res.status(201).json(tarefasUsuario);
    } catch (err) {
        res.status(501).json({ message: "Erro ao apresentar tarefas!" + err });
    }
}

const puxarDadosTarefas = async (req, res) => {
    try {
        const { id } = req.params;
        const idSessaoUsuario = req.cookies.auth_token || "";

        const tarefa = await TaskService.puxarDadosTarefas(id, idSessaoUsuario);
        if (!tarefa) {
            res.status(201).json({ err: true });
            return;
        }

        res.status(201).json(tarefa[0]);
    } catch (err) {
        res.status(501).json({ err: true })
    }
}

const atualizarStatusTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const idSessaoUsuario = req.cookies.auth_token || "";

        if (!id || !idSessaoUsuario || !status) {
            res.status(201).json({ err: true });
            return;
        }

        const atualizarTarefa = await TaskService.alterarStatusTarefa(id, status);

        const tarefa = await TaskService.puxarDadosTarefas(id, idSessaoUsuario);

        res.status(201).json(tarefa[0]);
    } catch (err) {
        res.status(501).json({ err: true })
    }
}

module.exports = { criarTarefa, atualizarDescTarefa, atualizarTituloTarefa, deletarTarefa, puxarTarefasBanco, puxarDadosTarefas, atualizarDataFimTarefa, atualizarStatusTarefa }