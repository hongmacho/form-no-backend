# 폼 빌더 (백엔드 불필요) — 구현 로드맵

## 0. 프로젝트 초기화

**목표**: Next.js 16 + Drizzle + SQLite 프로젝트 기반 구축

**완료 기준**:
- [ ] `npm init` 및 Next.js 16 설치
- [ ] TypeScript 설정 (tsconfig.json)
- [ ] shadcn/ui 초기화 (`npx shadcn-ui@latest init`)
- [ ] Drizzle ORM + better-sqlite3 설치
- [ ] DB 스키마 정의 (schema.ts)
- [ ] `.gitignore` 설정 (*.db, *.sqlite, .env.local, .omc/)
- [ ] `git init` 및 초기 커밋

**산출물**:
- `package.json` (dependencies: next@16, drizzle-orm, better-sqlite3, zod, recharts, react-beautiful-dnd, shadcn/ui)
- `tsconfig.json`
- `app/layout.tsx` (기본 레이아웃)
- `src/db/schema.ts` (Drizzle 스키마)
- `src/db/client.ts` (SQLite 클라이언트)

---

## 1. Sprint 0 — 데이터 모델 & API 기초

**목표**: DB 스키마, API 라우트 기본 구조

**완료 기준**:
- [ ] `src/db/schema.ts`: forms, responses 테이블
- [ ] `src/db/client.ts`: better-sqlite3 클라이언트 (`import 'server-only'`)
- [ ] API: `POST /api/forms` (폼 생성)
- [ ] API: `GET /api/forms` (폼 목록)
- [ ] API: `GET /api/forms/[id]` (폼 상세)
- [ ] API: `PUT /api/forms/[id]` (폼 업데이트)
- [ ] API: `POST /api/responses` (응답 저장)
- [ ] API: `GET /api/forms/[id]/responses` (응답 목록)
- [ ] 입력 검증 (zod)

**기술 상세**:
- Drizzle: `integer(name, {mode:'timestamp'}).$defaultFn(() => new Date())`
- DB 초기화: lazy-initialize (빌드 중 DB 잠금 방지)
- 에러 처리: 명시적 에러 응답

**산출물**:
- `src/db/schema.ts`
- `src/db/client.ts`
- `src/lib/validators.ts` (zod 스키마)
- `app/api/forms/route.ts`
- `app/api/forms/[id]/route.ts`
- `app/api/responses/route.ts`
- `app/api/forms/[id]/responses/route.ts`

---

## 2. Sprint 1 — 홈 화면 & 폼 목록

**목표**: 폼 목록 조회 페이지

**화면**: `홈 (/)` → 폼 목록 표시

**완료 기준**:
- [ ] `app/page.tsx` (홈)
- [ ] `app/components/FormList.tsx` (폼 목록 컴포넌트)
- [ ] "새 폼 만들기" 버튼
- [ ] 빈 상태 처리 (아직 폼이 없을 때)
- [ ] 폼 카드: 이름, 설명, 생성일, "편집" 버튼
- [ ] 로딩/에러 상태
- [ ] 한국어 UI

**산출물**:
- `app/page.tsx`
- `app/components/FormList.tsx`
- `app/components/EmptyState.tsx`

**UI 텍스트**:
- "폼 빌더"
- "아직 만든 폼이 없습니다"
- "새 폼 만들기"
- "편집" / "삭제" (선택)

---

## 3. Sprint 2 — 폼 편집기 (필드 추가/관리)

**목표**: 드래그&드롭 폼 빌더

**화면**: `폼 편집 (/forms/[id]/edit)`

**필드 유형**:
1. 단답 (Text)
2. 장문 (Textarea)
3. 객관식 (Radio)
4. 체크박스 (Checkbox)
5. 드롭다운 (Select)
6. 평점 (Rating)

**완료 기준**:
- [ ] `app/forms/[id]/edit/page.tsx`
- [ ] `app/components/FormBuilder.tsx` (폼 빌더 메인)
- [ ] `app/components/FieldPanel.tsx` (필드 목록 + 드래그)
- [ ] `app/components/FieldEditor.tsx` (필드 설정)
- [ ] 드래그&드롭 (react-beautiful-dnd 또는 dnd-kit)
- [ ] 필드 추가/제거/순서 변경
- [ ] 필드 설정: 레이블, 플레이스홀더, 필수 여부
- [ ] 객관식/체크박스/드롭다운: 옵션 추가/제거
- [ ] 저장 버튼 → DB 업데이트
- [ ] 미리보기 (선택)

**산출물**:
- `app/forms/[id]/edit/page.tsx`
- `app/components/FormBuilder.tsx`
- `app/components/FieldPanel.tsx`
- `app/components/FieldEditor.tsx`
- `app/components/DragDropField.tsx`
- `src/lib/form-builder.ts` (필드 추가/제거 로직)

**UI 텍스트**:
- "필드 추가"
- "필드 유형"
- "필드 이름"
- "필수"
- "옵션 추가"
- "저장"
- "저장됨"

---

## 4. Sprint 3 — 폼 공개 링크 & 응답 수집

**목표**: 응답자가 폼 작성 후 응답 저장

**화면**: `폼 응답 (공개) (/f/[publicId])`

**완료 기준**:
- [ ] `app/f/[publicId]/page.tsx` (공개 폼 페이지)
- [ ] `app/components/PublicFormRenderer.tsx` (필드 렌더링)
- [ ] 필드별 입력 UI (text, textarea, radio, checkbox, select, rating)
- [ ] 폼 제출 → API POST /api/responses
- [ ] 응답 검증 (zod)
- [ ] 제출 성공 메시지
- [ ] 에러 처리
- [ ] 로딩 상태
- [ ] 한국어 UI

**산출물**:
- `app/f/[publicId]/page.tsx`
- `app/components/PublicFormRenderer.tsx`
- `app/components/FieldRenderer.tsx`
- `app/components/SubmitButton.tsx`

**UI 텍스트**:
- "응답 제출"
- "제출됨"
- "필수 항목입니다"
- "다시 시도해주세요"

---

## 5. Sprint 4 — 응답 목록 & 검색/필터

**목표**: 받은 응답 조회 + 검색/필터

**화면**: `응답 목록 (/forms/[id]/responses)`

**완료 기준**:
- [ ] `app/forms/[id]/responses/page.tsx`
- [ ] `app/components/ResponseList.tsx` (응답 테이블)
- [ ] 테이블: 모든 필드 표시 + 생성일
- [ ] 검색 UI (자유 텍스트 검색, 단답/장문만 적용)
- [ ] 필터 UI (필드별 필터, 예: "객관식 = 옵션 A")
- [ ] URL 쿼리로 상태 유지 (`?search=...&filter=...`)
- [ ] 응답이 없을 때 빈 상태
- [ ] 응답 수 표시
- [ ] 페이지네이션 (선택)
- [ ] CSV 내보내기 버튼
- [ ] 한국어 UI

**산출물**:
- `app/forms/[id]/responses/page.tsx`
- `app/components/ResponseList.tsx`
- `app/components/ResponseTable.tsx`
- `app/components/SearchFilter.tsx`
- `src/lib/search-filter.ts` (검색/필터 로직)

**API 추가**:
- `GET /api/forms/[id]/responses?search=...&filter=...` (검색/필터 응답)

**UI 텍스트**:
- "응답 목록"
- "응답 총 개수: X개"
- "검색..." (플레이스홀더)
- "필터 추가"
- "검색 결과가 없습니다"
- "CSV 내보내기"

---

## 6. Sprint 5 — 응답 대시보드 (통계 & 차트)

**목표**: 응답 분석 화면

**화면**: `응답 대시보드 (/forms/[id]/dashboard)` ⭐ "대시보드" 명칭

**완료 기준**:
- [ ] `app/forms/[id]/dashboard/page.tsx`
- [ ] `app/components/ResponseDashboard.tsx`
- [ ] **응답 총 개수 카드**
- [ ] **객관식/체크박스/드롭다운**: 옵션별 응답 분포 (원형 차트 + 카운트)
- [ ] **평점**: 평균 평점 + 분포 차트
- [ ] **단답/장문**: 응답 개수만 표시 (차트 불필요)
- [ ] Recharts 사용 (원형/막대 차트)
- [ ] 응답이 없을 때 빈 상태
- [ ] 한국어 UI

**산출물**:
- `app/forms/[id]/dashboard/page.tsx`
- `app/components/ResponseDashboard.tsx`
- `app/components/DistributionChart.tsx` (원형/막대 차트)
- `app/components/StatsCard.tsx`
- `src/lib/analytics.ts` (응답 분석 로직)

**API 추가**:
- `GET /api/forms/[id]/analytics` (응답 분석 데이터)

**UI 텍스트**:
- "대시보드"
- "응답 분석"
- "응답 분포"
- "평균 평점"
- "응답 총 개수"

---

## 7. Sprint 6 — CSV 내보내기 & 폼 설정

**목표**: CSV 내보내기 + 폼 설정 화면

**화면**: 
- `응답 목록`에서 "CSV 내보내기" 버튼
- `폼 설정 (/forms/[id]/settings)`

**완료 기준**:
- [ ] `app/forms/[id]/settings/page.tsx`
- [ ] `app/components/FormSettings.tsx`
- [ ] 폼 이름/설명 편집
- [ ] 공개 링크 표시 + "링크 복사" 버튼
- [ ] 공개/비공개 토글 (선택)
- [ ] CSV 내보내기 (응답 목록에서 버튼)
- [ ] CSV 생성: 모든 필드 + 모든 응답
- [ ] 파일명: `폼명_응답_yyyyMMdd.csv`
- [ ] 인코딩: UTF-8 BOM (한글 호환)
- [ ] 한국어 UI

**산출물**:
- `app/forms/[id]/settings/page.tsx`
- `app/components/FormSettings.tsx`
- `src/lib/csv-export.ts` (CSV 생성 로직)

**API 추가**:
- `GET /api/forms/[id]/export-csv` (CSV 다운로드)

**UI 텍스트**:
- "폼 설정"
- "폼 이름"
- "폼 설명"
- "공개 링크"
- "링크 복사"
- "복사됨"
- "CSV 내보내기"

---

## 데이터 모델 (Drizzle ORM)

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer, json } from 'drizzle-orm/sqlite-core'

export const forms = sqliteTable('forms', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  description: text('description'),
  publicId: text('public_id').notNull().unique(),
  fields: text('fields', { mode: 'json' }).notNull().$defaultFn(() => []), // JSON 배열
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const responses = sqliteTable('responses', {
  id: text('id').primaryKey(), // UUID
  formId: text('form_id').notNull(),
  data: text('data', { mode: 'json' }).notNull(), // { fieldId: value }
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 타입 정의
export type Form = typeof forms.$inferSelect
export type NewForm = typeof forms.$inferInsert
export type Response = typeof responses.$inferSelect
export type NewResponse = typeof responses.$inferInsert
```

---

## 컴포넌트 구조

```
app/
├── layout.tsx                                    # 기본 레이아웃
├── page.tsx                                      # 홈 (폼 목록)
├── f/
│   └── [publicId]/
│       └── page.tsx                              # 공개 폼 (응답자용)
├── forms/
│   └── [id]/
│       ├── edit/
│       │   └── page.tsx                          # 폼 편집
│       ├── responses/
│       │   ├── page.tsx                          # 응답 목록
│       │   └── [responseId]/
│       │       └── page.tsx                      # 응답 상세 (선택)
│       ├── dashboard/
│       │   └── page.tsx                          # 응답 대시보드
│       └── settings/
│           └── page.tsx                          # 폼 설정
├── api/
│   ├── forms/
│   │   ├── route.ts                              # POST (생성), GET (목록)
│   │   └── [id]/
│   │       ├── route.ts                          # GET, PUT, DELETE
│   │       ├── responses/
│   │       │   ├── route.ts                      # GET (응답 목록)
│   │       │   └── [responseId]/
│   │       │       └── route.ts                  # GET (응답 상세)
│   │       ├── analytics/
│   │       │   └── route.ts                      # GET (분석 데이터)
│   │       └── export-csv/
│   │           └── route.ts                      # GET (CSV 다운로드)
│   └── responses/
│       └── route.ts                              # POST (응답 저장)
└── components/
    ├── FormList.tsx
    ├── FormBuilder.tsx
    ├── FieldPanel.tsx
    ├── FieldEditor.tsx
    ├── PublicFormRenderer.tsx
    ├── FieldRenderer.tsx
    ├── ResponseList.tsx
    ├── ResponseTable.tsx
    ├── SearchFilter.tsx
    ├── ResponseDashboard.tsx
    ├── DistributionChart.tsx
    ├── FormSettings.tsx
    ├── EmptyState.tsx
    ├── LoadingState.tsx
    └── ErrorState.tsx

src/
├── db/
│   ├── schema.ts
│   └── client.ts
├── lib/
│   ├── validators.ts                             # zod 스키마
│   ├── form-builder.ts                           # 폼 생성/편집 로직
│   ├── search-filter.ts                          # 검색/필터 로직
│   ├── analytics.ts                              # 분석 로직
│   ├── csv-export.ts                             # CSV 생성 로직
│   └── utils.ts                                  # 유틸리티
└── types/
    └── index.ts                                  # TS 타입 정의
```

---

## 커밋 전략

각 Sprint 완료 후 **git commit**:

```
Sprint 0: init: Next.js 16 + Drizzle + SQLite 초기 설정
Sprint 1: feat: 홈 화면 & 폼 목록
Sprint 2: feat: 폼 편집기 (필드 추가/관리)
Sprint 3: feat: 폼 공개 링크 & 응답 수집
Sprint 4: feat: 응답 목록 & 검색/필터
Sprint 5: feat: 응답 대시보드 (통계 & 차트)
Sprint 6: feat: CSV 내보내기 & 폼 설정
```

---

## QA 기준

모든 Sprint 완료 후:

1. **TypeScript 검사**: `npx tsc --noEmit` → 0 에러
2. **린팅**: `npm run lint` → 0 에러
3. **빌드**: `npm run build` → 성공
4. **페이지 개수**: `grep -rE "app/.*page.tsx" app src --include="*.tsx"` ≥ 7
5. **검색 UI 노출**: `grep -rl '검색' app src --include='*.tsx'` ≥ 1
6. **대시보드 명칭**: `grep -rl '대시보드' app src --include='*.tsx'` ≥ 1

---

## 주의사항 (Next.js 16 함정)

1. **동적 라우트 params**: `await params` 필수
2. **next lint**: 제거 → `eslint .` + eslint.config.mjs 직접 생성
3. **next.config.ts**: `serverExternalPackages: ['better-sqlite3']`
4. **db 모듈**: 최상단 `import 'server-only'`
5. **클라이언트**: API 라우트 경유
6. **Drizzle 집계**: `sql<number>` + `Number()` 변환
7. **SQLite 초기화**: lazy-initialize (빌드 중 DB 잠금 방지)
8. **디렉토리명**: `mkdir app/forms/[id]/edit` (백슬래시 이스케이프 금지)
9. **npm 손상**: `rm -rf node_modules .next && npm install`

---

## 다음 단계

- Sprint 0: 프로젝트 초기화 및 DB 스키마 정의
- Sprint 1~6: 각 화면 및 기능 구현
- QA: 빌드/테스트/린팅 검사
- README.md: 사용 설명서 작성
