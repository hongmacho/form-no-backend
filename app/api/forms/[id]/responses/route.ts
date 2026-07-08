import { getDb } from '@/src/db/client'
import { responses, forms } from '@/src/db/schema'
import { createSuccessResponse, createErrorResponse, getErrorMessage } from '@/src/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDb()

    // Check if form exists
    const formList = await db.select().from(forms).where(eq(forms.id, id))
    const form = formList[0]

    if (!form) {
      return NextResponse.json(createErrorResponse('폼을 찾을 수 없습니다'), { status: 404 })
    }

    // Get query parameters for search and filter
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const filterField = searchParams.get('filterField') || ''
    const filterValue = searchParams.get('filterValue') || ''

    const allResponses = await db.select().from(responses).where(eq(responses.formId, id)).orderBy(desc(responses.createdAt))

    // Apply filters in JS (since SQLite JSON filtering is complex)
    let filtered = allResponses
    if (search) {
      filtered = filtered.filter(
        (r) =>
          JSON.stringify(r.data).toLowerCase().includes(search.toLowerCase())
      )
    }

    if (filterField && filterValue) {
      filtered = filtered.filter(
        (r) => {
          const data = r.data as Record<string, unknown>
          return data[filterField]?.toString().includes(filterValue)
        }
      )
    }

    return NextResponse.json(
      createSuccessResponse(filtered, {
        total: filtered.length,
      })
    )
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 500 })
  }
}
