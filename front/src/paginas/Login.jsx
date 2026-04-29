import { useState } from 'react';
import { Link } from 'react-router-dom';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';

export default function Login() {
	const [email, setEmail] = useState('');

	const [senha, setSenha] = useState('');

	return (
		<div className="p-5 flex justify-center">
			<div className="w-4/5 md:w-1/3 px-5 py-2.5 mb-5 border border-gray-300 rounded-2xl">
				<h2 className="text-center text-2xl font-bold">Autenticar Conta</h2>

				<form onSubmit={(e) => e.preventDefault()} className="p-2.5">
					<Campo label="Email:" valor={email} aoMudar={setEmail} tipo="email" obrigatorio />
					<Campo label="Senha:" valor={senha} aoMudar={setSenha} tipo="password" obrigatorio />

					<div className="flex justify-center">
						<Botao tipo="submit" variante="verde">
							Autenticar Conta
						</Botao>
					</div>
				</form>

				<p className="text-sm text-gray-600 mt-4 text-center">
					Não tem conta?{' '}
					<Link to="/cadastro" className="text-vermelho font-bold">
						Registrar
					</Link>
				</p>
			</div>
		</div>
	);
}
