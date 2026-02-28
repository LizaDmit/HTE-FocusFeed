# FocusFeed

A TikTok-style educational video platform built with Next.js 14, featuring short vertical video reels and mini quizzes for university courses.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (Credentials provider)
- **Styling**: Tailwind CSS (Moon Dust palette)
- **State**: Zustand (client-side preferences)
- **Integrations**: AWS (S3, Transcribe, Bedrock), Featherless (Qwen), MiniMax

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker)

### Local Development

1. **Clone and install dependencies**

```bash
git clone <repo-url>
cd HTE-FocusFeed
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your values
```

3. **Start the database** (via Docker)

```bash
docker compose up db -d
```

4. **Set up Prisma**

```bash
npx prisma generate
npx prisma db push
npm run db:seed   # optional: seed mock data
```

5. **Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker (Full Stack)

```bash
docker compose up --build
```

This starts both the PostgreSQL database and the Next.js app.

## Project Structure

```
app/                  Next.js App Router pages and API routes
  feed/               Main video/quiz feed
  create/             Create video and course pages
  messages/           Chat and messaging
  profile/            User profile
  (auth)/             Login and register
  api/                REST API endpoints
components/           React components
  layout/             BottomNav, TopBar
  feed/               VideoReel, PlaybackSlider, QuizCard, modals
  create/             TopicEditor, VideoUploader
  messages/           Chat components
  profile/            Avatar, FriendSearch, CourseList, VideoGrid
  ui/                 Reusable UI primitives (Button, Modal, Input, Toggle, Tabs)
lib/                  Shared utilities
  api/                Third-party integration stubs (AWS, MiniMax, Featherless, ffmpeg)
  stores/             Zustand stores
  auth.ts             NextAuth configuration
  prisma.ts           Prisma client singleton
  mock-data.ts        Mock data for development
prisma/               Database schema and seed
```

## Mock Data Mode

Set `USE_MOCK_DATA=true` in `.env` to run the app with mock data without a database connection. This is the default for development.

Mock credentials for login:
- Username: `alice`, `bob`, or `charlie`
- Password: `password123`

## Features

- Vertical scroll video feed with snap scrolling
- Video playback slider (hover on desktop, tap on mobile)
- Quiz cards interleaved in the feed
- Like, dislike (with reason), comment, and share actions
- Course creation with PDF syllabus topic extraction
- Video upload with multi-step processing wizard
- Real-time messaging with shared video links
- User profiles with courses and videos tabs
- Friend search and management
- Customizable feed preferences (video length, content types, course visibility)

## Color Palette (Moon Dust)

| Name     | Hex       |
|----------|-----------|
| Lavender | `#D3D3FF` |
| Purple   | `#CEB5FF` |
| Sky      | `#8EC1DE` |
| Blue     | `#80A8FF` |
