const knex = require('knex')({
	client: 'pg',
	connection: {
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: '310723',
		database: 'dindin',
	}
})

module.exports = knex