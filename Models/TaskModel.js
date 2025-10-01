const connection = require("./Connection");

class TaskModel {
    constructor() { }

    static async criarTarefa({ titulo, status, descricao, idUsuario, dataInicioTarefa, dataFimTarefa }) {
        const sqlCommand = `
            INSERT INTO tarefas (titulo, descricao, statusID, idUsuario, dataInicioTarefa, dataFimTarefa)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [titulo, descricao, status, idUsuario, dataInicioTarefa, dataFimTarefa];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows[0]; // retorna a tarefa criada
        } catch (err) {
            return err;
        }
    }

    static async atualizarDescTarefa({ id, descricao, idUsuario }) {
        const sqlCommand = "UPDATE tarefas SET descricao = $1 WHERE id = $2 AND idUsuario = $3 RETURNING *";
        const values = [descricao, id, idUsuario];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows[0];
        } catch (err) {
            return err;
        }
    }

    static async atualizarTituloTarefa({ id, titulo, idUsuario }) {
        const sqlCommand = "UPDATE tarefas SET titulo = $1 WHERE id = $2 AND idUsuario = $3 RETURNING *";
        const values = [titulo, id, idUsuario];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows[0];
        } catch (err) {
            return err;
        }
    }

    static async atualizarDataFimTarefa({ id, dataFimTarefa, idUsuario }) {
        const sqlCommand = "UPDATE tarefas SET dataFimTarefa = $1 WHERE id = $2 AND idUsuario = $3 RETURNING *";
        const values = [dataFimTarefa, id, idUsuario];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows[0];
        } catch (err) {
            return err;
        }
    }

    static async deletarTarefa({ id, idUsuario }) {
        const sqlCommand = "DELETE FROM tarefas WHERE id = $1 AND idUsuario = $2 RETURNING *";
        const values = [id, idUsuario];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows[0];
        } catch (err) {
            return err;
        }
    }

    static async puxarTarefasBanco({ id }) {
        const sqlCommand = `
            SELECT 
                id, 
                titulo, 
                descricao, 
                statusID, 
                TO_CHAR(dataInicioTarefa, 'DD/MM/YYYY') AS dataInicioTarefaFormatada,
                TO_CHAR(dataFimTarefa, 'DD/MM/YYYY') AS dataFimTarefaFormatada
            FROM tarefas
            WHERE idUsuario = $1
            ORDER BY dataInicioTarefa DESC;
        `;
        const values = [id];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows;
        } catch (err) {
            return err;
        }
    }

    static async puxarDadosTarefa(idTarefa, idUsuario) {
        const sqlCommand = `
            SELECT 
                id, 
                titulo, 
                descricao, 
                statusID, 
                TO_CHAR(dataInicioTarefa, 'DD/MM/YYYY') AS dataInicioTarefaFormatada,
                TO_CHAR(dataFimTarefa, 'DD/MM/YYYY') AS dataFimTarefaFormatada
            FROM tarefas
            WHERE id = $1 AND idUsuario = $2;
        `;
        const values = [idTarefa, idUsuario];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.rows);
            });
        });
    }

    static async alterarStatusTarefa({ id, statusID }) {
        const sqlCommand = "UPDATE tarefas SET statusID = $1 WHERE id = $2 RETURNING *";
        const values = [statusID, id];

        try {
            const result = await connection.query(sqlCommand, values);
            return result.rows[0];
        } catch (err) {
            return err;
        }
    }
}

module.exports = TaskModel;
