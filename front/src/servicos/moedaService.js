function formatarMoeda(valor) {
	// formatar pra real
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export { formatarMoeda };
