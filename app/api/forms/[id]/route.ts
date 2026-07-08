import { getDb } from '@/src/db/client'
import { forms } from '@/src/db/schema'
import { updateFormSchema } from '@/src/lib/validators'
import { createSuccessResponse, createErrorResponse, getErrorMessage } from '@/src/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDb()
    const formList = await db.select().from(forms).where(eq(forms.id, id))
    const form = formList[0]

    if (!form) {
      return NextResponse.json(createErrorResponse('폼을 찾을 수 없습니다'), { status: 404 })
    }

    return NextResponse.json(createSuccessResponse(form))
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = updateFormSchema.parse(body)

    const db = getDb()
    const now = new Date()

    const updateData = {
      ...validated,
      updatedAt: now,
    }

    await db.update(forms).set(updateData).where(eq(forms.id, id))

    const updatedList = await db.select().from(forms).where(eq(forms.id, id))
    const updated = updatedList[0]

    if (!updated) {
      return NextResponse.json(createErrorResponse('폼을 찾을 수 없습니다'), { status: 404 })
    }

    return NextResponse.json(createSuccessResponse(updated))
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDb()

    await db.delete(forms).where(eq(forms.id, id))

    return NextResponse.json(createSuccessResponse({ message: '삭제되었습니다' }))
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 500 })
  }
}
