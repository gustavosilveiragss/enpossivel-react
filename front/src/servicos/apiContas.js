import { get, post } from './api';

function cadastrar(nome, email, senha) {
	return post('/contas', { nome: nome, email: email, senha: senha });
}

function login(email, senha) {
	return post('/login', { email: email, senha: senha });
}

function logout() {
	return post('/logout');
}

function buscarMe() {
	return get('/me');
}

export { cadastrar, login, logout, buscarMe };
