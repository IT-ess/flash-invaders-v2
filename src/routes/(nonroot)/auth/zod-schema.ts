import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(8, 'Mot de passe inférieur à 8 caractères'),
	username: z.string().min(3, "Nom d'utilisateur inférieur à 3 caractères").optional()
});

export type FormSchema = typeof formSchema;
