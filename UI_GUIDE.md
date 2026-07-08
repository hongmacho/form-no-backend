# 폼 빌더 (백엔드 불필요) — UI 가이드

## 1. 디자인 원칙

- **단순함**: Typeform 대비 40% 더 간단한 인터페이스
- **직관성**: 드래그&드롭, 한 번에 이해
- **한국어 우선**: 모든 텍스트 한국어 (버튼, 레이블, 메뉴, 플레이스홀더)
- **상태 피드백**: 로딩, 저장 중, 저장됨, 에러 명확히 표시
- **접근성**: 키보드 네비게이션, 스크린 리더 지원 (aria-label)

---

## 2. 색상 팔레트

### Primary Colors
- **Primary**: `#3B82F6` (파란색) — 주요 액션 버튼
- **Primary-Dark**: `#1D4ED8` — 호버 상태
- **Primary-Light**: `#DBEAFE` — 배경/강조

### Semantic Colors
- **Success**: `#10B981` (초록색) — 성공, 저장됨
- **Warning**: `#F59E0B` (주황색) — 경고
- **Error**: `#EF4444` (빨강색) — 에러, 삭제
- **Info**: `#0EA5E9` (연청색) — 정보

### Neutral Colors
- **Background**: `#FFFFFF` (라이트 모드), `#0F172A` (다크 모드)
- **Surface**: `#F8FAFC` (라이트), `#1E293B` (다크)
- **Text-Primary**: `#1E293B` (라이트), `#F1F5F9` (다크)
- **Text-Secondary**: `#64748B` (라이트), `#94A3B8` (다크)
- **Border**: `#E2E8F0` (라이트), `#334155` (다크)

---

## 3. 타이포그래피

| 요소 | Font-Size | Font-Weight | Line-Height | 용도 |
|------|-----------|------------|------------|------|
| **H1 (페이지 제목)** | 32px | 700 | 1.2 | 페이지 제목 ("폼 빌더", "응답 목록") |
| **H2 (섹션 제목)** | 24px | 600 | 1.3 | 섹션 제목 ("응답 분석", "필드 추가") |
| **Body** | 14px | 400 | 1.5 | 일반 텍스트 |
| **Small** | 12px | 400 | 1.4 | 보조 텍스트, 설명 |
| **Label** | 13px | 500 | 1.4 | 폼 라벨, 필드명 |
| **Button** | 14px | 600 | 1.2 | 버튼 텍스트 |

---

## 4. 컴포넌트 라이브러리 (shadcn/ui)

### 필수 shadcn/ui 컴포넌트

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add empty-state
npx shadcn-ui@latest add loading-spinner
npx shadcn-ui@latest add dropdown-menu
```

---

## 5. 화면별 레이아웃

### 5.1 홈 화면 (/)

```
┌─────────────────────────────────────┐
│ 폼 빌더          [로고]              │
│                            [설정]   │
├─────────────────────────────────────┤
│                                     │
│  "새 폼 만들기" [버튼]              │
│                                     │
│  [폼 카드 1]  [폼 카드 2] ...      │
│                                     │
│  카드 내용:                         │
│  - 폼 이름                          │
│  - 설명 (preview)                   │
│  - 생성일: YYYY-MM-DD              │
│  - [편집] [삭제] 버튼              │
│                                     │
└─────────────────────────────────────┘
```

**빈 상태**:
```
┌─────────────────────────────────────┐
│ 폼 빌더                              │
├─────────────────────────────────────┤
│                                     │
│     아직 만든 폼이 없습니다         │
│                                     │
│     "새 폼 만들기" [버튼]          │
│                                     │
└─────────────────────────────────────┘
```

---

### 5.2 폼 편집 화면 (/forms/[id]/edit)

```
┌─────────────────────────────────────────────────────────────┐
│ 폼 이름 (입력 가능)        [저장] [미리보기] [←돌아가기]    │
├──────────────────────────────────┬──────────────────────────┤
│ 좌측: 필드 목록               │ 우측: 필드 편집 패널        │
│                                │                            │
│ [필드 추가 ▼]                 │                            │
│                                │ 필드명: [입력]             │
│ ⬚ 필드1 (단답)               │ 유형: [드롭다운]           │
│ ⬚ 필드2 (객관식)             │ 필수: [토글]               │
│ ⬚ 필드3 (체크박스)           │ 플레이스홀더: [입력]       │
│                                │                            │
│ [필드 위로] [필드 아래로]     │ 옵션 1: [입력] [X]        │
│ [필드 제거]                   │ 옵션 2: [입력] [X]        │
│                                │ [옵션 추가]               │
│                                │                            │
└──────────────────────────────────┴──────────────────────────┘
```

**UI 텍스트**:
- "필드 추가" (드롭다운: 단답, 장문, 객관식, 체크박스, 드롭다운, 평점)
- "필드명"
- "필드 유형"
- "필수"
- "플레이스홀더"
- "옵션 추가"
- "저장" → "저장됨" (2초 후)
- "미리보기"
- "위로 이동" / "아래로 이동" / "삭제"

---

### 5.3 폼 응답 (공개) (/f/[publicId])

```
┌─────────────────────────────────────┐
│                                     │
│         폼 이름                     │
│         폼 설명 (있으면)            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ 필드1 (단답)                       │
│ [입력 필드........]                │
│                                     │
│ 필드2 (객관식)                     │
│ ◯ 옵션 1                           │
│ ◯ 옵션 2                           │
│ ◯ 옵션 3                           │
│                                     │
│ 필드3 (체크박스)                   │
│ ☐ 옵션 A                           │
│ ☐ 옵션 B                           │
│                                     │
│ 필드4 (드롭다운)                   │
│ [선택해주세요 ▼]                   │
│                                     │
│ 필드5 (평점)                       │
│ ☆ ☆ ☆ ☆ ☆                         │
│                                     │
│                 [응답 제출]        │
│                                     │
└─────────────────────────────────────┘

제출 후:
┌─────────────────────────────────────┐
│                                     │
│ ✓ 응답이 제출되었습니다.           │
│                                     │
│ 감사합니다!                        │
│                                     │
└─────────────────────────────────────┘
```

**필드 유형별 렌더링**:

1. **단답**: `<input type="text" placeholder="..."/>`
2. **장문**: `<textarea placeholder="..."/>`
3. **객관식**: `<RadioGroup>`
4. **체크박스**: `<Checkbox[]>`
5. **드롭다운**: `<Select>`
6. **평점**: `<StarRating>`

---

### 5.4 응답 목록 (/forms/[id]/responses)

```
┌─────────────────────────────────────────┐
│ 응답 목록                               │
│                                         │
│ 응답 총 개수: 15개                      │
│                                         │
│ [검색...]  [필터 추가 ▼]               │
│                                         │
├─────────────────────────────────────────┤
│ 필드1        │ 필드2        │ 생성일    │
├─────────────────────────────────────────┤
│ 답변1        │ 답변1        │ 2025-01 │
│ 답변2        │ 답변2        │ 2025-01 │
│ 답변3        │ 답변3        │ 2025-01 │
└─────────────────────────────────────────┘

[CSV 내보내기]
```

**필터 UI**:
```
필터 추가
┌──────────────────────────┐
│ 필드 선택: [드롭다운]     │
│ 조건: [같음 / 포함 등]   │
│ 값: [입력]               │
│ [추가] [X]               │
└──────────────────────────┘
```

**검색**:
- 텍스트 필드 검색만 가능 (단답, 장문)
- 실시간 필터링

---

### 5.5 응답 대시보드 (/forms/[id]/dashboard)

```
┌─────────────────────────────────────────┐
│ 대시보드                                │
│                                         │
│ ┌─────────────┐ ┌─────────────┐       │
│ │ 응답 총 개수 │ │ 평균 평점   │       │
│ │    15개     │ │    4.2 ⭐    │       │
│ └─────────────┘ └─────────────┘       │
│                                         │
│ 응답 분석                               │
│                                         │
│ 필드1 (객관식) — 원형 차트              │
│   옵션 A: 7개 (47%)                   │
│   옵션 B: 5개 (33%)                   │
│   옵션 C: 3개 (20%)                   │
│                                         │
│ 필드2 (체크박스) — 막대 차트            │
│   옵션 1: 10개                        │
│   옵션 2: 8개                         │
│   옵션 3: 5개                         │
│                                         │
│ 필드3 (평점) — 막대 차트               │
│   5⭐: 8개                            │
│   4⭐: 4개                            │
│   3⭐: 2개                            │
│   2⭐: 1개                            │
│   1⭐: 0개                            │
│                                         │
└─────────────────────────────────────────┘
```

**차트 라이브러리**: Recharts (PieChart, BarChart)

---

### 5.6 폼 설정 (/forms/[id]/settings)

```
┌─────────────────────────────────────┐
│ 폼 설정                              │
│                                     │
│ 폼 이름                             │
│ [입력 필드..............]           │
│                                     │
│ 폼 설명                             │
│ [텍스트 영역........................│
│ .........................]           │
│                                     │
│ 공개 링크                           │
│ https://form.local/f/abc123         │
│ [링크 복사]                         │
│ 📋 (복사되었습니다)                 │
│                                     │
│ 상태                                │
│ [공개 토글 ON] 폼 공개 중           │
│                                     │
│           [저장]                    │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. 버튼 스타일

| 버튼 | 상태 | 색상 | 크기 |
|------|------|------|------|
| **Primary** | Normal | `#3B82F6` | `h-10 px-4` |
| | Hover | `#1D4ED8` | - |
| | Disabled | `#CBD5E1` | - |
| **Secondary** | Normal | `#F1F5F9` (라이트) / `#334155` (다크) | `h-10 px-4` |
| **Danger** | Normal | `#EF4444` | `h-10 px-4` |
| | Hover | `#DC2626` | - |
| **Small** | - | - | `h-8 px-3` (텍스트 기준) |

**예**:
```tsx
// Primary Button
<button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
  저장
</button>

// Secondary Button
<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
  취소
</button>

// Danger Button
<button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
  삭제
</button>
```

---

## 7. 상태별 UI

### 로딩 상태
```
┌─────────────────────┐
│  로딩 중...         │
│  ⌛ (스피너)        │
└─────────────────────┘
```

### 저장 상태
```
─ 저장 중...
─ ✓ 저장됨 (2초 후 사라짐)
```

### 에러 상태
```
┌──────────────────────────┐
│ ⚠️  오류가 발생했습니다  │
│                          │
│ 다시 시도해주세요.      │
│ [다시 시도]              │
└──────────────────────────┘
```

### 빈 상태
```
┌──────────────────────────────┐
│                              │
│   아직 응답이 없습니다.      │
│                              │
│ 공개 링크를 공유하세요:     │
│ https://form.local/f/...    │
│                              │
└──────────────────────────────┘
```

---

## 8. 폼 입력 필드 스타일

```tsx
// Text Input
<input
  type="text"
  placeholder="예: 이름을 입력해주세요"
  className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
/>

// Textarea
<textarea
  placeholder="자세한 의견을 입력해주세요"
  className="border border-gray-300 rounded px-3 py-2 w-full h-24 focus:ring-2 focus:ring-blue-500"
/>

// Checkbox
<label className="flex items-center gap-2">
  <input type="checkbox" className="w-4 h-4 rounded" />
  <span>옵션 A</span>
</label>

// Radio
<label className="flex items-center gap-2">
  <input type="radio" name="field" className="w-4 h-4" />
  <span>옵션 1</span>
</label>

// Select
<select className="border border-gray-300 rounded px-3 py-2 w-full">
  <option>선택해주세요</option>
  <option>옵션 1</option>
  <option>옵션 2</option>
</select>
```

---

## 9. 라벨 & 플레이스홀더

**라벨 스타일**:
- Font-Size: 13px (작은 라벨)
- Font-Weight: 500 (bold)
- 색상: `#1E293B` (라이트), `#F1F5F9` (다크)
- 필수 표시: `*` (빨강색, 오른쪽)

**예**:
```tsx
<label className="block text-sm font-medium mb-2">
  이메일 주소 <span className="text-red-500">*</span>
</label>
<input type="email" placeholder="example@gmail.com" />
```

**플레이스홀더**:
- 색상: `#94A3B8` (라이트), `#64748B` (다크)
- 실제 입력 예시 표시 (예: "2025-01-08", "example@gmail.com")

---

## 10. 드래그&드롭 스타일

**필드 드래그 상태**:
```
⬚ 필드1 (단답)  ← Normal
  ↕️ 필드2 (객관식) ← Dragging (배경 밝음, 그림자)
⬚ 필드3         ← Normal
```

**구현**:
- 라이브러리: react-beautiful-dnd 또는 dnd-kit
- Dragging 상태: `bg-blue-50`, `shadow-md`, `border-l-4 border-blue-500`
- Drop Zone: 점선 테두리, `opacity-50`

---

## 11. 테이블 스타일 (응답 목록)

```
┌─────────────┬──────────────┬───────────────┐
│ 필드 1      │ 필드 2       │ 생성일        │
├─────────────┼──────────────┼───────────────┤
│ 답변 1-1    │ 답변 2-1     │ 2025-01-08    │
├─────────────┼──────────────┼───────────────┤
│ 답변 1-2    │ 답변 2-2     │ 2025-01-07    │
├─────────────┼──────────────┼───────────────┤
│ 답변 1-3    │ 답변 2-3     │ 2025-01-06    │
└─────────────┴──────────────┴───────────────┘
```

**스타일**:
- 헤더: `bg-gray-100`, `font-semibold`, `text-left`
- 행: `border-b border-gray-200`
- 호버: `bg-gray-50`
- 긴 텍스트: `truncate` (말줄임) 또는 `line-clamp-2`

---

## 12. 다크 모드 지원

모든 색상은 `@media (prefers-color-scheme: dark)` 또는 `data-theme="dark"`로 전환 가능해야 함.

**예**:
```css
.button {
  background-color: #3B82F6;
  color: white;
}

@media (prefers-color-scheme: dark) {
  .button {
    background-color: #1D4ED8;
    color: #F1F5F9;
  }
}
```

---

## 13. 한국어 UI 체크리스트

모든 페이지에서 다음을 확인:

- [ ] 버튼: "저장", "취소", "삭제", "편집", "공유", "내보내기"
- [ ] 라벨: "폼 이름", "필드명", "필수", "플레이스홀더"
- [ ] 메시지: "저장됨", "오류 발생", "응답 없음", "로딩 중..."
- [ ] 플레이스홀더: "예: 이름을 입력해주세요"
- [ ] 에러: "필수 항목입니다", "이미 존재하는 이름입니다"
- [ ] 성공: "폼이 생성되었습니다", "응답이 제출되었습니다"

---

## 14. 반응형 디자인

### 브레이크포인트

| 기기 | 너비 | 레이아웃 |
|------|------|---------|
| **Mobile** | < 640px | 1열, 폰트 작음 |
| **Tablet** | 640px ~ 1024px | 2열, 테이블 가로 스크롤 |
| **Desktop** | > 1024px | 3열+, 정상 |

**폼 편집기 (Desktop)**:
- 좌측: 필드 목록 (30%)
- 우측: 필드 편집 (70%)

**폼 편집기 (Mobile)**:
- 상/하: 필드 목록 (상), 필드 편집 (하)
- 또는 탭: "필드 목록" / "편집 패널"

---

## 15. 접근성 (a11y)

모든 대화형 요소:
- `aria-label` 추가 (예: `aria-label="필드 추가"`)
- `role` 지정 (예: `role="button"`)
- 포커스 상태: `focus:ring-2 focus:ring-blue-500`
- 키보드 네비게이션: Tab, Enter, Escape 지원

**예**:
```tsx
<button
  aria-label="필드 추가"
  onClick={handleAddField}
  className="focus:ring-2 focus:ring-blue-500"
>
  필드 추가
</button>
```

---

## 16. 토스트/알림 (shadcn/ui Toast)

```tsx
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

// 성공
toast({
  title: '완료',
  description: '폼이 저장되었습니다',
  variant: 'default',
})

// 에러
toast({
  title: '오류',
  description: '다시 시도해주세요',
  variant: 'destructive',
})

// 정보
toast({
  title: '알림',
  description: '링크가 복사되었습니다',
  variant: 'default',
})
```

---

## 17. 차트 (Recharts)

### 원형 차트 (필드별 분포)
```tsx
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

const data = [
  { name: '옵션 A', value: 7 },
  { name: '옵션 B', value: 5 },
  { name: '옵션 C', value: 3 },
]

<PieChart width={400} height={300}>
  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip formatter={(value) => `${value}개`} />
  <Legend />
</PieChart>
```

### 막대 차트 (평점 분포)
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const data = [
  { rating: '5⭐', count: 8 },
  { rating: '4⭐', count: 4 },
  { rating: '3⭐', count: 2 },
  { rating: '2⭐', count: 1 },
  { rating: '1⭐', count: 0 },
]

<BarChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="rating" />
  <YAxis />
  <Tooltip formatter={(value) => `${value}개`} />
  <Bar dataKey="count" fill="#3B82F6" />
</BarChart>
```

---

## 18. 폐기할 요소

❌ 복잡한 애니메이션 (단순 fade-in/fade-out만)  
❌ 과도한 모달 (필요시에만)  
❌ 이모지 남용 (심플함 유지)  
❌ 스크롤 트리거 효과 (빠른 로드 우선)  

---

## 19. 브라우저 호환성

- Chrome/Edge: 최신 2개 버전
- Firefox: 최신 2개 버전
- Safari: 최신 2개 버전
- Mobile: iOS Safari 15+, Chrome Android 90+

---

## 20. 성능 지표

- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **폼 로드**: < 1초
- **응답 제출**: < 500ms

---

## 다음 단계

1. shadcn/ui 컴포넌트 설치
2. Tailwind CSS 커스텀 컬러 설정
3. 레이아웃 및 기본 컴포넌트 구현
4. 각 화면 UI 프로토타입
5. 다크 모드 테스트
