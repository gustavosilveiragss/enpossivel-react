import { createContext, useContext, useState } from 'react';
import Dialog from '../componentes/Dialog';

// contexto de avisos > qualquer componente chama mostrarErro/mostrarSucesso sem prop drill

const Contexto = createContext(null);

export function ProvedorAviso(props) {
	const [mensagem, setMensagem] = useState('');
	const [tipo, setTipo] = useState('notificacao');

	function mostrarErro(msg) {
		setTipo('confirmacao');
		setMensagem(msg);
	}

	function mostrarSucesso(msg) {
		setTipo('notificacao');
		setMensagem(msg);
	}

	function fechar() {
		setMensagem('');
	}

	const valor = {
		mostrarErro: mostrarErro,
		mostrarSucesso: mostrarSucesso,
	};

	return (
		<Contexto.Provider value={valor}>
			{props.children}

			<Dialog
				tipo={tipo}
				aberto={mensagem !== ''}
				titulo="Erro"
				mensagem={mensagem}
				aoFechar={fechar}
				aoConfirmar={fechar}
				aoCancelar={fechar}
			/>
		</Contexto.Provider>
	);
}

export function usarAviso() {
	return useContext(Contexto);
}
