import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout';
import Produtos from './paginas/Produtos';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import Carrinho from './paginas/Carrinho';
import NaoEncontrada from './paginas/NaoEncontrada';

export default function Rotas() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Produtos />} />
				<Route path="/login" element={<Login />} />
				<Route path="/cadastro" element={<Cadastro />} />
				<Route path="/carrinho" element={<Carrinho />} />
				<Route path="*" element={<NaoEncontrada />} />
			</Route>
		</Routes>
	);
}
