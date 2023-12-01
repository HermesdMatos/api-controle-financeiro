const joi = require('joi');

module.exports = joi.object({
    email: joi.string().email().required().messages({
        "any.required": "O campo email é obrigatório",
        "string.base": "O campo email deve ser do tipo string",
        "string.email": "O campo email deve ser um email"
    }),
    senha: joi.string().max(8).required().messages({
        "any.required": "O campo senha é obrigatório",
        "string.base": "O campo senha deve ser do tipo string",
        "string.max": "O campo senha deve ter no maximo 8 caracteres"
    })
})