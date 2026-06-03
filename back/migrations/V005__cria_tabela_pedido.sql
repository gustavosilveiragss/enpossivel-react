create table pedido (
  id serial primary key,
  criado_em timestamptz default now(),
  id_conta integer not null references conta(id),
  cpf varchar(14) not null default '',
  status varchar(16) default 'incompleto' check (status in ('incompleto', 'finalizado')),
  metodo_pagamento varchar(16) check (metodo_pagamento in ('pix', 'debit', 'credit')),
  id_cartao integer,
  total numeric(10,2) not null
);
