const express = require('express');
const rotas = express.Router();

const {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
} = require('./controllers/usuarios');

    const { login } = require('./controllers/login');


const { listarCategoria } = require('./controllers/categorias');

const {
    listarTransacao,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato } = require('./controllers/transacao');

const { autenticarLogin } = require('./middleware/intermediario');

const { schema } = require('./middleware/validate');
const validateBody = require('./schemas/validate-usuario');
const validateLogin = require('./schemas/validate-login');

//---------------------------------------------------------------

rotas.post('/usuario', schema(validateBody),cadastrarUsuario)
rotas.post('/login', schema(validateLogin), login)

rotas.use(autenticarLogin)

rotas.get('/usuario', detalharUsuario)
rotas.put('/usuario', atualizarUsuario)
rotas.get('/categoria', listarCategoria)
rotas.get('/transacao', listarTransacao)
rotas.get('/transacao/extrato', obterExtrato)

rotas.get('/transacao/:id', detalharTransacao)
rotas.post('/transacao', cadastrarTransacao)
rotas.put('/transacao/:id', atualizarTransacao)
rotas.delete('/transacao/:id', excluirTransacao)



module.exports = rotas;