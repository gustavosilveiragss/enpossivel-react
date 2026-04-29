import { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import Dialog from '../componentes/Dialog';
import { lerProdutos, salvarProduto, removerProduto, criarProduto } from '../services/mockDataService';
import { formatarMoeda } from '../services/moedaService';

export default function CadastroProdutos() {
	const [produtos, setProdutos] = useState(lerProdutos());
	const [aviso, setAviso] = useState('');
	const [paraRemover, setParaRemover] = useState(null);

	const timerRef = useRef(null);

	// muda o campo na hora e salva 400ms depois, pra nao spammar
	function salvar(id, chave, valor) {
		let novos = produtos.map(function (p) {
			if (p.id === id) {
				return { ...p, [chave]: valor };
			}
			return p;
		});
		setProdutos(novos);

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(function () {
			let p = {};
			for (let i = 0; i < novos.length; i++) {
				if (novos[i].id === id) {
					p = novos[i];
					break;
				}
			}
			salvarProduto(p.id, p);

			setAviso('Produto salvo');
		}, 400);
	}

	function confirmarRemocao() {
		removerProduto(paraRemover);
		setProdutos(lerProdutos());
		setParaRemover(null);

		setAviso('Produto removido');
	}

    // por ter valor formatado, precisa passar apenas o numerico
	function mudarPreco(id, valor) {
        // remove tudo que nao for numero e divide por 100 pra ter as casas decimais
		let numerico = parseFloat(valor.replace(/\D/g, '')) / 100 || 0;
		salvar(id, 'preco', numerico);
	}

	function mudarEstoque(id, valor) {
		let numerico = parseInt(valor) || 0;
		salvar(id, 'estoque', numerico);
	}

	function novo() {
		criarProduto({ titulo: 'Novo produto', preco: 0, caminhoImagem: '', estoque: 0 });
		setProdutos(lerProdutos());

		setAviso('Produto criado');
	}

	return (
		<div className="p-5 flex justify-center">
			<div className="w-4/5 md:w-2/3 px-5 py-2.5 mb-5 border border-gray-300 rounded-2xl">

				<div className="flex justify-center mt-2.5 mb-2.5">
					<Botao variante="verde" aoClicar={novo}>
						<Plus className="w-5 h-5" />
					</Botao>
				</div>

				<table className="w-full text-sm">
					<thead>
						<tr>
							<th className="px-4 py-2">Imagem</th>
							<th className="px-4 py-2">Produto</th>
							<th className="px-4 py-2">Preço</th>
							<th className="px-4 py-2">Estoque</th>
							<th className="px-4 py-2"></th>
						</tr>
					</thead>

					<tbody>
						{produtos.map(function (p) {
							return (
								<tr key={p.id}>
									<td className="px-4 py-2">
										<img
											src={p.caminhoImagem}
											alt={p.titulo}
											className="w-14 h-14 object-contain rounded-lg"
										/>
									</td>
									<td className="px-4 py-2 align-middle">
										<Campo
											valor={p.titulo}
											aoMudar={(v) => salvar(p.id, 'titulo', v)}
											centralizado
											semMargem
											obrigatorio
										/>
									</td>
									<td className="px-4 py-2 align-middle">
										<Campo
											valor={formatarMoeda(p.preco)}
											aoMudar={(v) => mudarPreco(p.id, v)}
											centralizado
											semMargem
											obrigatorio
										/>
									</td>
									<td className="px-4 py-2 align-middle">
										<Campo
											valor={String(p.estoque)}
											aoMudar={(v) => mudarEstoque(p.id, v)}
											centralizado
											semMargem
											obrigatorio
										/>
									</td>
									<td className="px-4 py-2 align-middle">
										<Botao variante="perigo" aoClicar={() => setParaRemover(p.id)}>
											<Trash2 className="w-5 h-5" />
										</Botao>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<Dialog
				tipo="confirmacao"
				aberto={paraRemover !== null}
				titulo="Remover produto"
				mensagem="Quer mesmo remover esse produto?"
				aoConfirmar={confirmarRemocao}
				aoCancelar={() => setParaRemover(null)}
			/>

			<Dialog
				tipo="notificacao"
				aberto={aviso !== ''}
				mensagem={aviso}
				aoFechar={() => setAviso('')}
			/>
		</div>
	);
}
