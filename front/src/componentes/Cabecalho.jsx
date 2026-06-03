import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuLateral from './MenuLateral';
import { usarUsuario } from '../contextos/ContextoUsuario';

export default function Cabecalho() {
	const [menuAberto, setMenuAberto] = useState(false);
	const usuario = usarUsuario();
	const navigate = useNavigate();

	async function sair() {
		await usuario.deslogar();
		navigate('/');
	}

	return (
		<header className="flex justify-between items-center p-2.5 border-b-2 border-vermelho bg-white">
			<Link to="/">
				<img src="/logo.png" alt="Logo" className="h-12 w-auto mr-5" />
			</Link>

			<nav className="hidden md:flex items-center gap-6 ml-auto">
				<Link to="/" className="text-gray-800 hover:text-perigo">
					Produtos
				</Link>

				{usuario.logado && (
					<Link to="/carrinho" className="text-gray-800 hover:text-perigo">
						Caldeirão
					</Link>
				)}

				{usuario.souAdmin && (
					<Link to="/cadastro-produtos" className="text-gray-800 hover:text-perigo">
						Registrar Produto
					</Link>
				)}

				{usuario.logado ? (
					<button
						onClick={sair}
						className="bg-vermelho text-white px-4 py-2 rounded hover:bg-perigo"
					>
						Sair
					</button>
				) : (
					<Link
						to="/login"
						className="bg-vermelho text-white px-4 py-2 rounded hover:bg-perigo"
					>
						Autenticar Conta
					</Link>
				)}
			</nav>

			<button
				onClick={() => setMenuAberto(true)}
				className="md:hidden text-3xl text-perigo ml-auto"
				aria-label="Abrir menu"
			>
				☰
			</button>

			<MenuLateral aberto={menuAberto} aoFechar={() => setMenuAberto(false)} aoSair={sair} />
		</header>
	);
}
