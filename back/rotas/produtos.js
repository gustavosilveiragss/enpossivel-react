const { consulta } = require('../banco');

// 401 = nao autenticado, 403 = autenticado mas sem permissao de admin
async function exigirAdmin(req, resp) {
	try {
		await req.jwtVerify();
	} catch (e) {
		return resp.code(401).send({ erro: 'nao autenticado' });
	}
	if (req.user.papel !== 'admin') {
		return resp.code(403).send({ erro: 'acesso negado' });
	}
}

async function getProdutos(req) {
	const busca = (req.query && req.query.busca) || '';

	if (busca.trim() === '') {
		return consulta('select * from produto where ativo = true order by id');
	}

	// lower() nos dois lados = busca case-insensitive. % = qualquer coisa antes/depois do termo
	return consulta(
		"select * from produto where ativo = true and estoque > 0 and lower(titulo) like lower($1) order by id",
		['%' + busca + '%'],
	);
}

async function postProdutos(req, resp) {
	const corpo = req.body || {};
	const titulo = corpo.titulo;
	const preco = parseFloat(corpo.preco);
	const estoque = parseInt(corpo.estoque);

	if (!titulo || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0) {
		return resp.code(400).send({ erro: 'campos invalidos' });
	}

	const r = await consulta(
		'insert into produto (titulo, preco, caminho_imagem, estoque) values ($1, $2, $3, $4) returning *',
		[titulo, preco, null, estoque],
	);
	return resp.code(201).send(r[0]);
}

async function putProduto(req, resp) {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return resp.code(400).send({ erro: 'id invalido' });

	const corpo = req.body || {};
	const titulo = corpo.titulo;
	const preco = parseFloat(corpo.preco);
	const estoque = parseInt(corpo.estoque);

	if (!titulo || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0) {
		return resp.code(400).send({ erro: 'campos invalidos' });
	}

	const r = await consulta(
		'update produto set titulo = $1, preco = $2, estoque = $3 where id = $4 returning *',
		[titulo, preco, estoque, id],
	);

	if (r.length === 0) return resp.code(404).send({ erro: 'produto nao encontrado' });
	return r[0];
}

async function deleteProduto(req, resp) {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return resp.code(400).send({ erro: 'id invalido' });

	// remove de qualquer carrinho onde esteja
	await consulta('delete from carrinho_produto where id_produto = $1', [id]);

	// se ja foi comprado, FK em pedido_produto impede delete real, entao soft delete
	const r = await consulta('select 1 from pedido_produto where id_produto = $1 limit 1', [id]);
	if (r.length > 0) {
		await consulta('update produto set ativo = false, estoque = 0 where id = $1', [id]);
	} else {
		await consulta('delete from produto where id = $1', [id]);
	}

	return resp.code(204).send();
}

module.exports = function (app) {
	app.get('/produtos', getProdutos);
	app.post('/produtos', { preHandler: exigirAdmin }, postProdutos);
	app.put('/produtos/:id', { preHandler: exigirAdmin }, putProduto);
	app.delete('/produtos/:id', { preHandler: exigirAdmin }, deleteProduto);
};
