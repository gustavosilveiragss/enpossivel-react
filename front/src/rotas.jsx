import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout';
import RotaProtegida from './componentes/RotaProtegida';
import Produtos from './paginas/Produtos';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import Carrinho from './paginas/Carrinho';
import Checkout from './paginas/Checkout';
import CadastroProdutos from './paginas/CadastroProdutos.jsx';
import NaoEncontrada from './paginas/NaoEncontrada';

export default function Rotas() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Produtos />} />
				<Route path="/login" element={<Login />} />
				<Route path="/cadastro" element={<Cadastro />} />

				<Route
					path="/carrinho"
					element={
						<RotaProtegida>
							<Carrinho />
						</RotaProtegida>
					}
				/>

				<Route
					path="/checkout"
					element={
						<RotaProtegida>
							<Checkout />
						</RotaProtegida>
					}
				/>

				<Route
					path="/cadastro-produtos"
					element={
						<RotaProtegida apenasAdmin>
							<CadastroProdutos />
						</RotaProtegida>
					}
				/>

				<Route path="*" element={<NaoEncontrada />} />
			</Route>
		</Routes>
	);
}
