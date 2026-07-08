'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Form, Response, FormField } from '@/src/db/schema'
import { EmptyState } from '@/app/components/EmptyState'

export default function GlobalDashboardPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const formsRes = await fetch('/api/forms')
      const formsData = await formsRes.json()

      if (formsData.success) {
        setForms(formsData.data || [])

        // Load all responses for each form
        const allResponses: Response[] = []
        for (const form of formsData.data || []) {
          const responsesRes = await fetch(`/api/forms/${form.id}/responses`)
          const responsesData = await responsesRes.json()
          if (responsesData.success) {
            allResponses.push(...(responsesData.data || []))
          }
        }
        setResponses(allResponses)
      } else {
        setError(formsData.error || '데이터를 불러올 수 없습니다')
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      setError('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
      </div>
    )
  }

  const totalForms = forms.length
  const totalResponses = responses.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                대시보드
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                전체 폼 통합 통계
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              폼 목록
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 text-red-600 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalForms === 0 ? (
          <EmptyState
            title="아직 만든 폼이 없습니다"
            description="홈에서 새 폼을 만들어보세요"
            action={{
              label: '홈으로 이동',
              onClick: () => (window.location.href = '/'),
            }}
          />
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  전체 폼 수
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {totalForms}개
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  전체 응답 수
                </div>
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {totalResponses}개
                </div>
              </div>
            </div>

            {/* Forms Response Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                폼별 응답 수
              </h2>
              <div className="space-y-3">
                {forms.map((form) => {
                  const formResponses = responses.filter((r) => r.formId === form.id)
                  const count = formResponses.length
                  const maxCount = Math.max(...forms.map((f) => responses.filter((r) => r.formId === f.id).length), 1)
                  const percentage = (count / maxCount) * 100

                  return (
                    <div key={form.id}>
                      <div className="flex justify-between items-center mb-1">
                        <Link
                          href={`/forms/${form.id}/dashboard`}
                          className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {form.name}
                        </Link>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {count}개
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Responses */}
            {responses.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  최근 응답 (최근 10개)
                </h2>
                <div className="space-y-2">
                  {responses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime())
                    .slice(0, 10)
                    .map((response) => {
                      const form = forms.find((f) => f.id === response.formId)
                      return (
                        <div
                          key={response.id}
                          className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded"
                        >
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                              {form?.name || '알 수 없는 폼'}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {response.createdAt ? new Date(response.createdAt instanceof Date ? response.createdAt : new Date()).toLocaleString('ko-KR') : '-'}
                            </div>
                          </div>
                          <Link
                            href={`/forms/${response.formId}/responses`}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                          >
                            보기
                          </Link>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
