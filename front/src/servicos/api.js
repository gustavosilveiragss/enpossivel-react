const baseUrl = import.meta.env.VITE_API_URL;

// chamada genérica pra API, usada por get/post/put/del. Com tratativa de erros e resposta json
async function chamar(metodo, rota, corpo) {
	const opcoes = {
		method: metodo,
		credentials: 'include',
		headers: {},
	};

	if (corpo !== undefined) {
		opcoes.headers['Content-Type'] = 'application/json';
		opcoes.body = JSON.stringify(corpo);
	}

	let resp;
	try {
		resp = await fetch(baseUrl + rota, opcoes);
	} catch (e) {
		throw new Error('Sem conexao com o servidor');
	}

	if (resp.status === 204) return null;

	let dados = null;
	try {
		dados = await resp.json();
	} catch (e) {
		dados = null;
	}

	if (!resp.ok) {
		const msg = (dados && dados.erro) || 'Erro no servidor';
		throw new Error(msg);
	}

	return dados;
}

function get(rota) {
	return chamar('GET', rota);
}

function post(rota, corpo) {
	return chamar('POST', rota, corpo);
}

function put(rota, corpo) {
	return chamar('PUT', rota, corpo);
}

function del(rota) {
	return chamar('DELETE', rota);
}

function urlImagem(caminho) {
	if (!caminho) return '';
	return caminho;
}

export { get, post, put, del, urlImagem };
