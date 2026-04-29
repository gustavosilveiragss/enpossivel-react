import { useNavigate } from 'react-router-dom';
import Botao from '../componentes/Botao';

export default function NaoEncontrada() {
	const navegar = useNavigate();

	return (
		<div className="text-center py-20">
			<h1 className="text-5xl font-bold text-vermelho mb-3">404</h1>
			<p className="text-gray-700 mb-6">Essa página não existe.</p>
			<Botao aoClicar={() => navegar('/')}>Voltar pro início</Botao>
		</div>
	);
}
