import { z } from 'zod'

/**
 * Schemas de validação dos forms de autenticação (DEBT-FE-7).
 * Centralizado para reuso em LoginForm, SignupForm, RecoverForm e
 * Lead Magnet (MKT-001-1).
 */

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe seu email.')
  .email('Email inválido. Verifique o formato (ex: voce@dominio.com).')

const passwordSchema = z
  .string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres.')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha.'),
})

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })

export const recoverSchema = z.object({
  email: emailSchema,
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type RecoverInput = z.infer<typeof recoverSchema>

/**
 * Pega a 1ª mensagem de erro por campo a partir de um ZodError.
 */
export function fieldErrors<T extends z.ZodType>(
  result: z.SafeParseReturnType<unknown, z.infer<T>>,
): Record<string, string> {
  if (result.success) return {}
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() ?? '_'
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}
