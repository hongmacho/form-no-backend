'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Form } from '@/src/db/schema'
import { FormList } from './components/FormList'

export default function Home() {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFormName, setNewFormName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/forms')
      const result = await response.json()

      if (result.success) {
        setForms(result.data)
      } else {
        setError(result.error || '폼 목록을 불러올 수 없습니다')
      }
    } catch (error) {
      console.error('폼 목록 로드 실패:', error)
      setError('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFormName.trim()) return

    try {
      setIsCreating(true)
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFormName }),
      })

      const result = await response.json()
      if (result.success) {
        setNewFormName('')
        setShowCreateForm(false)
        await loadForms()
      } else {
        setError(result.error || '폼 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('폼 생성 실패:', error)
      setError('오류가 발생했습니다')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (result.success) {
        await loadForms()
      } else {
        setError(result.error || '삭제에 실패했습니다')
      }
    } catch (error) {
      console.error('폼 삭제 실패:', error)
      setError('오류가 발생했습니다')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              폼 빌더
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              드래그&드롭으로 쉽게 폼을 만들고 응답을 수집하세요
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors"
            >
              대시보드
            </Link>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              + 새 폼 만들기
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        <FormList
          forms={forms}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                새 폼 만들기
              </h2>
              <form onSubmit={handleCreateForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                    폼 이름
                  </label>
                  <input
                    type="text"
                    value={newFormName}
                    onChange={(e) => setNewFormName(e.target.value)}
                    placeholder="예: 고객 피드백"
                    autoFocus
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewFormName('')
                    }}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newFormName.trim()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:bg-slate-300"
                  >
                    {isCreating ? '생성 중...' : '생성'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
          폼 빌더 v1.0 • 로컬 저장 • MIT License
        </div>
      </footer>
    </div>
  )
}
