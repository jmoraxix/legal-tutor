-- Schema para Legal Tutor

-- Extensiones necesarias para Supabase Auth
create extension if not exists "uuid-ossp";

-- Tabla de perfiles de usuario (se conecta con auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Habilitar RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Políticas de seguridad para perfiles
create policy "Los usuarios pueden ver sus propios perfiles"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Los usuarios pueden actualizar sus propios perfiles"
  on public.profiles for update
  using (auth.uid() = id);

-- Función para manejar nuevos registros
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, '', '');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para insertar un perfil al crear un usuario
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabla de historial de conversaciones
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Habilitar RLS para conversaciones
alter table public.conversations enable row level security;

-- Políticas para conversaciones
create policy "Los usuarios pueden ver sus propias conversaciones"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden insertar sus propias conversaciones"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar sus propias conversaciones"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar sus propias conversaciones"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- Tabla de mensajes
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now() not null
);

-- Habilitar RLS para mensajes
alter table public.messages enable row level security;

-- Políticas para mensajes
create policy "Los usuarios pueden ver mensajes de sus conversaciones"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Los usuarios pueden insertar mensajes en sus conversaciones"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- Tabla de progreso de quiz
create table public.quiz_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id text not null, -- Identificador del quiz
  score integer not null default 0,
  completed boolean not null default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Habilitar RLS para progreso de quiz
alter table public.quiz_progress enable row level security;

-- Políticas para progreso de quiz
create policy "Los usuarios pueden ver su propio progreso"
  on public.quiz_progress for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden insertar su propio progreso"
  on public.quiz_progress for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar su propio progreso"
  on public.quiz_progress for update
  using (auth.uid() = user_id);
