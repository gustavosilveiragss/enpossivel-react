create table conta (
  id serial primary key,
  criado_em timestamptz default now(),
  nome varchar(255) not null,
  email varchar(255) unique not null,
  senha varchar(255) not null,
  papel varchar(16) default 'user' check (papel in ('user', 'admin'))
);
