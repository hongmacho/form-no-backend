'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Form } from '@/src/db/schema'
import { EmptyState } from '@/app/components/EmptyState'

export default function SettingsPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [form, setForm] = useState<Form | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadForm()
  }, [formId])

  const loadForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      const result = await response.json()

      if (result.success) {
        setForm(result.data)
        setName(result.data.name)
        setDescription(result.data.description || '')
        setIsPublished(result.data.isPublished)
      } else {
        setError(result.error || '폼을 찾을 수 없습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(false)

      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          isPublished,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      } else {
        setError(result.error || '저장에 실패했습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  const copyPublicLink = () => {
    if (!form) return
    const link = `${window.location.origin}/f/${form.publicId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <EmptyState title="폼을 찾을 수 없습니다" />
      </div>
    )
  }

  const publicLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/f/${form.publicId}`

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/forms/${formId}/edit`}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            >
              ←
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              폼 설정
            </h1>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 text-red-600 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-3 text-green-600 dark:text-green-200">
          저장되었습니다
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              폼 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              폼 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 h-24"
            />
          </div>

          {/* Public Link */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              공개 링크
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicLink}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-50"
              />
              <button
                onClick={copyPublicLink}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors"
              >
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>

          {/* Publish Status */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                폼 공개 중
              </span>
            </label>
            {!isPublished && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                비공개 폼은 공개 링크로 응답할 수 없습니다
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => router.push(`/forms/${formId}/edit`)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors"
            >
              취소
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            위험 영역
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            폼을 삭제하면 모든 응답도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <button
            onClick={() => {
              if (confirm('정말 폼을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                fetch(`/api/forms/${formId}`, { method: 'DELETE' })
                  .then(() => router.push('/'))
                  .catch(() => setError('삭제에 실패했습니다'))
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            폼 삭제
          </button>
        </div>
      </main>
    </div>
  )
}
