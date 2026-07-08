import { z } from 'zod'

export const createFormSchema = z.object({
  name: z.string().min(1, '폼 이름을 입력해주세요').max(200),
  description: z.string().max(1000).optional(),
})

export const updateFormSchema = z.object({
  name: z.string().min(1, '폼 이름을 입력해주세요').max(200).optional(),
  description: z.string().max(1000).optional(),
  fields: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['text', 'textarea', 'radio', 'checkbox', 'select', 'rating']),
      label: z.string().min(1),
      placeholder: z.string().optional(),
      required: z.boolean().optional(),
      options: z.array(z.string()).optional(),
      defaultValue: z.union([z.string(), z.array(z.string()), z.number()]).optional(),
    })
  ).optional(),
  isPublished: z.boolean().optional(),
})

export const submitResponseSchema = z.object({
  data: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.number()]).optional()),
})

export type CreateFormInput = z.infer<typeof createFormSchema>
export type UpdateFormInput = z.infer<typeof updateFormSchema>
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>
