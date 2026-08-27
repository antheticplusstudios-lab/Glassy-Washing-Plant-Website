CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_templates_admin_all" ON public.email_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER email_templates_touch
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.email_templates (name, subject, body, sort_order) VALUES
('Quote follow-up', 'Your Glassy Washing Plant quote', E'Hi {{name}},\n\nThanks for your {{service}} brief. Our costing team has reviewed it and we can move ahead this week.\n\nPlease confirm the quantity and fabric composition and we will lock the price and schedule.\n\nBest regards,\nGlassy Washing Plant', 1),
('Sample approval', 'Sample ready for your approval', E'Hi {{name}},\n\nYour {{service}} sample is ready. We have matched the shade and hand-feel to the reference you shared.\n\nLet us know if you would like it couriered or collected from the plant, and we will proceed to bulk once approved.\n\nBest regards,\nGlassy Washing Plant', 2),
('Delivery update', 'Production and delivery update', E'Hi {{name}},\n\nQuick update on your {{service}} order: the lot is on the floor and running to schedule.\n\nWe will share the finished-goods report before dispatch.\n\nBest regards,\nGlassy Washing Plant', 3);