const { consulta } = require('../banco');
const { gerarHash, senhaConfere } = require('../auth');

// seta o jwt como cookie httpOnly: JS nao consegue ler, so o browser envia automaticamente
function definirCookie(resp, token) {
	resp.setCookie('token', token, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24, // 1 dia
	});
}

// preHandler = middleware que roda antes da rota. bloqueia se n tiver jwt valido
async function exigirLogin(req, resp) {
	try {
		await req.jwtVerify();
	} catch (e) {
		return resp.code(401).send({ erro: 'nao autenticado' });
	}
}

module.exports = function (app) {
	async function postContas(req, resp) {
		const corpo = req.body || {};
		const nome = corpo.nome;
		const email = corpo.email;
		const senha = corpo.senha;

		if (!nome || !email || !senha) {
			return resp.code(400).send({ erro: 'nome, email e senha obrigatorios' });
		}

		const hash = await gerarHash(senha);

		let conta;
		try {
			const r = await consulta(
				'insert into conta (nome, email, senha, papel) values ($1, $2, $3, $4) returning id, papel',
				[nome, email, hash, 'user'],
			);
			conta = r[0];
		} catch (erro) {
			// 23505 = duplicate key = email duplicado no postgres
			if (erro.code === '23505') {
				return resp.code(400).send({ erro: 'email ja cadastrado' });
			}
			throw erro;
		}

		// toda conta tem 1 carrinho, criado junto no cadastro
		await consulta('insert into carrinho (id_conta) values ($1)', [conta.id]);

		const token = app.jwt.sign({ idConta: conta.id, papel: conta.papel });
		definirCookie(resp, token);

		return resp.code(201).send({ idConta: conta.id, papel: conta.papel });
	}

	async function postLogin(req, resp) {
		const corpo = req.body || {};
		const email = corpo.email;
		const senha = corpo.senha;

		if (!email || !senha) {
			return resp.code(400).send({ erro: 'email e senha obrigatorios' });
		}

		const r = await consulta('select id, senha, papel from conta where email = $1', [email]);
		if (r.length === 0) return resp.code(401).send({ erro: 'credenciais invalidas' });

		const conta = r[0];
		const ok = await senhaConfere(senha, conta.senha);
		if (!ok) return resp.code(401).send({ erro: 'credenciais invalidas' });

		const token = app.jwt.sign({ idConta: conta.id, papel: conta.papel });
		definirCookie(resp, token);

		return { idConta: conta.id, papel: conta.papel };
	}

	async function postLogout(req, resp) {
		resp.clearCookie('token', { path: '/' });
		return resp.code(204).send();
	}

	// front chama /me ao abrir o app pra saber se o cookie ainda é valido
	async function getMe(req, resp) {
		try {
			await req.jwtVerify();
		} catch (e) {
			return resp.code(401).send({ erro: 'nao autenticado' });
		}
		return { idConta: req.user.idConta, papel: req.user.papel };
	}

	app.post('/contas', postContas);
	app.post('/login', postLogin);
	app.post('/logout', { preHandler: exigirLogin }, postLogout);
	app.get('/me', getMe);
};
