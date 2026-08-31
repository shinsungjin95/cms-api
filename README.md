# CMS API

> **Node.js + Express + Supabase 기반의 CMS REST API**

React 관리자와 Next.js 홈페이지에서 사용하는 메뉴, 콘텐츠, 배너 데이터를 관리하기 위해 직접 구축한 Backend API입니다.

단순한 Mock API가 아닌 **Supabase PostgreSQL / Storage와 연결된 실제 데이터 CRUD**, JWT 기반 관리자 인증, 이미지 업로드, 검색 및 Pagination, 노출 순서 관리까지 구현했습니다.

---

## 주요 구현

### 🔐 Authentication

- 관리자 로그인 API 구현
- `bcrypt`를 이용한 비밀번호 검증
- 로그인 성공 시 JWT Access Token 발급
- JWT Payload에 관리자 식별 정보 저장
- Token 만료 시간 설정
- `authMiddleware`를 통한 관리자 API 인증
- 조회 API와 관리자 변경 API의 접근 권한 분리

```text
Login Request
     │
     ▼
Admin 조회
     │
     ▼
bcrypt.compare()
     │
     ▼
JWT 발급
     │
     ▼
Client
     │
     ▼
Authorization Header
     │
     ▼
authMiddleware
     │
     ▼
Protected API
```

---

### 🗂 Menu API

홈페이지의 동적 메뉴 구조를 관리합니다.

- 전체 메뉴 조회
- 관리자 메뉴 저장
- Menu Tree를 JSON 형태로 관리
- 1Depth / 하위 게시판 구조를 하나의 데이터로 저장
- Front-end Drag & Drop 결과를 최종 JSON 구조로 반영

메뉴의 추가, 수정, 삭제, 순서 변경을 각각 별도의 데이터로 관리하지 않고 **완성된 Menu Tree 자체를 저장하는 구조**로 구현했습니다.

---

### 📝 Content API

관리자가 생성한 게시판의 `menuId`를 기준으로 콘텐츠를 관리합니다.

- `menuId` 기반 콘텐츠 목록 조회
- 콘텐츠 상세 조회
- 신규 등록
- 수정
- 다중 삭제
- 제목 검색
- `startDate ~ endDate` 기간 검색
- `offset / limit` 기반 Pagination
- Multipart FormData 이미지 업로드
- 기존 이미지 유지 + 신규 이미지 추가를 고려한 수정 처리

```text
menuId
  │
  ▼
Contents
  │
  ├── Search
  ├── Pagination
  ├── Detail
  ├── Create
  ├── Update
  └── Delete
```

---

### 🖼 Banner API

홈페이지 메인 배너를 관리합니다.

- 배너 전체 조회
- 신규 등록 / 수정
- ID 배열 기반 다중 삭제
- `active` 상태 변경
- `sort_order` 기반 노출 순서 관리
- 여러 배너의 순서를 한 번에 변경
- 최대 5개 등록 제한
- Supabase Storage 이미지 업로드

배너의 일반 정보 수정과 순서 변경 API를 분리하여 **일반 수정이 기존 노출 순서에 영향을 주지 않도록 구성**했습니다.

---

## Tech Stack

### Backend

`Node.js` `Express` `JavaScript (ES Modules)`

### Authentication

`JWT` `bcryptjs`

### Database / Storage

`Supabase PostgreSQL` `Supabase Storage`

### Middleware

`Multer` `CORS`

### Environment / Deployment

`dotenv` `Vercel`

---

## Project Position

본 Repository는 전체 CMS 프로젝트에서 **Backend REST API**를 담당합니다.

```text
┌─────────────────────────┐
│       CMS Admin         │
│   React + TypeScript    │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│        CMS API          │
│   Node.js + Express     │  ← Current Repository
└────────────┬────────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
 PostgreSQL     Storage
       │           │
       └─────┬─────┘
             ▼
          Supabase

             ▲
             │ REST API
┌────────────┴────────────┐
│       Homepage          │
│        Next.js          │
└─────────────────────────┘
```

React 관리자에서는 인증된 요청을 통해 데이터를 생성·수정·삭제하고,  
Next.js 홈페이지에서는 저장된 메뉴, 콘텐츠, 배너 데이터를 조회하여 사용자 화면을 구성합니다.

> CMS Admin과 Homepage는 별도의 Repository로 구성했습니다.

## 💡 핵심 설계

### 01. Route → Controller → Service 역할 분리

API 처리 로직이 하나의 파일에 집중되지 않도록 요청 경로, 요청 처리, 데이터 접근의 역할을 분리했습니다.

```text
Client Request
      │
      ▼
    Router
      │
      ├── authMiddleware
      ├── multer
      │
      ▼
  Controller
      │
      ▼
   Service
      │
      ▼
   Supabase
```

- **Router** — Endpoint 정의 및 Middleware 연결
- **Middleware** — JWT 인증 및 Multipart 파일 처리
- **Controller** — Parameter 검증, Service 호출, Response 처리
- **Service** — Supabase Database / Storage 접근

Controller에서는 HTTP 요청과 응답 처리에 집중하고, 실제 데이터 조회·등록·수정·삭제 로직은 Service로 분리했습니다.

이를 통해 API가 추가되더라도 각 계층의 역할을 유지하면서 기능을 확장할 수 있도록 구성했습니다.

---

### 02. JWT 기반 관리자 API 인증

콘텐츠 조회와 같이 홈페이지에서도 필요한 API는 공개하고, 데이터 변경이 발생하는 API는 JWT 인증을 거치도록 분리했습니다.

```text
POST /auth/login
       │
       ▼
Admin 조회
       │
       ▼
bcrypt.compare()
       │
       ▼
   JWT 발급
       │
       ▼
     Client
       │
       │ Authorization: Bearer Token
       ▼
authMiddleware
       │
       ▼
POST / PATCH / DELETE
```

로그인 시 DB에 저장된 관리자 정보와 입력된 비밀번호를 `bcrypt`로 비교하고, 인증 성공 시 관리자 식별 정보를 포함한 JWT를 발급합니다.

이후 등록·수정·삭제 요청은 `authMiddleware`에서 Token을 검증한 뒤 Controller로 전달되도록 구성했습니다.

```text
GET                     → Public
POST / PATCH / DELETE   → JWT Authentication
```

인증 로직을 각 Controller에서 반복하지 않고 Middleware로 분리하여 보호가 필요한 Route에 공통 적용했습니다.

---

### 03. Database와 Image Storage 분리

콘텐츠와 배너는 텍스트 데이터뿐 아니라 이미지 파일을 함께 처리해야 하기 때문에 `multipart/form-data` 기반으로 요청을 처리합니다.

```text
Multipart FormData
        │
        ▼
      Multer
        │
        ├── title / content / link
        │          │
        │          ▼
        │      PostgreSQL
        │
        └── image buffer
                   │
                   ▼
           Supabase Storage
                   │
                   ▼
              Public URL
                   │
                   ▼
              PostgreSQL
```

Multer에서 전달받은 이미지 파일은 Supabase Storage에 업로드하고, 생성된 Public URL만 Database에 저장하도록 구성했습니다.

파일명은 원본 파일명에 의존하지 않고 서버에서 고유한 이름을 생성하여 한글 파일명이나 중복 파일명으로 인해 발생할 수 있는 Storage Key 문제도 방지했습니다.

---

### 04. 콘텐츠 수정 시 기존 이미지와 신규 이미지 분리

콘텐츠 수정 과정에서 제목이나 본문만 변경했는데 기존 이미지가 사라지지 않도록 **기존 이미지와 새로 업로드된 파일을 구분하여 처리**했습니다.

```text
Content Update
      │
      ├── existingImages
      │        │
      │        └── 기존 URL 유지
      │
      └── req.files
               │
               ▼
        Storage 신규 업로드
               │
               ▼
         newImages
               │
       ┌───────┴────────┐
       ▼                ▼
existingImages     newImages
       │                │
       └───────┬────────┘
               ▼
          images[]
               │
               ▼
          DB Update
```

Front-end에서 유지할 기존 이미지 목록을 `existingImages`로 전달하고, 새롭게 선택한 파일만 Storage에 업로드합니다.

최종적으로 두 데이터를 합쳐 `images`를 갱신하기 때문에 **텍스트만 수정하는 경우 기존 이미지는 그대로 유지하면서 이미지 추가·제거도 동일한 수정 API에서 처리**할 수 있습니다.

---

### 05. 데이터 성격에 따른 저장 전략 분리

모든 데이터를 동일한 방식으로 처리하지 않고 데이터의 특성에 따라 저장 방식을 다르게 구성했습니다.

| Data | 관리 방식 |
| --- | --- |
| Menu | 전체 Tree를 JSON으로 저장 |
| Content | `menuId` 기준 개별 Row CRUD |
| Banner | 개별 Row CRUD + `active` + `sort_order` |
| Image | Storage 업로드 후 URL을 DB에 저장 |

**Menu**는 부모와 자식의 계층 및 순서 자체가 하나의 상태이기 때문에 최종 Tree 전체를 JSON으로 저장합니다.

반면 **Content**는 검색, Pagination, 상세 조회가 필요하므로 각각을 Row로 관리하고 `menuId`를 기준으로 게시판을 구분했습니다.

**Banner**는 개별 수정과 함께 노출 여부 및 순서 변경이 필요하기 때문에 `active`, `sort_order`를 별도로 관리합니다.

```text
Menu
 └── Tree 구조 중심
       → JSON

Content
 └── 조회 / 검색 / Pagination 중심
       → Row + menuId

Banner
 └── 개별 관리 / 노출 / 순서 중심
       → Row + active + sort_order
```

데이터의 사용 목적에 맞춰 저장 구조와 API 처리 방식을 구분했습니다.

---

### 06. 배너 정보 수정과 순서 변경 분리

배너는 일반 정보 수정과 Drag & Drop 순서 변경의 목적이 다르기 때문에 각각 별도의 처리 흐름으로 구성했습니다.

```text
Banner Update
     │
     └── title / link / image / active
                 │
                 ▼
              PATCH


Drag & Drop
     │
     └── [{ id, sortOrder }, ...]
                 │
                 ▼
          PATCH /banners/order
```

순서 변경 시 전달받은 배열을 기준으로 각 배너의 `sort_order`를 갱신하고, 일반 정보 수정에서는 기존 순서가 유지되도록 처리했습니다.

이를 통해 **배너 내용 수정이 노출 순서에 영향을 주지 않도록 책임을 분리**했습니다.

---

### 07. 포트폴리오 운영을 위한 자동 데이터 복구 시스템

포트폴리오 관리자 페이지는 방문자가 실제 CMS 기능을 직접 확인할 수 있도록 공개되어 있기 때문에, 테스트 과정에서 메뉴·콘텐츠·배너 데이터가 수정되거나 삭제될 수 있습니다.

이를 위해 **초기 데이터를 별도의 Backup Table에 보관하고, 매일 자동으로 기준 상태를 복구하는 시스템**을 구성했습니다.

```text
Portfolio Visitor
       │
       ▼
CMS Admin
       │
       ├── Menu 수정 / 삭제
       ├── Content 수정 / 삭제
       └── Banner 수정 / 삭제
               │
               ▼
          Supabase DB

               │
               │ Vercel Cron
               │ 매일 00:00
               ▼

          GET /reset
               │
               ▼
        CRON_SECRET 검증
               │
               ▼
       reset_cms_data()
               │
       ┌───────┴────────┐
       ▼                ▼
 Original Tables    Backup Tables
       │                │
       └───────┬────────┘
               ▼
        초기 데이터 복구


## 🔌 API Overview

관리자와 홈페이지에서 사용하는 API를 기능별로 분리하여 구성했습니다.

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `POST` | `/auth/login` | - | 관리자 로그인 및 JWT 발급 |

로그인 성공 시 JWT를 발급하며, 이후 데이터 변경 API의 인증에 사용합니다.

---

### Menu

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `GET` | `/menus` | - | 전체 메뉴 Tree 조회 |
| `POST` | `/menus` | JWT | Menu Tree 저장 |

메뉴의 생성·수정·삭제·순서 변경 결과를 개별 요청으로 처리하지 않고, 최종 Menu Tree를 JSON 형태로 저장합니다.

---

### Content

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `GET` | `/contents` | - | 게시판별 콘텐츠 목록 / 검색 / Pagination |
| `GET` | `/contents/detail` | - | 콘텐츠 상세 조회 |
| `POST` | `/contents` | JWT | 콘텐츠 및 이미지 등록 |
| `PATCH` | `/contents` | JWT | 콘텐츠 및 이미지 수정 |
| `DELETE` | `/contents` | JWT | 콘텐츠 다중 삭제 |

목록 API는 다음 Query Parameter를 지원합니다.

```text
menuId      게시판 식별
title       제목 검색
startDate   검색 시작일
endDate     검색 종료일
offset      조회 시작 위치
limit       조회 개수
```

`menuId`를 필수 식별자로 사용하고 나머지 검색 조건은 선택적으로 적용하여 하나의 목록 API를 여러 게시판에서 재사용할 수 있도록 구성했습니다.

---

### Banner

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `GET` | `/banners` | - | 배너 목록 조회 |
| `POST` | `/banners` | JWT | 배너 등록 |
| `PATCH` | `/banners` | JWT | 배너 정보 / 노출 상태 수정 |
| `PATCH` | `/banners/order` | JWT | 배너 노출 순서 변경 |
| `DELETE` | `/banners` | JWT | 배너 다중 삭제 |

배너 목록은 `sort_order`를 기준으로 정렬하며, `active` 값을 통해 홈페이지 노출 여부를 제어합니다.

Drag & Drop으로 순서가 변경되면 다음과 같은 형태로 여러 배너의 순서를 한 번에 전달합니다.

```json
{
    "orders": [
        {
            "id": 5,
            "sortOrder": 0
        },
        {
            "id": 3,
            "sortOrder": 1
        },
        {
            "id": 2,
            "sortOrder": 2
        }
    ]
}
```

---

## 📁 Project Structure

API의 역할에 따라 Router, Controller, Service, Middleware를 분리했습니다.

```text
src/
├── config/
│   ├── env.js
│   └── supabase.js
│
├── controllers/
│   ├── auth.js
│   ├── menu.js
│   ├── content.js
│   └── banner.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── menu.js
│   ├── content.js
│   └── banner.js
│
├── services/
│   ├── authService.js
│   ├── menu.js
│   ├── content.js
│   ├── banner.js
│   └── image.js
│
└── app.js

server.js
```

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Supabase
```

HTTP 요청 처리와 데이터 접근 로직을 분리하여 기능이 추가되더라도 기존 계층 구조를 유지할 수 있도록 구성했습니다.

---

## 🚀 Getting Started

### Installation

```bash
yarn
```

### Environment Variables

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
PORT=3000

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_KEY

JWT_SECRET=YOUR_JWT_SECRET
```

> 실제 환경변수와 Secret Key는 Repository에 포함하지 않습니다.

### Development

```bash
yarn dev
```

기본 개발 서버:

```text
http://localhost:3000
```

---

## 🔗 Related Projects

본 API는 하나의 CMS 서비스를 구성하는 Admin / Homepage 프로젝트와 함께 사용됩니다.

| Repository | Role |
| --- | --- |
| **CMS Admin** | React + TypeScript 기반 관리자 Front-end |
| **CMS API** | Node.js + Express 기반 REST API |
| **Homepage** | Next.js + TypeScript 기반 사용자 홈페이지 |

```text
React Admin ──────┐
                  │
                  ▼
             Node.js API
                  │
            ┌─────┴─────┐
            ▼           ▼
       PostgreSQL     Storage
            │           │
            └─────┬─────┘
                  ▼
               Supabase
                  ▲
                  │
Next.js Homepage ─┘
```