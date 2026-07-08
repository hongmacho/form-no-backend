'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Form, FormField } from '@/src/db/schema'
import { generateId } from '@/src/lib/utils'

const FIELD_TYPES = [
  { value: 'text', label: '단답' },
  { value: 'textarea', label: '장문' },
  { value: 'radio', label: '객관식' },
  { value: 'checkbox', label: '체크박스' },
  { value: 'select', label: '드롭다운' },
  { value: 'rating', label: '평점' },
]

export default function FormEditPage() {
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<Form | null>(null)
  const [fields, setFields] = useState<FormField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)

  useEffect(() => {
    loadForm()
  }, [formId])

  const loadForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      const result = await response.json()

      if (result.success) {
        setForm(result.data)
        setFields(result.data.fields || [])
      } else {
        setError(result.error || '폼을 불러올 수 없습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddField = (type: string) => {
    const newField: FormField = {
      id: generateId(),
      type: type as any,
      label: '새 필드',
      placeholder: '',
      required: false,
      options: ['옵션 1'],
    }
    setFields([...fields, newField])
    setEditingFieldId(newField.id)
  }

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
    if (editingFieldId === id) setEditingFieldId(null)
  }

  const handleMoveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex((f) => f.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return
    }

    const newFields = [...fields]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]]
    setFields(newFields)
  }

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      )
    )
  }

  const handleSave = async () => {
    if (!form) return

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields,
        }),
      })

      const result = await response.json()
      if (!result.success) {
        setError(result.error || '저장에 실패했습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">폼을 찾을 수 없습니다</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            >
              ←
            </Link>
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 text-red-600 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Field List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-50 block mb-2">
                필드 추가
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddField(e.target.value)
                    e.target.value = ''
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
              >
                <option value="">필드 유형 선택</option>
                {FIELD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    editingFieldId === field.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  onClick={() => setEditingFieldId(field.id)}
                >
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                    {field.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Field Editor */}
        <div className="lg:col-span-3">
          {editingFieldId ? (
            <FieldEditor
              field={fields.find((f) => f.id === editingFieldId)!}
              onUpdate={(updates) => handleUpdateField(editingFieldId, updates)}
              onRemove={() => handleRemoveField(editingFieldId)}
              onMoveUp={() => handleMoveField(editingFieldId, 'up')}
              onMoveDown={() => handleMoveField(editingFieldId, 'down')}
              fieldTypes={FIELD_TYPES}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                편집할 필드를 선택해주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface FieldEditorProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  fieldTypes: { value: string; label: string }[]
}

function FieldEditor({
  field,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  fieldTypes,
}: FieldEditorProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          필드 이름
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          필드 유형
        </label>
        <select
          value={field.type}
          onChange={(e) => onUpdate({ type: e.target.value as any })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
        >
          {fieldTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {['text', 'textarea'].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
            플레이스홀더
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
            placeholder="예: 답변을 입력해주세요"
          />
        </div>
      )}

      {['radio', 'checkbox', 'select'].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
            옵션
          </label>
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])]
                    newOptions[index] = e.target.value
                    onUpdate({ options: newOptions })
                  }}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
                />
                <button
                  onClick={() => {
                    const newOptions = field.options?.filter((_, i) => i !== index) || []
                    onUpdate({ options: newOptions })
                  }}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(field.options || []), '새 옵션']
                onUpdate({ options: newOptions })
              }}
              className="w-full px-3 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              + 옵션 추가
            </button>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.required || false}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium text-slate-900 dark:text-slate-50">필수</span>
      </label>

      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onMoveUp}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg text-sm"
        >
          위로
        </button>
        <button
          onClick={onMoveDown}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg text-sm"
        >
          아래로
        </button>
        <button
          onClick={onRemove}
          className="ml-auto px-3 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg font-medium"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
