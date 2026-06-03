import { get, post, put } from './api';

function criar(total) {
	return post('/pedidos', { total: total });
}

function buscarAtual() {
	return get('/pedidos/atual');
}

function listarProdutos(idPedido) {
	return get('/pedidos/' + idPedido + '/produtos');
}

function finalizar(idPedido, dados) {
	return put('/pedidos/' + idPedido, dados);
}

export { criar, buscarAtual, listarProdutos, finalizar };
