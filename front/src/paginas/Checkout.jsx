import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import { formatarMoeda } from '../servicos/moedaService';
import { urlImagem } from '../servicos/api';
import { usarAviso } from '../contextos/ContextoAviso';
import * as apiPedidos from '../servicos/apiPedidos';

function formatarCpf(valor) {
	const digitos = valor.replace(/\D/g, '').slice(0, 11);
	let s = digitos;
	if (digitos.length > 3) s = digitos.slice(0, 3) + '.' + digitos.slice(3);
	if (digitos.length > 6) s = s.slice(0, 7) + '.' + s.slice(7);
	if (digitos.length > 9) s = s.slice(0, 11) + '-' + s.slice(11);
	return s;
}

function formatarNumeroCartao(valor) {
	const digitos = valor.replace(/\D/g, '').slice(0, 16);
	let s = '';
	for (let i = 0; i < digitos.length; i++) {
		if (i > 0 && i % 4 === 0) s += ' ';
		s += digitos[i];
	}
	return s;
}

export default function Checkout() {
	const [pedido, setPedido] = useState(null);
	const [produtos, setProdutos] = useState([]);

	const [cpf, setCpf] = useState('');
	const [metodo, setMetodo] = useState('pix');

	const [nomeDono, setNomeDono] = useState('');
	const [numero, setNumero] = useState('');
	const [validade, setValidade] = useState('');
	const [cvv, setCvv] = useState('');

	const [erros, setErros] = useState({});
	const [enviando, setEnviando] = useState(false);

	const aviso = usarAviso();
	const navigate = useNavigate();

	useEffect(function () {
		carregar();
	}, []);

	async function carregar() {
		try {
			const ped = await apiPedidos.buscarAtual();
			setPedido(ped);
			const prods = await apiPedidos.listarProdutos(ped.id);
			setProdutos(prods);
		} catch (e) {
			aviso.mostrarErro(e.message);
			navigate('/carrinho');
		}
	}

	function validar() {
		const e = {};
		if (cpf.replace(/\D/g, '').length !== 11) e.cpf = 'CPF invalido';

		if (metodo === 'debit' || metodo === 'credit') {
			if (!nomeDono) e.nomeDono = 'Obrigatorio';
			if (numero.replace(/\D/g, '').length < 13) e.numero = 'Numero invalido';
			if (!validade) e.validade = 'Obrigatorio';
			if (cvv.length !== 3) e.cvv = 'CVV invalido';
		}

		return e;
	}

	async function finalizar(ev) {
		ev.preventDefault();
		const er = validar();
		setErros(er);
		if (Object.keys(er).length > 0) return;

		const dados = {
			cpf: cpf,
			metodoPagamento: metodo,
		};

		if (metodo === 'debit' || metodo === 'credit') {
			dados.cartao = {
				nomeDono: nomeDono,
				numero: numero,
				validade: validade,
				cvv: cvv,
			};
		}

		setEnviando(true);
		try {
			await apiPedidos.finalizar(pedido.id, dados);
			aviso.mostrarSucesso('Pedido finalizado!');
			navigate('/');
		} catch (e) {
			aviso.mostrarErro(e.message);
		} finally {
			setEnviando(false);
		}
	}

	if (!pedido) {
		return (
			<div className="w-full flex justify-center pt-10">
				<p className="text-gray-700">Carregando...</p>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-5 flex justify-center">
			<div className="w-full max-w-3xl">
				<div className="px-4 sm:px-5 py-4 mb-5 border border-gray-300 rounded-2xl bg-white">
					<h2 className="text-xl font-bold mb-2.5">Itens do pedido</h2>

					{produtos.map(function (p) {
						return (
							<div
								key={p.id}
								className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-b-0"
							>
								<img
									src={urlImagem(p.caminho_imagem)}
									alt={p.titulo}
									className="w-12 h-12 object-contain rounded-lg shrink-0"
								/>
								<div className="flex-1 min-w-0 truncate">{p.titulo}</div>
								<div className="shrink-0">x{p.qtd}</div>
								<div className="font-bold shrink-0">{formatarMoeda(p.preco * p.qtd)}</div>
							</div>
						);
					})}

					<div className="text-right text-lg font-bold pt-3">
						Total: {formatarMoeda(pedido.total)}
					</div>
				</div>

				<form
					onSubmit={finalizar}
					className="px-4 sm:px-5 py-4 mb-5 border border-gray-300 rounded-2xl bg-white"
				>
					<h2 className="text-xl font-bold mb-2.5">Dados de pagamento</h2>

					<Campo
						label="CPF:"
						valor={cpf}
						aoMudar={(v) => setCpf(formatarCpf(v))}
						placeholder="000.000.000-00"
						erro={erros.cpf}
						obrigatorio
					/>

					<div className="mb-5">
						<label className="block mb-1 font-bold">Método:</label>
						<div className="flex flex-wrap gap-4">
							<label className="flex items-center gap-1">
								<input
									type="radio"
									name="metodo"
									value="pix"
									checked={metodo === 'pix'}
									onChange={() => setMetodo('pix')}
								/>
								Pix
							</label>
							<label className="flex items-center gap-1">
								<input
									type="radio"
									name="metodo"
									value="debit"
									checked={metodo === 'debit'}
									onChange={() => setMetodo('debit')}
								/>
								Débito
							</label>
							<label className="flex items-center gap-1">
								<input
									type="radio"
									name="metodo"
									value="credit"
									checked={metodo === 'credit'}
									onChange={() => setMetodo('credit')}
								/>
								Crédito
							</label>
						</div>
					</div>

					{(metodo === 'debit' || metodo === 'credit') && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<Campo
								label="Nome no cartão:"
								valor={nomeDono}
								aoMudar={setNomeDono}
								erro={erros.nomeDono}
								obrigatorio
							/>
							<Campo
								label="Número do cartão:"
								valor={numero}
								aoMudar={(v) => setNumero(formatarNumeroCartao(v))}
								placeholder="0000 0000 0000 0000"
								erro={erros.numero}
								obrigatorio
							/>
							<Campo
								label="Validade:"
								valor={validade}
								aoMudar={setValidade}
								tipo="month"
								erro={erros.validade}
								obrigatorio
							/>
							<Campo
								label="CVV:"
								valor={cvv}
								aoMudar={(v) => setCvv(v.replace(/\D/g, '').slice(0, 3))}
								erro={erros.cvv}
								obrigatorio
							/>
						</div>
					)}

					<div className="flex justify-center mt-4">
						<Botao tipo="submit" variante="verde" desabilitado={enviando}>
							Finalizar pedido
						</Botao>
					</div>
				</form>
			</div>
		</div>
	);
}
