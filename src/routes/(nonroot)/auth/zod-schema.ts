import { z } from 'zod';

export const formSchema = z.object({
	username: z.string().min(3, "Nom d'utilisateur inférieur à 3 caractères")
});

export type FormSchema = typeof formSchema;
