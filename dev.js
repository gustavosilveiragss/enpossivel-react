const { spawn } = require('child_process');
const path = require('path');

// sobe back e front juntos, com hot reload nos dois.
// quando um dos dois cair, mata o outro pra nao deixar processo solto.

const processos = [];

function iniciar(nome, pasta, comando, args) {
	const cwd = path.join(__dirname, pasta);
	const p = spawn(comando, args, { cwd: cwd, stdio: 'inherit', shell: true });
	processos.push(p);

	p.on('exit', function (codigo) {
		console.log('[' + nome + '] saiu com codigo ' + codigo);
		for (let i = 0; i < processos.length; i++) {
			if (processos[i] !== p) processos[i].kill();
		}
		process.exit(codigo || 0);
	});
}

iniciar('back', 'back', 'npm', ['run', 'dev']);
iniciar('front', 'front', 'npm', ['run', 'dev']);

// ctrl+c mata os dois
process.on('SIGINT', function () {
	for (let i = 0; i < processos.length; i++) {
		processos[i].kill('SIGINT');
	}
});
