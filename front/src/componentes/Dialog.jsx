import { useEffect } from 'react';

export default function Dialog(props) {
	let tipo = props.tipo || 'notificacao';

	// notificacao some sozinha
	useEffect(() => {
		if (tipo === 'notificacao' && props.aberto) {
			let t = setTimeout(props.aoFechar, 1000);
			return () => clearTimeout(t);
		}
	}, [props.aberto, tipo]);

	if (!props.aberto) {
		return null;
	}

	if (tipo === 'notificacao') {
		return (
			<div className="fixed bottom-5 left-5 z-50 bg-verde text-white px-5 py-3 rounded-2xl shadow-lg">
				{props.mensagem}
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-2xl p-5 w-80 border border-gray-300">
				<h3 className="text-lg font-bold mb-3">{props.titulo}</h3>
				<p className="text-gray-700 mb-5">{props.mensagem}</p>

				<div className="flex justify-end gap-2.5">
					<button
						onClick={props.aoCancelar}
						className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
					>
						Cancelar
					</button>
					<button
						onClick={props.aoConfirmar}
						className="px-4 py-2 rounded-full bg-perigo text-white hover:opacity-80"
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
}
