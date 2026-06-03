import { get, post, put, del } from './api';

function listar(busca) {
	const termo = busca || '';
	return get('/produtos?busca=' + encodeURIComponent(termo));
}

function criar(dados) {
	return post('/produtos', dados);
}

function atualizar(id, dados) {
	return put('/produtos/' + id, dados);
}

function remover(id) {
	return del('/produtos/' + id);
}

export { listar, criar, atualizar, remover };
