create table produto (
  id serial primary key,
  criado_em timestamptz default now(),
  titulo varchar(255) not null,
  preco numeric(10,2) not null check (preco >= 0),
  caminho_imagem varchar(255),
  estoque integer not null default 1 check (estoque >= 0),
  ativo boolean not null default true
);
