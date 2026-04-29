import { Outlet } from 'react-router-dom';
import Cabecalho from './Cabecalho';

export default function Layout() {
	return (
		<div className="min-h-screen">
			<Cabecalho />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
