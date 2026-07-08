import { getDb } from '@/src/db/client'
import { forms } from '@/src/db/schema'
import { createFormSchema } from '@/src/lib/validators'
import { generateId, generatePublicId, createSuccessResponse, createErrorResponse, getErrorMessage } from '@/src/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const db = getDb()
    const allForms = await db.select().from(forms).orderBy(desc(forms.createdAt))

    return NextResponse.json(
      createSuccessResponse(allForms, {
        total: allForms.length,
      })
    )
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createFormSchema.parse(body)

    const db = getDb()
    const id = generateId()
    const publicId = generatePublicId()
    const now = new Date()

    const newForm = {
      id,
      name: validated.name,
      description: validated.description || null,
      publicId,
      fields: [],
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    }

    await db.insert(forms).values(newForm)

    return NextResponse.json(createSuccessResponse(newForm), { status: 201 })
  } catch (error) {
    const message = getErrorMessage(error)
    return NextResponse.json(createErrorResponse(message), { status: 400 })
  }
}
