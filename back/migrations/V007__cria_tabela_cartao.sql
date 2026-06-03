create table cartao (
  id serial primary key,
  criado_em timestamptz default now(),
  id_conta integer not null references conta(id),
  nome_dono varchar(255) not null,
  numero varchar(19) not null,
  data_validade date not null,
  cvv varchar(3) not null
);

alter table pedido add constraint pedido_id_cartao_fkey foreign key (id_cartao) references cartao(id);
