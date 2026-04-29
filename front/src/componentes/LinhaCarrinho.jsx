import Botao from './Botao';
import { formatarMoeda } from '../services/moedaService';

export default function LinhaCarrinho(props) {
	const i = props.item;

	return (
		<tr>
			<td className="px-4 py-2">
				<div className="flex items-center gap-2.5">
					<img
						src={i.produto.caminhoImagem}
						alt={i.produto.titulo}
						className="w-14 h-14 object-contain rounded-lg"
					/>
					<span>{i.produto.titulo}</span>
				</div>
			</td>
			<td className="px-4 py-2">{formatarMoeda(i.produto.preco)}</td>
			<td className="px-4 py-2">
				<input
					type="number"
					min="1"
					value={i.qtd}
					onChange={(e) => props.aoMudarQtd(i.produto.id, e.target.value)}
					className="w-20 text-center border border-gray-300 rounded px-2 py-1"
				/>
			</td>
			<td className="px-4 py-2 font-bold">{formatarMoeda(i.produto.preco * i.qtd)}</td>
			<td className="px-4 py-2">
				<Botao variante="perigo" aoClicar={() => props.aoRemover(i.produto.id)}>
					Remover
				</Botao>
			</td>
		</tr>
	);
}
