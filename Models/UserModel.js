const connection = require('./Connection');

class UserModel {
    constructor() { };

    static checarExistenciaUsuario({ nomeUsuario }) {
        const sqlCommand = "SELECT nomeUsuario FROM usuarios WHERE nomeUsuario = $1;";
        const values = [nomeUsuario];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve(result.rows.length > 0);
            });
        });
    }

    static async cadastrarUsuario({ nomeUsuario, senhaUsuario }) {
        try {
            let usuarioExiste = await this.checarExistenciaUsuario({ nomeUsuario });

            if (usuarioExiste) {
                throw new Error("Erro, usuário já existe!");
            }

            const sqlCommand = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, NOW()) RETURNING id;";

            const values = [
                nomeUsuario,
                senhaUsuario
            ];

            return new Promise((resolve, reject) => {
                connection.query(sqlCommand, values, (err, result) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(result.rows[0].id);
                });
            });

        } catch (err) {
            throw new Error("Erro ao cadastrar usuário: " + err.message);
        }
    }

    static async loginProcesso({ nomeUsuario }) {
        const sqlCommand = "SELECT id, nomeUsuario, senhaUsuario FROM usuarios WHERE nomeUsuario = $1;";

        const values = [
            nomeUsuario,
        ]

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.rows);
            });
        });
    }

    static async adicionarToken(idUsuario, keyUsuario) {
        const sqlCommand = "INSERT INTO userLogged VALUES (DEFAULT, $1, $2, $3, $4);";
        const dataAtual = new Date();
        const dataAtualFormatada = dataAtual.toISOString().slice(0, 19).replace("T", " ");

        const dataExclusao = new Date();
        dataExclusao.setDate(dataAtual.getDate() + 3);
        const dataExclusaoFormatada = dataExclusao.toISOString().slice(0, 19).replace("T", " ");

        const values = [
            keyUsuario,
            dataAtualFormatada,
            dataExclusaoFormatada,
            idUsuario
        ];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }

                resolve(result.rows);
            });
        });
    }

    static buscarUsuarioPorToken({ token }) {
        const sqlCommand = "SELECT horaCriacao, horaFinalizacao, idUsuario FROM userLogged WHERE keyUsuario = $1";
        const values = [
            token
        ];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.rows);
            });
        });
    }

    static logout({ token }) {
        const sqlCommand = "DELETE FROM userLogged WHERE keyUsuario = $1";
        const values = [
            token
        ];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.rows);
            });
        });
    }

    static async getUserInfos({ id }) {
        const sqlCommand = "SELECT nomeUsuario, senhaUsuario FROM usuarios WHERE id = $1;";

        const values = [
            id,
        ];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.rows);
            });
        });
    }

    static async alterarNomeUsuario({ id, nomeUsuario }) {
        const sqlCommand = "UPDATE usuarios SET nomeUsuario = $1 WHERE id = $2";
        const values = [
            nomeUsuario,
            id
        ];

        return new Promise((resolve, reject) => {
            connection.query(sqlCommand, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.rows);
            });
        });
    }

    static async alterarSenhaUsuario({ id, senhaUsuario }) {
        try {
            const sqlCommand = "UPDATE usuarios SET senhaUsuario = $1 WHERE id = $2";
            const values = [
                senhaUsuario,
                id
            ];
            return new Promise((resolve, reject) => {
                connection.query(sqlCommand, values, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.rows);
                });
            })
        } catch (err) {
            return err;
        }
    }

    static async deletarConta({ id }) {
        try {
            const sqlCommand = "DELETE from usuarios WHERE id = $1";
            const values = [id];

            return new Promise((resolve, reject) => {
                connection.query(sqlCommand, values, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.rows);
                });
            });
        } catch (err) {
            return err;
        }
    }
}

module.exports = UserModel;