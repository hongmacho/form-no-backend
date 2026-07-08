import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const forms = sqliteTable('forms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  publicId: text('public_id').notNull().unique(),
  fields: text('fields', { mode: 'json' }).notNull().$defaultFn(() => []),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const responses = sqliteTable('responses', {
  id: text('id').primaryKey(),
  formId: text('form_id').notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type Form = typeof forms.$inferSelect
export type NewForm = typeof forms.$inferInsert
export type Response = typeof responses.$inferSelect
export type NewResponse = typeof responses.$inferInsert

// Field types
export type FieldType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'rating'

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: string[] // for radio, checkbox, select
  defaultValue?: string | string[] | number
}
