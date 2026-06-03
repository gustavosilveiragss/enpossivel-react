create table pedido_produto (
  id serial primary key,
  criado_em timestamptz default now(),
  id_pedido integer not null references pedido(id),
  id_produto integer not null references produto(id)
);
