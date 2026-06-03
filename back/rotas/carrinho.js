const { consulta } = require('../banco');

async function exigirLogin(req, resp) {
	try {
		await req.jwtVerify();
	} catch (e) {
		return resp.code(401).send({ erro: 'nao autenticado' });
	}
}

// cada conta tem 1 carrinho criado no cadastro
async function buscarIdCarrinho(idConta) {
	const r = await consulta('select id from carrinho where id_conta = $1', [idConta]);
	if (r.length === 0) return null;
	return r[0].id;
}

async function getCarrinho(req) {
	const idCarrinho = await buscarIdCarrinho(req.user.idConta);
	if (!idCarrinho) return [];

	// cada linha em carrinho_produto = 1 unidade do produto
	return consulta(
		`select p.id, p.titulo, p.preco, p.caminho_imagem, p.estoque, count(*)::int as qtd
		 from carrinho_produto cp
		 join produto p on p.id = cp.id_produto
		 where cp.id_carrinho = $1
		 group by p.id
		 order by min(cp.criado_em)`,
		[idCarrinho],
	);
}

async function postCarrinho(req, resp) {
	const idProduto = parseInt(req.body && req.body.idProduto);
	if (isNaN(idProduto)) return resp.code(400).send({ erro: 'idProduto invalido' });

	const idCarrinho = await buscarIdCarrinho(req.user.idConta);
	if (!idCarrinho) return resp.code(400).send({ erro: 'carrinho nao encontrado' });

	const r = await consulta('select estoque from produto where id = $1 and ativo = true', [idProduto]);
	if (r.length === 0) return resp.code(404).send({ erro: 'produto nao encontrado' });
	if (r[0].estoque <= 0) return resp.code(400).send({ erro: 'sem estoque' });

	await consulta('insert into carrinho_produto (id_carrinho, id_produto) values ($1, $2)', [
		idCarrinho,
		idProduto,
	]);
	await consulta('update produto set estoque = estoque - 1 where id = $1', [idProduto]);

	return resp.code(201).send({ ok: true });
}

async function deleteCarrinho(req, resp) {
	const idProduto = parseInt(req.params.idProduto);
	if (isNaN(idProduto)) return resp.code(400).send({ erro: 'idProduto invalido' });

	const idCarrinho = await buscarIdCarrinho(req.user.idConta);
	if (!idCarrinho) return resp.code(400).send({ erro: 'carrinho nao encontrado' });

	// remove a linha mais recente desse produto no carrinho (1 unidade por vez)
	const achadas = await consulta(
		`select id from carrinho_produto
		 where id_carrinho = $1 and id_produto = $2
		 order by criado_em desc limit 1`,
		[idCarrinho, idProduto],
	);
	if (achadas.length === 0) {
		return resp.code(404).send({ erro: 'item nao encontrado no carrinho' });
	}

	await consulta('delete from carrinho_produto where id = $1', [achadas[0].id]);
	await consulta('update produto set estoque = estoque + 1 where id = $1', [idProduto]);

	return resp.code(204).send();
}

module.exports = function (app) {
	app.get('/carrinho', { preHandler: exigirLogin }, getCarrinho);
	app.post('/carrinho', { preHandler: exigirLogin }, postCarrinho);
	app.delete('/carrinho/:idProduto', { preHandler: exigirLogin }, deleteCarrinho);
};
