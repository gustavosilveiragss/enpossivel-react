const Fastify = require('fastify');
const path = require('path');

const rotaContas = require('./rotas/contas');
const rotaProdutos = require('./rotas/produtos');
const rotaCarrinho = require('./rotas/carrinho');
const rotaPedidos = require('./rotas/pedidos');

const app = Fastify({ logger: true });

app.register(require('@fastify/cookie'));

app.register(require('@fastify/cors'), {
	origin: true,
	credentials: true,
});

app.register(require('@fastify/jwt'), {
	secret: process.env.JWT_SEGREDO,
	cookie: { cookieName: 'token', signed: false },
});

app.register(require('@fastify/multipart'), { limits: { fileSize: 5 * 1024 * 1024 } });
app.register(require('@fastify/static'), {
	root: path.join(__dirname, 'uploads'),
	prefix: '/uploads/',
});

app.register(rotaContas);
app.register(rotaProdutos);
app.register(rotaCarrinho);
app.register(rotaPedidos);

const porta = process.env.PORTA || 3000;

app.listen({ port: porta, host: '0.0.0.0' }, function (erro) {
	if (erro) {
		app.log.error(erro);
		process.exit(1);
	}
});
