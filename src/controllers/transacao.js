const pool = require('../connection')
const jwt = require('jsonwebtoken');
const tokenSenha = require('../config/token')
const {validarDados} = require('../config/validacao')

module.exports = {
    listarTransacao: async (req, res) => {
        const { authorization } = req.headers
        try {
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const transacao = await pool.query(
                'select * from transacoes where usuario_id = $1',
                [id]
            )
            return res.status(200).json(transacao.rows)
            
        } catch (error) {
            return res.status(404).json({mensagem: 'O servidor não pode encontrar o recurso solicitado'})
        }
    }, 
    detalharTransacao: async (req, res) => {
        const { id } = req.params;
        const idTransacao = id
        const { authorization } = req.headers;
        try {
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const usarioToken = await pool.query(
                'select * from transacoes where id = $1 and usuario_id = $2',
                [idTransacao, id]
            )
            if (!usarioToken.rows.length) {
                return res.status(404).json({mensagem: 'Transação não encontrada.'})
            }
            return res.status(200).json(usarioToken.rows)
        } catch (error) {
            return res.status(404).json({mensagem: 'Transação não encontrada.'})
        }
    }, 
    cadastrarTransacao: async (req, res) => {
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const dados = { descricao, valor, data, categoria_id, tipo, numero: 3 };
        if (!validarDados(dados)) {
            return res.status(400).json(
                { mensagem: "Todos os campos obrigatórios devem ser informados." })
        }
        const { authorization } = req.headers;
        try {
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)

            const categoriaID = await pool.query(`select descricao from categorias where id = $1`, [categoria_id])
            const transacao = await pool.query(`insert into transacoes(descricao, valor, data, categoria_id, usuario_id, tipo) 
            values ($1, $2, $3, $4, $5, $6) returning*`, [descricao, valor, data, categoria_id, id, tipo])

            const transacaoCadastrada = {
                id: transacao.rows[0].id,
                descricao: transacao.rows[0].descricao,
                valor: transacao.rows[0].valor,
                data: transacao.rows[0].data,
                categoria_id: transacao.rows[0].categoria_id,
                tipo: transacao.rows[0].tipo,
                usuario_id: transacao.rows[0].usuario_id,
                categoria_nome: categoriaID.rows[0].descricao
            }
            return res.status(201).json(transacaoCadastrada)
            
        } catch (error) {
            return res.status(404).json({mensagem: 'O servidor não pode encontrar o recurso solicitado'})
        }
        
    },
    atualizarTransacao: async (req, res) => {

        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const idParams = req.params.id;

        const dados = { descricao, valor, data, categoria_id, tipo, numero: 3 };
        if (!validarDados(dados)) {
            return res.status(400).json(
                { mensagem: "Todos os campos obrigatórios devem ser informados." })
        }
        const { authorization } = req.headers;

        try {
            
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const categoria = await pool.query('select id from categorias where id = $1', [categoria_id])
            if (categoria.rowCount === 0) {
                return res.status(404).json({mensagem: 'categoria não encontrada'})
            }
            if (tipo === 'entrada' || tipo === 'saida') {

                const transacao = await pool.query(`update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6 and usuario_id = $7`, [descricao, valor, data, categoria_id, tipo, idParams, id])
            
                if (transacao.rowCount === 0) {
                    return res.status(404).json({ mensagem: 'Transação não encontrada.' })
                }

                return res.status(201).json()
            }
            return res.status(404).json({ mensagem: 'Tipo invalido' })

            
        } catch (error) {
            return res.status(404).json({mensagem: 'O servidor não pode encontrar o recurso solicitado'})
        }
    }, 
    excluirTransacao: async (req, res) => {
        const idTransacao = req.params.id;

        const { authorization } = req.headers;
        try {
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const transacao = await pool.query(`delete from transacoes where id = $1 and usuario_id = $2`, [idTransacao, id])
            if (transacao.rowCount === 0) {
                return res.status(404).json({mensagem: 'Transação não encontrada.'})
            }
            return res.status(200).json()
        } catch (error) {
            return res.status(404).json({mensagem:'O servidor não pode encontrar o recurso solicitado'})
        }
    },
    obterExtrato: async (req, res) => {
        try {
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const resultado = await pool.query(`select
            SUM(case when tipo = 'entrada' then valor else 0 end) as total_entrada,
            SUM(case when tipo = 'saida' then valor else 0 end) as total_saida from transacoes where usuario_id = $1`, [id]);

const totalEntrada = resultado.rows[0].total_entrada;
            const totalSaida = resultado.rows[0].total_saida;

            const total = {
                entrada: totalEntrada,
                saida: totalSaida
            }
            return res.status(200).json(total)
            
            
        } catch (error) {
            return res.status(404).json({mensagem:'O servidor não pode encontrar o recurso solicitado'})

        }
    }
}