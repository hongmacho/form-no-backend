'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Form, Response } from '@/src/db/schema'
import { EmptyState } from '@/app/components/EmptyState'

export default function DashboardPage() {
  const params = useParams()
  const formId = params.id as string

  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [formId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [formRes, responsesRes] = await Promise.all([
        fetch(`/api/forms/${formId}`),
        fetch(`/api/forms/${formId}/responses`),
      ])

      const formData = await formRes.json()
      const responsesData = await responsesRes.json()

      if (formData.success) {
        setForm(formData.data)
      } else {
        setError(formData.error || '폼을 찾을 수 없습니다')
      }

      if (responsesData.success) {
        setResponses(responsesData.data || [])
      } else {
        setError(responsesData.error || '응답을 불러올 수 없습니다')
      }
    } catch (err) {
      setError('오류가 발생했습니다')
    } finally {
      setIsLoading(false)
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
        <EmptyState title="폼을 찾을 수 없습니다" />
      </div>
    )
  }

  const fields = form.fields as any[]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href={`/forms/${formId}/edit`}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
              >
                ←
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {form.name} - 대시보드
              </h1>
            </div>
            <Link
              href={`/forms/${formId}/responses`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              응답 목록
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
        {responses.length === 0 ? (
          <EmptyState
            title="아직 받은 응답이 없습니다"
            description="공개 링크를 공유하세요"
          />
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                응답 통계
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-sm text-slate-600 dark:text-slate-400">응답 총 개수</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    {responses.length}개
                  </div>
                </div>
              </div>
            </div>

            {/* Field Analysis */}
            <div className="space-y-6">
              {fields.map((field) => (
                <FieldAnalysis key={field.id} field={field} responses={responses} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

interface FieldAnalysisProps {
  field: any
  responses: Response[]
}

function FieldAnalysis({ field, responses }: FieldAnalysisProps) {
  if (['text', 'textarea'].includes(field.type)) {
    const filledCount = responses.filter((r) => {
      const data = r.data as Record<string, unknown>
      return data[field.id]
    }).length

    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          {field.label} ({field.type === 'text' ? '단답' : '장문'})
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          응답: {filledCount}개
        </div>
      </div>
    )
  }

  if (['radio', 'checkbox', 'select'].includes(field.type)) {
    const distribution: Record<string, number> = {}
    const options = field.options || []

    options.forEach((option: string) => {
      distribution[option] = 0
    })

    responses.forEach((r) => {
      const data = r.data as Record<string, unknown>
      const value = data[field.id]

      if (field.type === 'checkbox' && Array.isArray(value)) {
        value.forEach((v) => {
          if (distribution.hasOwnProperty(v)) {
            distribution[v]++
          }
        })
      } else if (value) {
        const key = value.toString()
        if (distribution.hasOwnProperty(key)) {
          distribution[key]++
        }
      }
    })

    const total = Object.values(distribution).reduce((a, b) => a + b, 0)

    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          {field.label}
          {field.type === 'radio' && ' (객관식)'}
          {field.type === 'checkbox' && ' (체크박스)'}
          {field.type === 'select' && ' (드롭다운)'}
        </h3>
        <div className="space-y-3">
          {Object.entries(distribution).map(([option, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={option}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-900 dark:text-slate-50">{option}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {count}개 ({percentage}%)
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
    )
  }

  if (field.type === 'rating') {
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    let sum = 0
    let count = 0

    responses.forEach((r) => {
      const data = r.data as Record<string, unknown>
      const value = data[field.id]
      if (value) {
        const rating = Number(value)
        if (rating >= 1 && rating <= 5) {
          distribution[rating as 1 | 2 | 3 | 4 | 5]++
          sum += rating
          count++
        }
      }
    })

    const average = count > 0 ? (sum / count).toFixed(1) : '0'

    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          {field.label} (평점)
        </h3>
        <div className="mb-6">
          <div className="text-4xl font-bold text-blue-500">
            {average} <span className="text-2xl">⭐</span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {count}개 응답 기준
          </div>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as 1 | 2 | 3 | 4 | 5]
            const percentage = sum > 0 ? Math.round((count / sum) * 100) : 0
            return (
              <div key={rating}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-900 dark:text-slate-50">
                    {rating}⭐
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {count}개
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
