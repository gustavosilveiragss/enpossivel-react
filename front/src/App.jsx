import { BrowserRouter } from 'react-router-dom';
import Rotas from './rotas';
import { ProvedorUsuario } from './contextos/ContextoUsuario';
import { ProvedorAviso } from './contextos/ContextoAviso';

export default function App() {
	return (
		<ProvedorAviso>
			<ProvedorUsuario>
				<BrowserRouter>
					<Rotas />
				</BrowserRouter>
			</ProvedorUsuario>
		</ProvedorAviso>
	);
}
