const { Pool } = require('pg')

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: '310723',
	database: 'dindin',
})

module.exports = pool