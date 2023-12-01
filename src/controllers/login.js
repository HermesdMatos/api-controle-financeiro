module.exports = {
    login: async (req, res) => {
        const { email, senha } = req.body;
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
    
    }
}