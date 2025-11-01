import * as z from 'zod'

export const registerSchema = z.object({
  names: z.string({ error: 'El valor es requerido' }).min(3, { message: 'Nombre es requerido' }),
  document: z
    .string({ error: 'El valor es requerido' })
    .min(5, { message: 'Mínimo 5 caracteres' })
    .max(20),
  email: z.string({ error: 'El valor es requerido' }).email({ message: 'Email inválido' }),
  cellphone: z
    .string({ error: 'El valor es requerido' })
    .min(10, { message: 'Mínimo 10 caracteres' })
    .max(15),
})

export const credentialsSchema = z.object({
  document: z
    .string({ error: 'El valor es requerido' })
    .min(5, { message: 'Mínimo 5 caracteres' })
    .max(20),
  cellphone: z
    .string({ error: 'El valor es requerido' })
    .min(10, { message: 'Mínimo 10 caracteres' })
    .max(15),
})

export const rechargeSchema = z.object({
  rechargeValue: z.coerce
    .number({ error: 'El valor es requerido' })
    .positive({ message: 'Debe ser un valor positivo' })
    .min(1000, { message: 'Mínimo de recarga $1.000' }),
})

export const initiatePaymentSchema = z.object({
  document: z
    .string({ error: 'El valor es requerido' })
    .min(5, { message: 'Mínimo 5 caracteres' })
    .max(20),
  cellphone: z
    .string({ error: 'El valor es requerido' })
    .min(10, { message: 'Mínimo 10 caracteres' })
    .max(15),
  amount: z.coerce
    .number({ error: 'El valor es requerido' })
    .positive({ message: 'El monto debe ser positivo' }),
})

export const confirmPaymentSchema = z.object({
  token: z
    .string({ error: 'El valor es requerido' })
    .length(6, { message: 'El token debe tener 6 dígitos' }),
})
