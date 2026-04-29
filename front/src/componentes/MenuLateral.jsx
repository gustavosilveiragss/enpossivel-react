import { Link } from 'react-router-dom';

export default function MenuLateral(props) {
	// fechado por padrao
	let posicao = 'translate-x-full';
	if (props.aberto) {
		posicao = 'translate-x-0';
	}


	return (
		<>
			{props.aberto && <div onClick={props.aoFechar} className="fixed inset-0 z-30" />}

			<aside
				className={
					'fixed top-0 right-0 h-full w-1/2 md:w-72 bg-white/40 backdrop-blur-sm border-l border-gray-300 z-40 transition-transform duration-300 ' +
					posicao
				}
			>
				<ul>
					<li className="p-2.5 border-b border-gray-300">
						<Link to="/" onClick={props.aoFechar} className="text-gray-800 hover:text-perigo">
							Produtos
						</Link>
					</li>

					<li className="p-2.5 border-b border-gray-300">
						<Link to="/carrinho" onClick={props.aoFechar} className="text-gray-800 hover:text-perigo">
							Caldeirão
						</Link>
					</li>

					<li className="p-2.5">
						<Link
							to="/login"
							onClick={props.aoFechar}
							className="block text-center bg-vermelho text-white px-4 py-2 rounded hover:bg-perigo"
						>
							Autenticar Conta
						</Link>
					</li>

					<li className="p-2.5">
						<Link
							to="/cadastro"
							onClick={props.aoFechar}
							className="block text-center bg-vermelho text-white px-4 py-2 rounded hover:bg-perigo"
						>
							Registrar Conta
						</Link>
					</li>
				</ul>
			</aside>
		</>
	);
}
