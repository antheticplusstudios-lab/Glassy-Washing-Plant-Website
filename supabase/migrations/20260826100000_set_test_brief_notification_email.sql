-- Temporary testing configuration: send new brief notifications to AntheticPlus Studios.
-- Change notifyEmail back to the client's email before production.
update public.site_content
set value = jsonb_set(value, '{notifyEmail}', '"antheticplusstudios@gmail.com"'::jsonb, true),
    updated_at = now()
where key = 'site.contact';
