create or replace function delete_user()
returns void
language sql
security definer
as $$
  delete from auth.users where id = auth.uid();
$$;

-- Enable the function for authenticated users
grant execute on function delete_user() to authenticated;
