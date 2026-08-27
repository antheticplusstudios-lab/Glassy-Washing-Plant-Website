import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Wash development",
  "Bulk production",
  "Dry process & handwork",
  "Something else",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

/**
 * Validated on blur and on submit (see the `mode`/`reValidateMode` options
 * passed to `useForm` in `src/routes/contact.tsx`). Reused server-side by
 * the `submitContactBrief` server function so a request that bypasses the
 * client is still checked before it reaches Supabase.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "Keep the name under 120 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address.")
    .email("Enter a valid email address."),
  brand: z
    .string()
    .trim()
    .max(120, "Keep this under 120 characters.")
    .optional()
    .or(z.literal("")),
  service: z.enum(SERVICE_OPTIONS, {
    errorMap: () => ({ message: "Select what you need." }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(1000, "Keep the brief under 1000 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
