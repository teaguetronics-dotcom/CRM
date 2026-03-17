-- Techy Teague CRM - Supabase Schema
-- Run this in the Supabase SQL editor to set up tables

create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  email text,
  source text check (source in ('website_form', 'manual', 'csv_import', 'twilio_inbound')) default 'manual',
  status text check (status in ('new', 'contacted', 'offer_made', 'closed', 'dead')) default 'new',
  device_interest text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts(id) on delete cascade,
  direction text check (direction in ('inbound', 'outbound')) not null,
  body text not null,
  sent_at timestamptz default now()
);

create table if not exists follow_ups (
  id uuid default gen_random_uuid() primary key,
  contact_id uuid references contacts(id) on delete cascade,
  due_date date not null,
  note text,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists automations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  trigger text not null,
  conditions jsonb default '[]'::jsonb,
  actions jsonb default '[]'::jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_contacts_status on contacts(status);
create index if not exists idx_contacts_source on contacts(source);
create index if not exists idx_messages_contact on messages(contact_id);
create index if not exists idx_follow_ups_due on follow_ups(due_date);
create index if not exists idx_follow_ups_contact on follow_ups(contact_id);
