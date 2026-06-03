-- admin tem senha em texto puro
-- cliente tem hash bcrypt gerado offline com bcryptjs (senha = 'cliente')
insert into conta (nome, email, senha, papel) values
	('Administrador', 'admin@admin.com', 'admin', 'admin'),
	('Cliente', 'cliente@cliente.com', '$2a$10$9Cvd5UdpmMjZsvnG8L0jg.wUdvxFCAtBTOtbyX9fEbpXksWF4EU2u', 'user');

insert into carrinho (id_conta) values (1), (2);

-- caminhos /imagens/... apontam pra front/public/imagens (servido pelo vite)
insert into produto (titulo, preco, caminho_imagem, estoque) values
	('Pegada Original do Pé Grande em Gesso', 45000.00, '/imagens/pe_grande.jpg', 3),
	('Foto Autêntica do Monstro de Loch Ness', 128500.00, '/imagens/nessie.jpg', 5),
	('Cachimbo Usado do Saci', 72900.00, '/imagens/saci.jpg', 1),
	('Ferradura da Mula Sem Cabeça', 98000.00, '/imagens/mula.webp', 4),
	('Amostra de Pelo Flamejante do Curupira', 61500.00, '/imagens/curupira.webp', 60),
	('Tentáculo de Kraken', 450000.00, '/imagens/kraken.jpg', 8),
	('Pena Fresca de Fênix Renascida', 890000.00, '/imagens/fenix.jpg', 150),
	('Chifre Certificado de Unicórnio', 1250000.00, '/imagens/unicornio.jpg', 2),
	('Garra Preservada do Chupacabra', 38750.00, '/imagens/chupacabra.jpg', 10),
	('Parafuso Original do Disco de McMinnville', 325000.00, '/imagens/ovni.jpg', 9);
