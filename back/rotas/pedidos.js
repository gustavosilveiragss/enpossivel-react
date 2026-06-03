const { consulta } = require('../banco');

async function exigirLogin(req, resp) {
	try {
		await req.jwtVerify();
	} catch (e) {
		return resp.code(401).send({ erro: 'nao autenticado' });
	}
}

async function postPedido(req, resp) {
	const total = parseFloat(req.body && req.body.total);
	if (isNaN(total) || total <= 0) return resp.code(400).send({ erro: 'total invalido' });

	const idConta = req.user.idConta;

	const c = await consulta('select id from carrinho where id_conta = $1', [idConta]);
	if (c.length === 0) return resp.code(400).send({ erro: 'carrinho nao encontrado' });
	const idCarrinho = c[0].id;

	const itens = await consulta('select id_produto from carrinho_produto where id_carrinho = $1', [
		idCarrinho,
	]);
	if (itens.length === 0) return resp.code(400).send({ erro: 'carrinho vazio' });

	// pedido criado com status 'incompleto'. so vira 'finalizado' no PUT com dados de pagamento
	const novo = await consulta(
		'insert into pedido (id_conta, total) values ($1, $2) returning id',
		[idConta, total],
	);
	const idPedido = novo[0].id;

	for (let i = 0; i < itens.length; i++) {
		await consulta('insert into pedido_produto (id_pedido, id_produto) values ($1, $2)', [
			idPedido,
			itens[i].id_produto,
		]);
	}

	return resp.code(201).send({ idPedido });
}

async function getPedidoAtual(req, resp) {
	const r = await consulta(
		`select * from pedido
		 where id_conta = $1 and status = 'incompleto'
		 order by criado_em desc limit 1`,
		[req.user.idConta],
	);
	if (r.length === 0) return resp.code(404).send({ erro: 'sem pedido em andamento' });
	return r[0];
}

async function getProdutosDoPedido(req, resp) {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return resp.code(400).send({ erro: 'id invalido' });

	// verifica que o pedido pertence a quem ta fazendo o request
	const dono = await consulta('select id_conta from pedido where id = $1', [id]);
	if (dono.length === 0) return resp.code(404).send({ erro: 'pedido nao encontrado' });
	if (dono[0].id_conta !== req.user.idConta) {
		return resp.code(403).send({ erro: 'acesso negado' });
	}

	// count(*)::int = conta quantas vezes o produto aparece (= qtd comprada)
	// ::int converte de bigint pra int normal
	return consulta(
		`select p.id, p.titulo, p.preco, p.caminho_imagem, count(*)::int as qtd
		 from pedido_produto pp
		 join produto p on p.id = pp.id_produto
		 where pp.id_pedido = $1
		 group by p.id
		 order by min(pp.criado_em)`,
		[id],
	);
}

async function putPedido(req, resp) {
	const id = parseInt(req.params.id);
	if (isNaN(id)) return resp.code(400).send({ erro: 'id invalido' });

	const corpo = req.body || {};
	const cpf = corpo.cpf;
	const metodo = corpo.metodoPagamento;
	const cartao = corpo.cartao;

	// cpf tem 11 numeros (ignora pontuacao)
	if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
		return resp.code(400).send({ erro: 'cpf invalido' });
	}
	if (metodo !== 'pix' && metodo !== 'debit' && metodo !== 'credit') {
		return resp.code(400).send({ erro: 'metodo de pagamento invalido' });
	}

	const dono = await consulta('select id_conta, status from pedido where id = $1', [id]);
	if (dono.length === 0) return resp.code(404).send({ erro: 'pedido nao encontrado' });
	if (dono[0].id_conta !== req.user.idConta) {
		return resp.code(403).send({ erro: 'acesso negado' });
	}
	if (dono[0].status === 'finalizado') {
		return resp.code(400).send({ erro: 'pedido ja finalizado' });
	}

	// so debit/credit precisam de cartao. pix passa direto.
	let idCartao = null;
	if (metodo === 'debit' || metodo === 'credit') {
		if (!cartao || !cartao.nomeDono || !cartao.numero || !cartao.validade || !cartao.cvv) {
			return resp.code(400).send({ erro: 'dados do cartao incompletos' });
		}
		if (cartao.cvv.length !== 3) {
			return resp.code(400).send({ erro: 'cvv invalido' });
		}

		const ins = await consulta(
			`insert into cartao (id_conta, nome_dono, numero, data_validade, cvv)
			 values ($1, $2, $3, $4, $5) returning id`,
			[req.user.idConta, cartao.nomeDono, cartao.numero, cartao.validade, cartao.cvv],
		);
		idCartao = ins[0].id;
	}

	await consulta(
		`update pedido set status = 'finalizado', cpf = $1, metodo_pagamento = $2, id_cartao = $3
		 where id = $4`,
		[cpf, metodo, idCartao, id],
	);

	// limpa o carrinho da conta depois de fechar o pedido
	await consulta(
		`delete from carrinho_produto
		 where id_carrinho = (select id from carrinho where id_conta = $1)`,
		[req.user.idConta],
	);

	return { ok: true };
}

module.exports = function (app) {
	app.post('/pedidos', { preHandler: exigirLogin }, postPedido);
	app.get('/pedidos/atual', { preHandler: exigirLogin }, getPedidoAtual);
	app.get('/pedidos/:id/produtos', { preHandler: exigirLogin }, getProdutosDoPedido);
	app.put('/pedidos/:id', { preHandler: exigirLogin }, putPedido);
};
