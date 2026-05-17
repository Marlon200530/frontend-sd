import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A palavra-passe deve ter pelo menos 8 caracteres.")
  .max(72, "A palavra-passe deve ter no máximo 72 caracteres.")
  .regex(/[A-Z]/, "Inclui pelo menos uma letra maiúscula.")
  .regex(/[0-9]/, "Inclui pelo menos um número.");

export const loginSchema = z.object({
  email: z.string().trim().email("Insere um email válido."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Indica o nome completo.").max(160),
    contact: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s().-]+$/, "Contacto inválido.")
      .optional()
      .or(z.literal("")),
    email: z.string().trim().email("Insere um email válido."),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "As palavras-passe não coincidem.",
  });

export const resourceFormSchema = z.object({
  title: z.string().trim().min(4, "O título deve ter pelo menos 4 caracteres.").max(180),
  description: z.string().trim().min(15, "A descrição deve ter pelo menos 15 caracteres."),
  categoryId: z.string().uuid("Escolhe uma categoria."),
  condition: z.enum(["new", "like_new", "very_good", "good", "acceptable"]),
  location: z.string().trim().min(2, "Indica o local de entrega.").max(180),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres.").max(160),
  contact: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]+$/, "Contacto inválido.")
    .optional()
    .or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Indica a palavra-passe actual."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As palavras-passe não coincidem.",
  });

export const categoryFormSchema = z.object({
  name: z.string().trim().min(3, "A categoria deve ter no mínimo 3 caracteres.").max(80),
  description: z.string().trim().max(100, "A descrição deve ter no máximo 100 caracteres.").optional(),
  isActive: z.boolean(),
});

export const loanRequestSchema = z.object({
  dueDate: z
    .string()
    .min(1, "Escolhe uma data de devolução.")
    .refine((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const selected = new Date(value);
      selected.setHours(0, 0, 0, 0);
      return selected >= tomorrow;
    }, "A data deve ser amanhã ou depois."),
});

export function zodErrors(error: z.ZodError) {
  return Object.fromEntries(
    error.issues.map((issue) => [String(issue.path[0]), issue.message]),
  );
}
