const knex = require('../connection')
module.exports = {
    async cadastro({ nome, email, senhaCriptografada }) {        
        const usuario = await knex('usuarios').returning(['id', 'nome', 'email'])
            .insert({ nome, email, senha: senhaCriptografada });
        console.log(usuario);
        return usuario
    }
}

// async register_user({ nome, email, encryptPassword }) {
//     await knex('usuarios').insert({ nome, email, senha: encryptPassword })
// }