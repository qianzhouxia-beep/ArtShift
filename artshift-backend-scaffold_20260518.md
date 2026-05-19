# ArtShift MVP Backend Scaffold - 2026-05-18

## Objective
Build ArtShift MVP backend service with Express + TypeScript + Prisma + Supabase + Stability AI.

## Key Decisions
1. **Express over Next.js**: Existing frontend is Vite+React, separate backend is pragmatic
2. **Prisma v5 over v7**: v7 changed datasource config format, v5 is more stable
3. **Supabase Client over Prisma for queries**: Simpler for MVP, Prisma used for schema management only

## Completed Work

### Project Structure
```
ArtShift-backend/
├── prisma/schema.prisma    # 5 models: User, Waitlist, Generation, Product, Order
├── src/
│   ├── index.ts            # Express server (port 8080)
│   ├── routes/
│   │   ├── generation.ts   # AI image generation (Stability AI API)
│   │   ├── waitlist.ts     # Email collection + count
│   │   └── auth.ts         # Signup/login/logout (Supabase Auth)
│   └── middleware/         # Reserved
├── .env.example            # Template with all required keys
├── .gitignore              # node_modules, dist, .env
├── package.json            # Scripts: dev, build, start, db:push, db:migrate, db:studio
├── tsconfig.json           # TypeScript strict mode
└── README.md               # Setup guide + API docs
```

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/generation/styles` | GET | Supported style list |
| `/api/generation/generate` | POST | AI image generation |
| `/api/waitlist` | POST | Join waitlist |
| `/api/waitlist/count` | GET | Waitlist count |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |

### Database Schema (5 tables)
- **users**: id, email, created_at, updated_at
- **waitlist**: id, email, created_at, notified
- **generations**: id, user_id, prompt, negative_prompt, style, image_url, created_at
- **products**: id, name, type, base_price, description, image_url
- **orders**: id, user_id, product_id, quantity, total_price, status (Phase 2)

### Generation Flow
1. User sends prompt + style
2. Backend enhances prompt with style preset
3. Calls Stability AI SDXL 1.0 API
4. Uploads base64 image to Supabase Storage
5. Returns public URL + saves generation record

### Build Status
- ✅ TypeScript compiles (zero errors)
- ✅ Prisma Client generated
- ✅ Git initialized with .gitignore
- ✅ node_modules excluded from Git

## Next Steps (User Action Required)
1. **Create Supabase project** at supabase.com
2. **Get Stability AI API key** at platform.stability.ai
3. **Copy .env.example → .env** and fill in credentials
4. **Run `npm run db:push`** to create database tables
5. **Create Storage bucket** named `generated-images` in Supabase
6. **Test with `npm run dev`**
7. **Push to GitHub** and deploy to Zeabur

## Known Issues
- Order-Generation relation removed for simplicity (Phase 2)
- Prisma v7 incompatible with standard `url` datasource config (pinned to v5)
- Express v5 types may have minor differences from v4
