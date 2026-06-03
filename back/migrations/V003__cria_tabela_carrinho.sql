create table carrinho (
  id serial primary key,
  criado_em timestamptz default now(),
  id_conta integer not null unique references conta(id)
);
