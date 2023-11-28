const pool = require('../connection')

module.exports = {
    listarCategoria: async (req, res) => {
        try {
            const categorias = await pool.query(
                'select * from categorias'
            )
            return res.status(200).json(categorias.rows)
            
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}