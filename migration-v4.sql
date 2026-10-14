-- أي خدمة: تحديث الإصدار ٤ (ساعات العمل، السعر التقريبي، نوع الإشعار)
alter table public.profiles add column if not exists hours text;
alter table public.profiles add column if not exists price_note text;
alter table public.notifications add column if not exists kind text;

create or replace function public.notify_request() returns trigger
language plpgsql security definer set search_path = public as $$
declare st text;
begin
  if tg_op = 'INSERT' then
    insert into notifications (user_id, title, body, request_id, kind)
    values (new.provider_id, 'طلب جديد #' || new.id,
            coalesce(new.customer_name,'عميل') || ' — ' || coalesce(new.location,''), new.id, 'new');
  elsif new.status is distinct from old.status then
    new.updated_at := now();
    st := case new.status when 'accepted' then 'تم قبول طلبك'
                          when 'done' then 'تم تنفيذ طلبك'
                          when 'declined' then 'اعتذر مقدم الخدمة عن طلبك'
                          when 'cancelled' then 'ألغى العميل الطلب' else new.status end;
    insert into notifications (user_id, title, body, request_id, kind)
    values (case when new.status = 'cancelled' then new.provider_id else new.customer_id end,
            st || ' #' || new.id, null, new.id, new.status);
  end if;
  return new;
end $$;
