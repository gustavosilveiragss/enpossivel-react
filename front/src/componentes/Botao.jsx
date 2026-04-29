export default function Botao(props) {
	const base = 'text-white px-2.5 py-2.5 text-lg disabled:opacity-50 hover:opacity-80';
	let classe = '';

	// variantes de botao ja estilizadas
	switch (props.variante) {
		case 'verde':
			classe = base + ' bg-verde rounded-full';
			break;
		case 'verdeCheio':
			classe = base + ' bg-verde rounded-full w-full mb-2.5';
			break;
		case 'vermelhoCheio':
			classe = base + ' bg-vermelho rounded-full w-full text-center';
			break;
		case 'perigo':
			classe = base + ' bg-perigo rounded-lg px-2 py-1';
			break;
		default:
			classe = base + ' bg-vermelho rounded-full';
			break;
	}
	

	return (
		<button
			type={props.tipo || 'button'}
			onClick={props.aoClicar}
			disabled={props.desabilitado}
			className={classe}
		>
			{props.children}
		</button>
	);
}
