export default function Campo(props) {

	let alinhamento = props.centralizado ? ' text-center' : '';
	let margem = props.semMargem ? '' : 'mb-5';

	return (
		<div className={margem}>
			{/* se tiver label mostra */}
			{props.label && <label className="block mb-1 font-bold">{props.label}</label>}

			<input
				type={props.tipo || 'text'}
				value={props.valor}
				onChange={(e) => props.aoMudar(e.target.value)}
				placeholder={props.placeholder}
				required={props.obrigatorio}
				className={'w-full border border-gray-300 rounded px-2.5 py-2.5 focus:outline-none focus:border-perigo' + alinhamento}
			/>

			{props.erro && <span className="block text-perigo text-sm mt-1">{props.erro}</span>}
		</div>
	);
}
