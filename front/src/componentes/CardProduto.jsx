import { useNavigate } from 'react-router-dom';
import Botao from './Botao';
import { formatarMoeda } from '../servicos/moedaService';
import { urlImagem } from '../servicos/api';
import { usarUsuario } from '../contextos/ContextoUsuario';
import { usarAviso } from '../contextos/ContextoAviso';
import * as apiCarrinho from '../servicos/apiCarrinho';

export default function CardProduto(props) {
	const produto = props.produto;
	const imagem = urlImagem(produto.caminho_imagem);

	const usuario = usarUsuario();
	const aviso = usarAviso();
	const navigate = useNavigate();

	async function adicionar() {
		if (!usuario.logado) {
			navigate('/login');
			return;
		}

		try {
			await apiCarrinho.adicionar(produto.id);
			aviso.mostrarSucesso('Adicionado ao caldeirao');
		} catch (e) {
			aviso.mostrarErro(e.message);
		}
	}

	return (
		<div className="w-full h-full p-4 sm:p-5 border border-gray-300 rounded-2xl bg-white flex flex-col">
			<img
				src={imagem}
				alt={produto.titulo}
				className="w-full h-44 sm:h-56 object-contain rounded-2xl"
			/>

			<div className="min-h-24 mt-2">
				<h3 className="text-lg sm:text-xl font-bold mb-1">{produto.titulo}</h3>
				<span className="text-base font-bold">{formatarMoeda(produto.preco)}</span>
			</div>

			<div className="mt-auto pt-4">
				<Botao variante="vermelhoCheio" aoClicar={adicionar}>
					Adicionar ao Caldeirão
				</Botao>
			</div>
		</div>
	);
}
