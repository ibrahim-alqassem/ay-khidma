-- أي هلب: الإشعارات الفورية عبر OneSignal
-- كل إشعار يُضاف لجدول notifications يُرسل فوراً كإشعار للجوال/المتصفح لصاحبه.
-- مفتاح OneSignal السري يُحفظ مشفّراً في Vault باسم onesignal_rest_key (يضيفه صاحب الحساب بنفسه).

create extension if not exists pg_net with schema extensions;

create or replace function public.push_notification() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  k text;
  t_en text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'onesignal_rest_key' limit 1;
  if k is null then return new; end if;

  t_en := case new.kind
            when 'new' then 'New request'
            when 'accepted' then 'Your request was accepted'
            when 'done' then 'Your request was completed'
            when 'declined' then 'The provider declined your request'
            when 'cancelled' then 'The customer cancelled'
            else null end;
  t_en := coalesce(t_en || coalesce(' #' || new.request_id, ''), new.title);

  perform net.http_post(
    url := 'https://api.onesignal.com/notifications?c=push',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Key ' || k),
    body := jsonb_build_object(
      'app_id', 'd9816bc6-3a0b-422c-8871-d630e240fc2e',
      'target_channel', 'push',
      'include_aliases', jsonb_build_object('external_id', jsonb_build_array(new.user_id::text)),
      'headings', jsonb_build_object('en', t_en, 'ar', new.title),
      'contents', jsonb_build_object(
        'en', coalesce(new.body, 'Open Ay Help for details'),
        'ar', coalesce(new.body, 'افتح أي هلب للتفاصيل')),
      'url', 'https://ayhelpapp.com/'
    )
  );
  return new;
exception when others then
  return new;  -- فشل الإرسال لا يمنع حفظ الإشعار
end $$;

revoke all on function public.push_notification() from public, anon, authenticated;

drop trigger if exists on_notification_push on public.notifications;
create trigger on_notification_push after insert on public.notifications
  for each row execute function public.push_notification();
