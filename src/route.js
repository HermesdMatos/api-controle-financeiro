const express = require('express');
const rotas = express.Router();

const {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario } = require('./controllers/usuarios');

const { listarCategoria } = require('./controllers/categorias');

const {
    listarTransacao,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato } = require('./controllers/transacao');

const {autenticarLogin} = require('./middleware/intermediario')

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login)

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