'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Form, FormField } from '@/src/db/schema'
import { EmptyState } from '@/app/components/EmptyState'

export default function PublicFormPage() {
  const params = useParams()
  const publicId = params.publicId as string

  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const loadForm = async () => {
    try {
      setIsLoading(true)
      // Find form by publicId
      const response = await fetch('/api/forms')
      const result = await response.json()

      if (result.success) {
        const foundForm = result.data.find((f: Form) => f.publicId === publicId)
        if (foundForm && foundForm.isPublished) {
          setForm(foundForm)
        } else {
          setError('이용할 수 없는 폼입니다')
        }
      } else {
        setError('폼을 찾을 수 없습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadForm()
  }, [publicId])

  const handleInputChange = (fieldId: string, value: string | string[] | number) => {
    setResponses({
      ...responses,
      [fieldId]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) return

    try {
      setIsSubmitting(true)
      setError(null)

      // Validate required fields
      const fields = (form.fields || []) as FormField[]
      for (const field of fields) {
        if (field.required && !responses[field.id]) {
          setError(`"${field.label}" 필드는 필수입니다`)
          return
        }
      }

      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form.id,
          data: responses,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSubmitted(true)
        setResponses({})
      } else {
        setError(result.error || '응답 제출에 실패했습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EmptyState
          title="폼을 찾을 수 없습니다"
          description={error || '요청한 폼이 존재하지 않습니다'}
        />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            응답이 제출되었습니다
          </h1>
          <p className="text-slate-600 dark:text-slate-400">감사합니다!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {form.name}
        </h1>
        {form.description && (
          <p className="text-slate-600 dark:text-slate-400 mb-6">{form.description}</p>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {((form.fields as unknown) as FormField[]).map((field) => (
            <FormFieldComponent
              key={field.id}
              field={field}
              value={responses[field.id] || (field.type === 'checkbox' ? [] : '')}
              onChange={(value) => handleInputChange(field.id, value)}
            />
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? '응답 제출 중...' : '응답 제출'}
          </button>
        </form>
      </div>
    </div>
  )
}

interface FormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void
}

function FormFieldComponent({ field, value, onChange }: FormFieldProps) {
  const baseClasses = 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50'

  const label = (
    <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </label>
  )

  switch (field.type) {
    case 'text':
      return (
        <div>
          {label}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        </div>
      )

    case 'textarea':
      return (
        <div>
          {label}
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${baseClasses} h-24`}
          />
        </div>
      )

    case 'radio':
      return (
        <div>
          {label}
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-slate-900 dark:text-slate-50">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )

    case 'checkbox':
      return (
        <div>
          {label}
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : []
                    if (e.target.checked) {
                      newValue.push(option)
                    } else {
                      const index = newValue.indexOf(option)
                      if (index > -1) newValue.splice(index, 1)
                    }
                    onChange(newValue)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-slate-900 dark:text-slate-50">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )

    case 'select':
      return (
        <div>
          {label}
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          >
            <option value="">선택해주세요</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )

    case 'rating':
      return (
        <div>
          {label}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                className={`text-2xl transition-opacity ${
                  value === rating ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}
