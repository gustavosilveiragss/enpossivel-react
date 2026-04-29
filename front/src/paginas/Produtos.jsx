import { useState } from 'react';
import CardProduto from '../componentes/CardProduto';

const produtos = [
	{
		id: 1,
		titulo: 'Pegada Original do Pé Grande em Gesso',
		preco: 45000.0,
		caminhoImagem: '/imagens/pe_grande.jpg',
	},
	{
		id: 2,
		titulo: 'Foto Autêntica do Monstro de Loch Ness',
		preco: 128500.0,
		caminhoImagem: '/imagens/nessie.jpg',
	},
	{
		id: 3,
		titulo: 'Cachimbo Usado do Saci',
		preco: 72900.0,
		caminhoImagem: '/imagens/saci.jpg',
	},
	{
		id: 4,
		titulo: 'Ferradura da Mula Sem Cabeça',
		preco: 98000.0,
		caminhoImagem: '/imagens/mula.webp',
	},
	{
		id: 5,
		titulo: 'Amostra de Pelo Flamejante do Curupira',
		preco: 61500.0,
		caminhoImagem: '/imagens/curupira.webp',
	},

	{
		id: 6,
		titulo: 'Tentáculo de Kraken',
		preco: 450000.0,
		caminhoImagem: '/imagens/kraken.jpg',
	},
	{
		id: 7,
		titulo: 'Pena Fresca de Fênix Renascida',
		preco: 890000.0,
		caminhoImagem: '/imagens/fenix.jpg',
	},
	{
		id: 8,
		titulo: 'Chifre Certificado de Unicórnio',
		preco: 1250000.0,
		caminhoImagem: '/imagens/unicornio.jpg',
	},
	{
		id: 9,
		titulo: 'Garra Preservada do Chupacabra',
		preco: 38750.0,
		caminhoImagem: '/imagens/chupacabra.jpg',
	},
	{
		id: 10,
		titulo: 'Parafuso Original do Disco de McMinnville',
		preco: 325000.0,
		caminhoImagem: '/imagens/ovni.jpg',
	},
];

export default function Produtos() {
	const [termo, setTermo] = useState('');

	// filtra por titulo
	let lista = [];
	for (let i = 0; i < produtos.length; i++) {
		if (produtos[i].titulo.toLowerCase().includes(termo.toLowerCase())) {
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
