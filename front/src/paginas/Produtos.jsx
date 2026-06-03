import { useState, useEffect } from 'react';
import CardProduto from '../componentes/CardProduto';
import { usarAviso } from '../contextos/ContextoAviso';
import * as apiProdutos from '../servicos/apiProdutos';

export default function Produtos() {
	const [produtos, setProdutos] = useState([]);
	const [termo, setTermo] = useState('');

	const aviso = usarAviso();

	useEffect(() => {
		apiProdutos.listar(termo).then(setProdutos).catch((e) => {
			aviso.mostrarErro(e.message);
		});
	}, [termo]);

	return (
		<div>
			<div className="p-4 sm:p-5 flex justify-center">
				<input
					type="text"
					value={termo}
					onChange={(e) => setTermo(e.target.value)}
					placeholder="Buscar Produto"
					className="w-full max-w-md border border-gray-300 rounded px-2.5 py-2.5 focus:outline-none focus:border-perigo"
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5 max-w-6xl mx-auto">
				{produtos.map(function (p) {
					return <CardProduto key={p.id} produto={p} />;
				})}
			</div>
		</div>
	);
}
