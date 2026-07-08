'use client'

import { Form } from '@/src/db/schema'
import { formatDateShort } from '@/src/lib/utils'
import Link from 'next/link'
import { useState } from 'react'
import { EmptyState } from './EmptyState'

interface FormListProps {
  forms: Form[]
  onDelete?: (id: string) => Promise<void>
  isLoading?: boolean
}

export function FormList({ forms, onDelete, isLoading }: FormListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!onDelete) return
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      setDeleting(id)
      await onDelete(id)
    } finally {
      setDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
      </div>
    )
  }

  if (forms.length === 0) {
    return (
      <EmptyState
        title="아직 만든 폼이 없습니다"
        description="새 폼을 만들어서 응답을 수집해보세요"
        icon="📝"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {forms.map((form) => (
        <div
          key={form.id}
          className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate mb-2">
            {form.name}
          </h3>
          {form.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {form.description}
            </p>
          )}
          <div className="text-xs text-slate-500 dark:text-slate-500 mb-4">
            생성일: {form.createdAt ? formatDateShort(new Date(form.createdAt instanceof Date ? form.createdAt : new Date())) : '-'}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/forms/${form.id}/edit`}
              className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded font-medium transition-colors text-center"
            >
              편집
            </Link>
            <Link
              href={`/forms/${form.id}/responses`}
              className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 text-sm rounded font-medium transition-colors text-center"
            >
              응답
            </Link>
            {onDelete && (
              <button
                onClick={() => handleDelete(form.id)}
                disabled={deleting === form.id}
                className="px-3 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-200 text-sm rounded font-medium transition-colors disabled:opacity-50"
              >
                {deleting === form.id ? '삭제...' : '삭제'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
