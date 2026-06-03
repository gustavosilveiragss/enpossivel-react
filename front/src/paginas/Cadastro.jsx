import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import { usarUsuario } from '../contextos/ContextoUsuario';
import { usarAviso } from '../contextos/ContextoAviso';
import * as apiContas from '../servicos/apiContas';

export default function Cadastro() {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [confirma, setConfirma] = useState('');
	const [enviando, setEnviando] = useState(false);

	const usuario = usarUsuario();
	const aviso = usarAviso();
	const navigate = useNavigate();

	async function registrar(e) {
		e.preventDefault();

		if (!nome || !email || !senha) {
			aviso.mostrarErro('Preencha todos os campos');
			return;
		}
		if (senha !== confirma) {
			aviso.mostrarErro('Senhas nao coincidem');
			return;
		}

		setEnviando(true);
		try {
			const r = await apiContas.cadastrar(nome, email, senha);
			usuario.logar(r);
			navigate('/');
		} catch (erro) {
			aviso.mostrarErro(erro.message);
		} finally {
			setEnviando(false);
		}
	}

	return (
		<div className="p-4 sm:p-5 flex justify-center">
			<div className="w-full max-w-md px-4 sm:px-5 py-4 border border-gray-300 rounded-2xl">
				<h2 className="text-center text-2xl font-bold">Registrar Conta</h2>

				<form onSubmit={registrar} className="p-2.5">
					<Campo label="Nome:" valor={nome} aoMudar={setNome} obrigatorio />
					<Campo label="Email:" valor={email} aoMudar={setEmail} tipo="email" obrigatorio />
					<Campo label="Senha:" valor={senha} aoMudar={setSenha} tipo="password" obrigatorio />
					<Campo
						label="Confirmar Senha:"
						valor={confirma}
						aoMudar={setConfirma}
						tipo="password"
						obrigatorio
					/>

					<div className="flex justify-center">
						<Botao tipo="submit" variante="verde" desabilitado={enviando}>
							Registrar
						</Botao>
					</div>
				</form>

				<p className="text-sm text-gray-600 mt-4 text-center">
					Já tem conta?{' '}
					<Link to="/login" className="text-vermelho font-bold">
						Entrar
					</Link>
				</p>
			</div>
		</div>
	);
}
