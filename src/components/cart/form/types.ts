import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne doit contenir que des lettres"),
  lastName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne doit contenir que des lettres"),
  phone: z.string()
    .min(10, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s()-]+$/, "Format de numéro invalide"),
  email: z.string()
    .email("Format d'email invalide")
    .min(5, "Email invalide"),
  address: z.string()
    .min(5, "L'adresse doit contenir au moins 5 caractères"),
  country: z.string()
    .min(2, "Le pays doit contenir au moins 2 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le pays ne doit contenir que des lettres"),
  zipCode: z.string()
    .min(5, "Code postal invalide")
    .regex(/^[0-9]+$/, "Le code postal ne doit contenir que des chiffres"),
});

export type UserFormData = z.infer<typeof userFormSchema>;