'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Form, Response } from '@/src/db/schema'
import { EmptyState } from '@/app/components/EmptyState'
import { formatDate } from '@/src/lib/utils'

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const formId = params.id as string

  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [filterField, setFilterField] = useState(searchParams.get('filterField') || '')
  const [filterValue, setFilterValue] = useState(searchParams.get('filterValue') || '')

  useEffect(() => {
    loadData()
  }, [formId])

  useEffect(() => {
    applyFilters()
  }, [responses, search, filterField, filterValue])

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

  const applyFilters = useCallback(() => {
    let filtered = [...responses]

    if (search) {
      filtered = filtered.filter((r) =>
        JSON.stringify(r.data).toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterField && filterValue) {
      filtered = filtered.filter((r) => {
        const data = r.data as Record<string, unknown>
        return data[filterField]?.toString().includes(filterValue)
      })
    }

    setFilteredResponses(filtered)
  }, [responses, search, filterField, filterValue])

  const exportCSV = () => {
    if (!form || responses.length === 0) return

    const fields = form.fields as any[]
    const headers = fields.map((f) => f.label)
    const data = responses.map((r) => {
      const rowData = r.data as Record<string, unknown>
      return fields.map((f) => {
        const value = rowData[f.id]
        if (Array.isArray(value)) {
          return value.join('; ')
        }
        return value || ''
      })
    })

    const csv = [
      headers.join(','),
      ...data.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${form.name}_응답_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/forms/${formId}/edit`}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
              >
                ←
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {form.name} - 응답
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                disabled={responses.length === 0}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium disabled:opacity-50"
              >
                CSV 내보내기
              </button>
              <Link
                href={`/forms/${formId}/dashboard`}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
              >
                대시보드
              </Link>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
            />
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
            >
              <option value="">필터 필드</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            {filterField && (
              <input
                type="text"
                placeholder="필터 값"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50"
              />
            )}
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
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          응답 총 개수: {filteredResponses.length}개
        </div>

        {filteredResponses.length === 0 ? (
          <EmptyState
            title="조건에 맞는 응답이 없습니다"
            description={responses.length === 0 ? '아직 받은 응답이 없습니다' : '검색/필터 조건을 확인해주세요'}
          />
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {fields.map((field) => (
                    <th
                      key={field.id}
                      className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-50 bg-slate-50 dark:bg-slate-700"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-50 bg-slate-50 dark:bg-slate-700">
                    생성일
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((response) => (
                  <tr key={response.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                    {fields.map((field) => {
                      const data = response.data as Record<string, unknown>
                      const value = data[field.id]
                      const display = Array.isArray(value) ? value.join(', ') : String(value || '-')

                      return (
                        <td key={field.id} className="px-6 py-4 text-sm text-slate-900 dark:text-slate-50 max-w-xs truncate">
                          {display}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(new Date(response.createdAt as any))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
