import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Save, X } from 'lucide-react';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import Dialog from '../componentes/Dialog';
import { formatarMoeda } from '../servicos/moedaService';
import { urlImagem } from '../servicos/api';
import { usarAviso } from '../contextos/ContextoAviso';
import * as apiProdutos from '../servicos/apiProdutos';

const formVazio = {
	titulo: '',
	preco: '',
	estoque: '',
};

export default function CadastroProdutos() {
	const [produtos, setProdutos] = useState([]);

	const [formNovo, setFormNovo] = useState(formVazio);
	const [errosNovo, setErrosNovo] = useState({});
	const [salvandoNovo, setSalvandoNovo] = useState(false);

	const [editandoId, setEditandoId] = useState(null);
	const [formEdit, setFormEdit] = useState(formVazio);
	const [errosEdit, setErrosEdit] = useState({});

	const [paraRemover, setParaRemover] = useState(null);

	const aviso = usarAviso();

	useEffect(function () {
		carregar();
	}, []);

	function carregar() {
		apiProdutos
			.listar('')
			.then(setProdutos)
			.catch(function (e) {
				aviso.mostrarErro(e.message);
			});
	}

	function validar(dados) {
		const erros = {};
		if (!dados.titulo || dados.titulo.trim() === '') erros.titulo = 'Obrigatorio';

		const preco = parseFloat(dados.preco);
		if (isNaN(preco) || preco < 0) erros.preco = 'Preco invalido';

		const estoque = parseInt(dados.estoque);
		if (isNaN(estoque) || estoque < 0) erros.estoque = 'Estoque invalido';

		return erros;
	}

	async function salvarNovo(e) {
		e.preventDefault();
		const erros = validar(formNovo);
		setErrosNovo(erros);
		if (Object.keys(erros).length > 0) return;

		setSalvandoNovo(true);
		try {
			await apiProdutos.criar({
				titulo: formNovo.titulo,
				preco: parseFloat(formNovo.preco),
				estoque: parseInt(formNovo.estoque),
			});
			setFormNovo(formVazio);
			setErrosNovo({});
			aviso.mostrarSucesso('Produto criado');
			carregar();
		} catch (erro) {
			aviso.mostrarErro(erro.message);
		} finally {
			setSalvandoNovo(false);
		}
	}

	function comecarEdicao(p) {
		setEditandoId(p.id);
		setFormEdit({
			titulo: p.titulo,
			preco: String(p.preco),
			estoque: String(p.estoque),
		});
		setErrosEdit({});
	}

	function cancelarEdicao() {
		setEditandoId(null);
		setFormEdit(formVazio);
		setErrosEdit({});
	}

	async function salvarEdicao() {
		const erros = validar(formEdit);
		setErrosEdit(erros);
		if (Object.keys(erros).length > 0) return;

		try {
			await apiProdutos.atualizar(editandoId, {
				titulo: formEdit.titulo,
				preco: parseFloat(formEdit.preco),
				estoque: parseInt(formEdit.estoque),
			});
			cancelarEdicao();
			aviso.mostrarSucesso('Produto salvo');
			carregar();
		} catch (erro) {
			aviso.mostrarErro(erro.message);
		}
	}

	async function confirmarRemocao() {
		const id = paraRemover;
		setParaRemover(null);

		try {
			await apiProdutos.remover(id);
			aviso.mostrarSucesso('Produto removido');
			carregar();
		} catch (erro) {
			aviso.mostrarErro(erro.message);
		}
	}

	function mudarNovo(chave, valor) {
		const proximos = { ...formNovo };
		proximos[chave] = valor;
		setFormNovo(proximos);
	}

	function mudarEdit(chave, valor) {
		const proximos = { ...formEdit };
		proximos[chave] = valor;
		setFormEdit(proximos);
	}

	return (
		<div className="p-4 sm:p-5 flex justify-center">
			<div className="w-full max-w-5xl">
				<div className="px-4 sm:px-5 py-4 mb-5 border border-gray-300 rounded-2xl bg-white">
					<h2 className="text-xl font-bold mb-2.5">Novo produto</h2>

					<form onSubmit={salvarNovo} className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<Campo
							label="Título:"
							valor={formNovo.titulo}
							aoMudar={(v) => mudarNovo('titulo', v)}
							erro={errosNovo.titulo}
							obrigatorio
						/>
						<Campo
							label="Preço:"
							valor={formNovo.preco}
							aoMudar={(v) => mudarNovo('preco', v)}
							tipo="number"
							erro={errosNovo.preco}
							obrigatorio
						/>
						<Campo
							label="Estoque:"
							valor={formNovo.estoque}
							aoMudar={(v) => mudarNovo('estoque', v)}
							tipo="number"
							erro={errosNovo.estoque}
							obrigatorio
						/>

						<div className="md:col-span-2 flex justify-center mt-2">
							<Botao tipo="submit" variante="verde" desabilitado={salvandoNovo}>
								<span className="inline-flex items-center gap-2">
									<Plus className="w-5 h-5" /> Adicionar
								</span>
							</Botao>
						</div>
					</form>
				</div>

				<div className="px-4 sm:px-5 py-4 mb-5 border border-gray-300 rounded-2xl bg-white">
					<h2 className="text-xl font-bold mb-2.5">Produtos cadastrados</h2>

					<div className="flex flex-col gap-3">
						{produtos.map(function (p) {
							if (editandoId === p.id) {
								return (
									<div
										key={p.id}
										className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border border-gray-300 rounded-2xl"
									>
										<Campo
											label="Título:"
											valor={formEdit.titulo}
											aoMudar={(v) => mudarEdit('titulo', v)}
											erro={errosEdit.titulo}
											obrigatorio
										/>
										<Campo
											label="Preço:"
											valor={formEdit.preco}
											aoMudar={(v) => mudarEdit('preco', v)}
											tipo="number"
											erro={errosEdit.preco}
											obrigatorio
										/>
										<Campo
											label="Estoque:"
											valor={formEdit.estoque}
											aoMudar={(v) => mudarEdit('estoque', v)}
											tipo="number"
											erro={errosEdit.estoque}
											obrigatorio
										/>

										<div className="md:col-span-2 flex justify-end gap-2">
											<Botao variante="verde" aoClicar={salvarEdicao}>
												<span className="inline-flex items-center gap-2">
													<Save className="w-5 h-5" /> Salvar
												</span>
											</Botao>
											<Botao variante="perigo" aoClicar={cancelarEdicao}>
												<span className="inline-flex items-center gap-2">
													<X className="w-5 h-5" /> Cancelar
												</span>
											</Botao>
										</div>
									</div>
								);
							}

							return (
								<div
									key={p.id}
									className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-300 rounded-2xl"
								>
									<img
										src={urlImagem(p.caminho_imagem)}
										alt={p.titulo}
										className="w-20 h-20 object-contain rounded-lg mx-auto sm:mx-0"
									/>

									<div className="flex-1 text-center sm:text-left">
										<div className="font-bold">{p.titulo}</div>
										<div className="text-sm text-gray-600">
											{formatarMoeda(p.preco)} | estoque: {p.estoque}
										</div>
									</div>

									<div className="flex justify-center sm:justify-end gap-2">
										<Botao variante="verde" aoClicar={() => comecarEdicao(p)}>
											<Pencil className="w-5 h-5" />
										</Botao>
										<Botao variante="perigo" aoClicar={() => setParaRemover(p.id)}>
											<Trash2 className="w-5 h-5" />
										</Botao>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<Dialog
				tipo="confirmacao"
				aberto={paraRemover !== null}
				titulo="Remover produto"
				mensagem="Quer mesmo remover esse produto?"
				aoConfirmar={confirmarRemocao}
				aoCancelar={() => setParaRemover(null)}
			/>
		</div>
	);
}
