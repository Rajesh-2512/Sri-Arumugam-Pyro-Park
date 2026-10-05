create or replace function public.decrement_order_inventory(
  p_product_items jsonb,
  p_gift_box_items jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  inventory_id uuid;
  quantity integer;
  updated_rows integer;
begin
  if jsonb_typeof(p_product_items) is distinct from 'array'
    or jsonb_typeof(p_gift_box_items) is distinct from 'array' then
    raise exception 'Order inventory adjustments must be provided as arrays.';
  end if;

  for item in select value from jsonb_array_elements(p_product_items) as items(value)
  loop
    inventory_id := (item->>'product_id')::uuid;
    quantity := (item->>'quantity')::integer;

    if quantity < 1 then
      raise exception 'Product quantities must be positive.';
    end if;

    update public.products
    set stock = stock - quantity
    where id = inventory_id and stock >= quantity;

    get diagnostics updated_rows = row_count;
    if updated_rows = 0 then
      raise exception 'Insufficient stock for product %.', inventory_id;
    end if;
  end loop;

  for item in select value from jsonb_array_elements(p_gift_box_items) as items(value)
  loop
    inventory_id := (item->>'gift_box_id')::uuid;
    quantity := (item->>'quantity')::integer;

    if quantity < 1 then
      raise exception 'Combo box quantities must be positive.';
    end if;

    update public.gift_boxes
    set stock = stock - quantity
    where id = inventory_id and stock >= quantity;

    get diagnostics updated_rows = row_count;
    if updated_rows = 0 then
      raise exception 'Insufficient stock for combo box %.', inventory_id;
    end if;
  end loop;
end;
$$;

revoke all on function public.decrement_order_inventory(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.decrement_order_inventory(jsonb, jsonb) to service_role;