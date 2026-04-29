import { useState } from 'react';
import Botao from './Botao';
import Dialog from './Dialog';
import { formatarMoeda } from '../services/moedaService';
import { adicionarAoCarrinho } from '../services/carrinhoService';

export default function CardProduto(props) {
	const produto = props.produto;
	const [aviso, setAviso] = useState('');

	function adicionar() {
		adicionarAoCarrinho(produto);
		setAviso('Adicionado ao caldeirao');
	}

	return (
		<div className="w-full h-full p-5 border border-gray-300 rounded-2xl bg-white flex flex-col">
			<img
				src={produto.caminhoImagem}
				alt={produto.titulo}
				className="w-full h-56 object-contain rounded-2xl"
			/>

			<div className="min-h-24">
				<h3 className="text-xl font-bold mb-1">{produto.titulo}</h3>
				<span className="text-base font-bold">{formatarMoeda(produto.preco)}</span>
			</div>

			<div className="mt-auto pt-4">
				<Botao variante="vermelhoCheio" aoClicar={adicionar}>Adicionar ao Caldeirão</Botao>
			</div>

			<Dialog
				tipo="notificacao"
				aberto={aviso !== ''}
				mensagem={aviso}
				aoFechar={() => setAviso('')}
			/>
		</div>
	);
}
