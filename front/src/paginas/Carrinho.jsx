import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Botao from '../componentes/Botao';
import Dialog from '../componentes/Dialog';
import { formatarMoeda } from '../servicos/moedaService';
import { urlImagem } from '../servicos/api';
import * as apiCarrinho from '../servicos/apiCarrinho';
import * as apiPedidos from '../servicos/apiPedidos';
import { usarAviso } from '../contextos/ContextoAviso';

export default function Carrinho() {
	const [itens, setItens] = useState([]);
	const [paraRemover, setParaRemover] = useState(null);
	const [carregando, setCarregando] = useState(true);

	const aviso = usarAviso();
	const navigate = useNavigate();

	useEffect(() => {
		carregar();
	}, []);

	function carregar() {
		setCarregando(true);
		apiCarrinho
			.listar()
			.then((lista) => {
				setItens(lista);
			})
			.catch((e) => {
				aviso.mostrarErro(e.message);
			})
			.finally(() => {
				setCarregando(false);
			});
	}

	let total = 0;
	for (let i = 0; i < itens.length; i++) {
		total += Number(itens[i].preco) * itens[i].qtd;
	}

	async function mudarQtd(produto, valor) {
		if (valor === '') return;
		const n = parseInt(valor);

		if (n <= 0) {
			setParaRemover(produto.id);
			return;
		}

		try {
			if (n > produto.qtd) {
				for (let k = 0; k < n - produto.qtd; k++) {
					await apiCarrinho.adicionar(produto.id);
				}
			} else if (n < produto.qtd) {
				for (let k = 0; k < produto.qtd - n; k++) {
					await apiCarrinho.remover(produto.id);
				}
			}
			carregar();
		} catch (e) {
			aviso.mostrarErro(e.message);
			carregar();
		}
	}

	async function confirmarRemocao() {
		const id = paraRemover;
		setParaRemover(null);

		// busca qtd atual pra remover todas as linhas desse produto
		let qtd = 0;
		for (let i = 0; i < itens.length; i++) {
			if (itens[i].id === id) {
				qtd = itens[i].qtd;
				break;
			}
		}

		try {
			for (let k = 0; k < qtd; k++) {
				await apiCarrinho.remover(id);
			}
			aviso.mostrarSucesso('Removido do caldeirao');
			carregar();
		} catch (e) {
			aviso.mostrarErro(e.message);
			carregar();
		}
	}

	async function fazerPedido() {
		try {
			await apiPedidos.criar(total);
			navigate('/checkout');
		} catch (e) {
			aviso.mostrarErro(e.message);
		}
	}

	if (carregando) {
		return (
			<div className="w-full flex justify-center pt-10">
				<p className="text-gray-700">Carregando...</p>
			</div>
		);
	}

	if (itens.length === 0) {
		return (
			<div className="w-full flex justify-center pt-10">
				<p className="text-gray-700">Caldeirão vazio</p>
			</div>
		);
	}

	return (
		<div className="w-full flex justify-center px-4 sm:px-5">
			<div className="flex flex-col items-center pt-5 w-full max-w-5xl">
				<div className="w-full flex flex-col gap-3">
					{itens.map((it) => {
						const subtotal = Number(it.preco) * it.qtd;
						return (
							<div
								key={it.id}
								className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-300 rounded-2xl bg-white"
							>
								<img
									src={urlImagem(it.caminho_imagem)}
									alt={it.titulo}
									className="w-20 h-20 object-contain rounded-lg mx-auto sm:mx-0"
								/>

								<div className="flex-1 text-center sm:text-left">
									<div className="font-bold">{it.titulo}</div>
									<div className="text-sm text-gray-600">{formatarMoeda(it.preco)}</div>
								</div>

								<div className="flex items-center justify-between sm:justify-end gap-3">
									<input
										type="number"
										min="1"
										value={it.qtd}
										onChange={(e) => mudarQtd(it, e.target.value)}
										className="w-20 text-center border border-gray-300 rounded px-2 py-1"
									/>
									<div className="font-bold w-28 text-right">{formatarMoeda(subtotal)}</div>
									<Botao variante="perigo" aoClicar={() => setParaRemover(it.id)}>
										<Trash2 className="w-5 h-5" />
									</Botao>
								</div>
							</div>
						);
					})}
				</div>

				<div className="p-2.5 my-5 border border-gray-300 rounded-2xl text-xl font-bold text-center">
					Total: {formatarMoeda(total)}
				</div>

				<Botao variante="verde" aoClicar={fazerPedido}>
					Fazer pedido
				</Botao>
			</div>

			<Dialog
				tipo="confirmacao"
				aberto={paraRemover !== null}
				titulo="Remover item"
				mensagem="Quer mesmo remover esse item do caldeirao?"
				aoConfirmar={confirmarRemocao}
				aoCancelar={() => setParaRemover(null)}
			/>
		</div>
	);
}
