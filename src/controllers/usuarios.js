const pool = require('../connection')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenSenha = require('../config/token')
const { validarDados } = require('../config/validacao');


module.exports = {
    cadastrarUsuario: async (req, res) => {
        const { nome, email, senha } = req.body;
        
        const dados = { nome, email, senha, numero: 1 }
        if (!validarDados(dados)) {
            return res.status(403).json({ mensagem: "Dados inválidos" })
        }
        
        try {
            const emailExistente = await pool.query
                ('select * from usuarios where email = $1', [email]);
            
            if (emailExistente.rows.length > 0) {
                return res.status(403).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
            }
            const senhaCriptografada = await bcrypt.hash(senha, 10)
            const usuario = await pool.query(`insert into usuarios(nome, email, senha) 
            values ($1, $2, $3) returning*`, [nome, email, senhaCriptografada])
    
            const idUsuario = usuario.rows[0].id
    
            const usuarioCadastrado = {
                id: idUsuario,
                nome,
                email
            }
    
            return res.status(201).json(usuarioCadastrado)
            
        } catch (error) {
            return res.status(404).json({mensagem:'O servidor não pode encontrar o recurso solicitado'})
        }
    },

    login: async (req, res) => {
        const { email, senha } = req.body;
        const dados = { email, senha, numero: 2 }
        if (!validarDados(dados)) {
            return res.status(400).json({ mensagem: "Dados inválidos" })
        }
        try {
            const usuario = await pool.query(
                'select * from usuarios where email = $1',
                [email]
            )
            if (usuario.rowCount < 1) {
                return res.status(400).json({ mensagem: 'Email ou senha invalida' })
            }
            const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

            if (!senhaValida) {
                return res.status(400).json({ mensagem: 'Email ou senha invalida' })
            }
            
            const token = jwt.sign({ id: usuario.rows[0].id }, tokenSenha, {
                expiresIn: '8h'
            })
            const { senha: _, ...usuarioLogado } = usuario.rows[0]

            return res.json({ usuario: usuarioLogado, token })

        } catch (error) {
            res.status(404).json({mensagem: 'O servidor não pode encontrar o recurso solicitado'})
        }
    
    },
    detalharUsuario: async (req, res) => {
        try {
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const { rows } = await pool.query(
                'select * from usuarios where id = $1',
                [id]
            )
            const usuario = {
                id: rows[0].id,
                nome: rows[0].nome,
                email: rows[0].email
            }
            return res.status(200).json(usuario)
        } catch (error) {
            return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
        }
    },
    
    atualizarUsuario: async (req, res) => {
        const { nome, email, senha } = req.body;
        const dados = { nome, email, senha, numero: 1 }
        
        if (!validarDados(dados)) {
            return res.status(401).json({ mensagem: "Dados inválidos" })
        }
        try {
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1]
            const { id } = jwt.verify(token, tokenSenha)
            const senhaCriptografada = await bcrypt.hash(senha, 10)
            const emailvalido = await pool.query
                ('select email from usuarios where id = $1', [id]);
            
            if (emailvalido.rows[0].email != email) {
                const emailExistente = await pool.query
                ('select * from usuarios where email = $1', [email]);
            
            if (emailExistente.rows.length > 0) {
                return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
            }
            }
            await pool.query(
                `update usuarios set nome = $1, email = $2, senha = $3 where id = $4`,
                [nome, email, senhaCriptografada, id]
            )
            return res.status(201).json()
        } catch (error) {
            return res.status(404).json({mensagem: 'O servidor não pode encontrar o recurso solicitado'})
        }
    }
}
