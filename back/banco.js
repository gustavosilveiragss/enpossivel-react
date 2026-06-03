const { Pool } = require('pg');

// pool reaproveita conexoes em vez de abrir uma nova a cada query
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// $1, $2... sao parametros, nao concatena₢ão de string (evita SQL injection)
async function consulta(sql, params) {
	const r = await pool.query(sql, params);
	return r.rows;
}

module.exports = { pool, consulta };
