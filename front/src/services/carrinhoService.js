const CHAVE = 'carrinho';

function lerCarrinho() {
	let s = localStorage.getItem(CHAVE);
	if (!s) return [];
	return JSON.parse(s);
}

function salvarCarrinho(itens) {
	localStorage.setItem(CHAVE, JSON.stringify(itens));
}

function adicionarAoCarrinho(produto) {
	let itens = lerCarrinho();

	// se ja tem, soma 1
	for (let i = 0; i < itens.length; i++) {
		if (itens[i].produto.id === produto.id) {
			itens[i].qtd = itens[i].qtd + 1;
			salvarCarrinho(itens);
			return;
		}
	}

	itens.push({ produto: produto, qtd: 1 });
	salvarCarrinho(itens);
}

export { lerCarrinho, salvarCarrinho, adicionarAoCarrinho };
