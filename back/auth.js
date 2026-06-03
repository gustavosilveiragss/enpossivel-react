const bcrypt = require('bcryptjs');

async function gerarHash(senha) {
	return bcrypt.hash(senha, 10);
}

// admin populado tem senha plaintext no banco, contas normais tem hash bcrypt
// hash bcrypt sempre comeca com $2, entao da pra detectar pelo prefixo
async function senhaConfere(senha, hash) {
	if (hash.startsWith('$2')) {
		return bcrypt.compare(senha, hash);
	}
	return senha === hash;
}

module.exports = { gerarHash, senhaConfere };
