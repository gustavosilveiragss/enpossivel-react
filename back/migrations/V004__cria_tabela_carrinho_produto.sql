create table carrinho_produto (
  id serial primary key,
  criado_em timestamptz default now(),
  id_carrinho integer not null references carrinho(id),
  id_produto integer not null references produto(id)
);
