import * as v from "valibot";

export const passwordSchema = v.pipe(
  v.string(),
  v.minLength(8, "A senha deve ter pelo menos 8 caracteres."),
  v.maxLength(128, "A senha deve ter no máximo 128 caracteres."),
  v.regex(/[A-Z]/, "Inclua pelo menos uma letra maiúscula."),
  v.regex(/[a-z]/, "Inclua pelo menos uma letra minúscula."),
  v.regex(/[0-9]/, "Inclua pelo menos um número."),
  v.regex(/[^A-Za-z0-9]/, "Inclua pelo menos um caractere especial."),
);

export const passwordRequirements =
  "Use de 8 a 128 caracteres, com maiúscula, minúscula, número e símbolo.";
