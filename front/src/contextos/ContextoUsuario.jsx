import { createContext, useContext, useState, useEffect } from 'react';
import * as apiContas from '../servicos/apiContas';

// contexto > compartilha estado entre comps sem prop drill
const Contexto = createContext(null);

export function ProvedorUsuario(props) {
	const [idConta, setIdConta] = useState(null);
	const [papel, setPapel] = useState('anon');
	const [carregando, setCarregando] = useState(true);

	useEffect(function () {
		// jwt fica em cookie httpOnly, assim so o browser envia
		// localStorage qualquer script malicioso acessa
		// chama /me pra saber se o cookie ainda é valido ao abrir o app
		async function verificarSessao() {
			try {
				const r = await apiContas.buscarMe();
				setIdConta(r.idConta);
				setPapel(r.papel);
			} catch {
				// sem cookie ou expirado, fica anonimo
			}
			setCarregando(false);
		}
		verificarSessao();
	}, []);

	function logar(dados) {
		setIdConta(dados.idConta);
		setPapel(dados.papel);
	}

	async function deslogar() {
		try {
			await apiContas.logout();
		} catch {
			// se falhar no servidor, limpa estado local mesmo assim
		}
		setIdConta(null);
		setPapel('anon');
	}

	const logado = idConta !== null;
	const souAdmin = papel === 'admin';

	const valor = {
		idConta: idConta,
		papel: papel,
		carregando: carregando,
		logado: logado,
		souAdmin: souAdmin,
		logar: logar,
		deslogar: deslogar,
	};

	return <Contexto.Provider value={valor}>{props.children}</Contexto.Provider>;
}

export function usarUsuario() {
	return useContext(Contexto);
}
