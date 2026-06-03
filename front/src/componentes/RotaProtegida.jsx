import { Navigate } from 'react-router-dom';
import { usarUsuario } from '../contextos/ContextoUsuario';

export default function RotaProtegida(props) {
	const usuario = usarUsuario();

	// enquanto o boot ainda nao respondeu o GET /me, nao redireciona
	if (usuario.carregando) return null;

	if (!usuario.logado) return <Navigate to="/login" replace />;

	if (props.apenasAdmin && usuario.papel !== 'admin') {
		return <Navigate to="/" replace />;
	}

	return props.children;
}
