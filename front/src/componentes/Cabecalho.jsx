import { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuLateral from './MenuLateral';

export default function Cabecalho() {
	const [menuAberto, setMenuAberto] = useState(false);

	return (
		<header className="flex justify-between items-center p-2.5 border-b-2 border-vermelho bg-white">
			<Link to="/">
				<img src="/logo.png" alt="Logo" className="h-12 w-auto mr-5" />
			</Link>

			<button
				onClick={() => setMenuAberto(true)}
				className="text-3xl text-perigo ml-auto"
				aria-label="Abrir menu"
			>
				☰
			</button>

			<MenuLateral aberto={menuAberto} aoFechar={() => setMenuAberto(false)} />
		</header>
	);
}
