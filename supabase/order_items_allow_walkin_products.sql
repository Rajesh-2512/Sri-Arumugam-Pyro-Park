alter table public.order_items
  alter column product_id drop not null;

create or replace function public.decrement_product_stock(p_items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  product_id uuid;
  quantity integer;
  updated_rows integer;
begin
  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Product stock adjustments must be provided as an array.';
  end if;

  for item in select value from jsonb_array_elements(p_items) as items(value)
  loop
    product_id := (item->>'product_id')::uuid;
    quantity := (item->>'quantity')::integer;

    if quantity < 1 then
      raise exception 'Product quantities must be positive.';
    end if;

    update public.products
    set stock = stock - quantity
    where id = product_id and stock >= quantity;

    get diagnostics updated_rows = row_count;
    if updated_rows = 0 then
      raise exception 'Insufficient stock for product %.', product_id;
    end if;
  end loop;
end;
$$;

revoke all on function public.decrement_product_stock(jsonb) from public, anon, authenticated;
grant execute on function public.decrement_product_stock(jsonb) to service_role;