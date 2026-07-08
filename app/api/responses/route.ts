import { getDb } from '@/src/db/client'
import { responses, forms } from '@/src/db/schema'
import { submitResponseSchema } from '@/src/lib/validators'
import { generateId, createSuccessResponse, createErrorResponse, getErrorMessage } from '@/src/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, data } = body

    if (!formId || !data) {
      return NextResponse.json(
        createErrorResponse('폼 ID와 응답 데이터가 필요합니다'),
        { status: 400 }
      )
    }

    const validated = submitResponseSchema.parse({ data })
    const db = getDb()

    // Check if form exists
    const formList = await db.select().from(forms).where(eq(forms.id, formId))
    const form = formList[0]

    if (!form) {
      return NextResponse.json(createErrorResponse('폼을 찾을 수 없습니다'), { status: 404 })
    }

    if (!form.isPublished) {
      return NextResponse.json(createErrorResponse('더 이상 이용할 수 없는 폼입니다'), { status: 403 })
    }

    const id = generateId()
    const now = new Date()
    const userAgent = request.headers.get('user-agent') || undefined

    const newResponse = {
      id,
      formId,
      data: validated.data,
      userAgent,
      createdAt: now,
    }

    await db.insert(responses).values(newResponse)

    return NextResponse.json(createSuccessResponse({ id }), { status: 201 })
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 400 })
  }
}
