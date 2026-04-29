import { useState } from 'react';
import Botao from '../componentes/Botao';
import Dialog from '../componentes/Dialog';
import LinhaCarrinho from '../componentes/LinhaCarrinho';
import { formatarMoeda } from '../services/moedaService';
import { lerCarrinho, salvarCarrinho } from '../services/mockDataService';

export default function Carrinho() {
	const [itens, setItens] = useState(lerCarrinho());
	const [paraRemover, setParaRemover] = useState(null);
	const [aviso, setAviso] = useState('');

	// valr total do carrinho
	let total = 0;
	for (let i = 0; i < itens.length; i++) {
		total += itens[i].produto.preco * itens[i].qtd;
	}


	function mudarQtd(id, valor) {
		if (valor === '') return;
		let n = parseInt(valor);

		// 0 ou menos = pede remocao
		if (n <= 0) {
			setParaRemover(id);
			return;
		}

		let novos = itens.map(function (i) {
			if (i.produto.id === id) {
				return { produto: i.produto, qtd: n };
			}
			return i;
		});
		setItens(novos);
		salvarCarrinho(novos);
	}

	function confirmar() {
		let novos = itens.filter(function (i) {
			return i.produto.id !== paraRemover;
		});
		setItens(novos);
		salvarCarrinho(novos);
		setParaRemover(null);
		setAviso('Removido do caldeirao');
	}


	const notificacao = (
		<Dialog
			tipo="notificacao"
			aberto={aviso !== ''}
			mensagem={aviso}
			aoFechar={() => setAviso('')}
		/>
	);

	if (itens.length === 0) {
		return (
			<div className="w-full flex justify-center pt-10">
				<p className="text-gray-700">Caldeirão vazio</p>
				{notificacao}
			</div>
		);
	}

	return (
		<div className="w-full flex justify-center">
			<div className="flex flex-col items-center pt-5">
				<table className="border border-gray-300 rounded-2xl">
					<thead>
						<tr>
							<th className="px-4 py-2">Produto</th>
							<th className="px-4 py-2">Preço</th>
							<th className="px-4 py-2">Qtd</th>
							<th className="px-4 py-2">Subtotal</th>
							<th className="px-4 py-2"></th>
						</tr>
					</thead>
					<tbody>
						{itens.map(function (i) {
							return (
								<LinhaCarrinho
									key={i.produto.id}
									item={i}
									aoMudarQtd={mudarQtd}
									aoRemover={setParaRemover}
								/>
							);
						})}
					</tbody>
				</table>

				<div className="p-2.5 my-5 border border-gray-300 rounded-2xl text-xl font-bold">
					Total: {formatarMoeda(total)}
				</div>

				<Botao variante="verde">Fazer pedido</Botao>
			</div>

			<Dialog
				tipo="confirmacao"
				aberto={paraRemover !== null}
				titulo="Remover item"
				mensagem="Quer mesmo remover esse item do caldeirao?"
				aoConfirmar={confirmar}
				aoCancelar={() => setParaRemover(null)}
			/>

			{notificacao}
		</div>
	);
}
