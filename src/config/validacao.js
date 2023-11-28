module.exports = {
    validarDados: (dados) => {
        if (dados.numero === 1) {
            if (!dados.nome || !dados.email || !dados.senha) {
                return false
            }
        }
        if (dados.numero === 2) {
            if (!dados.senha || !dados.email) {
                return false
            }
        }
        if (dados.numero === 3) {
            if (!dados.descricao || !dados.valor|| !dados.data|| !dados.categoria_id || !dados.tipo) {
                return false
            }
        }
        return true
    }
}

