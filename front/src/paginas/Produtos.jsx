import { useState } from 'react';
import CardProduto from '../componentes/CardProduto';
import { lerProdutos } from '../services/mockDataService';

export default function Produtos() {
	const [produtos, setProdutos] = useState(lerProdutos());
	const [termo, setTermo] = useState('');

	// filtra por titulo e estoque
	let lista = [];
	for (let i = 0; i < produtos.length; i++) {
		if (produtos[i].estoque > 0 && produtos[i].titulo.toLowerCase().includes(termo.toLowerCase())) {
			lista.push(produtos[i]);
		}
	}

	return (
		<div>
			<div className="p-5 flex justify-center">
				<input
					type="text"
					value={termo}
					onChange={(e) => setTermo(e.target.value)}
					placeholder="Buscar Produto"
					className="w-full max-w-md border border-gray-300 rounded px-2.5 py-2.5 focus:outline-none focus:border-perigo"
				/>
			</div>

			<div className="grid grid-cols-3 gap-5 p-5 max-w-6xl mx-auto">
				{lista.map(function (p) {
					return <CardProduto key={p.id} produto={p} />;
				})}
			</div>
		</div>
	);
}
