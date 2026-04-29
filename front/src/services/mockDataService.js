const CHAVE_PRODUTOS = 'enpossivel_produtos';
const CHAVE_CARRINHO = 'enpossivel_carrinho';

const produtosPadrao = [
	{
		id: 1,
		titulo: 'Pegada Original do Pé Grande em Gesso',
		preco: 45000.0,
		caminhoImagem: '/imagens/pe_grande.jpg',
		estoque: 3
	},
	{
		id: 2,
		titulo: 'Foto Autêntica do Monstro de Loch Ness',
		preco: 128500.0,
		caminhoImagem: '/imagens/nessie.jpg',
		estoque: 5
	},
	{
		id: 3,
		titulo: 'Cachimbo Usado do Saci',
		preco: 72900.0,
		caminhoImagem: '/imagens/saci.jpg',
		estoque: 1
	},
	{
		id: 4,
		titulo: 'Ferradura da Mula Sem Cabeça',
		preco: 98000.0,
		caminhoImagem: '/imagens/mula.webp',
		estoque: 4
	},
	{
		id: 5,
		titulo: 'Amostra de Pelo Flamejante do Curupira',
		preco: 61500.0,
		caminhoImagem: '/imagens/curupira.webp',
		estoque: 60
	},

	{
		id: 6,
		titulo: 'Tentáculo de Kraken',
		preco: 450000.0,
		caminhoImagem: '/imagens/kraken.jpg',
		estoque: 8
	},
	{
		id: 7,
		titulo: 'Pena Fresca de Fênix Renascida',
		preco: 890000.0,
		caminhoImagem: '/imagens/fenix.jpg',
		estoque: 150
	},
	{
		id: 8,
		titulo: 'Chifre Certificado de Unicórnio',
		preco: 1250000.0,
		caminhoImagem: '/imagens/unicornio.jpg',
		estoque: 2
	},
	{
		id: 9,
		titulo: 'Garra Preservada do Chupacabra',
		preco: 38750.0,
		caminhoImagem: '/imagens/chupacabra.jpg',
		estoque: 10
	},
	{
		id: 10,
		titulo: 'Parafuso Original do Disco de McMinnville',
		preco: 325000.0,
		caminhoImagem: '/imagens/ovni.jpg',
		estoque: 9
	},
];

function inicializarProdutos() {
	if (!localStorage.getItem(CHAVE_PRODUTOS)) {
		localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtosPadrao));
	}
}

function lerProdutos() {
	inicializarProdutos();
	let s = localStorage.getItem(CHAVE_PRODUTOS);
	return JSON.parse(s) || [];
}

function salvarProduto(id, dados) {
	let produtos = lerProdutos();
	for (let i = 0; i < produtos.length; i++) {
		if (produtos[i].id === id) {
			produtos[i] = { id: id, ...dados };
			localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
			return;
		}
	}
}

function removerProduto(id) {
	let produtos = lerProdutos();
	for (let i = 0; i < produtos.length; i++) {
		if (produtos[i].id === id) {
			produtos.splice(i, 1);
			localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
			return;
		}
	}
}

function criarProduto(dados) {
	let produtos = lerProdutos();
	let id = 1;
	if (produtos.length > 0) {
		id = produtos[produtos.length - 1].id + 1;
	}
	produtos.push({ id: id, ...dados });
	localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
}


function lerCarrinho() {
	let s = localStorage.getItem(CHAVE_CARRINHO);
	if (!s) return [];
	return JSON.parse(s);
}

function salvarCarrinho(itens) {
	localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
}

function adicionarAoCarrinho(produto) {
	let itens = lerCarrinho();

	// se ja tem, soma 1
	for (let i = 0; i < itens.length; i++) {
		if (itens[i].produto.id === produto.id) {
			itens[i].qtd++;
			salvarCarrinho(itens);
			return;
		}
	}

	itens.push({ produto: produto, qtd: 1 });
	salvarCarrinho(itens);
}

export { lerProdutos, salvarProduto, removerProduto, criarProduto, lerCarrinho, salvarCarrinho, adicionarAoCarrinho, inicializarProdutos };
