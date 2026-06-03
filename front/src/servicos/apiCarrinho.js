import { get, post, del } from './api';

function listar() {
	return get('/carrinho');
}

function adicionar(idProduto) {
	return post('/carrinho', { idProduto: idProduto });
}

function remover(idProduto) {
	return del('/carrinho/' + idProduto);
}

export { listar, adicionar, remover };
