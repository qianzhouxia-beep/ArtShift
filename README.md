# ArtShift - AI Art Style Transfer + Print on Demand

**Domain**: artshift.api-tokenmaster.com

## What is ArtShift?

Upload a photo or describe your idea. AI transforms it into stunning art — then we print it on T-shirts, hoodies, mugs, phone cases, and ship it worldwide.

**Core differentiator**: Photo-to-art style transfer (not just text-to-image). Upload your pet's photo → AI turns it into a Van Gogh painting → Print on a hoodie.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python Flask + SQLite
- **AI**: OpenAI DALL-E 3 / DeepSeek
- **Print on Demand**: Printful API
- **Payments**: Stripe
- **Hosting**: Zeabur (Tencent Cloud Singapore)
- **Domain**: `artshift.api-tokenmaster.com`

## Project Structure

```
ArtShift/
├── frontend/          # React SPA source code
│   ├── src/
│   │   └── App.tsx    # Main component
│   ├── dist/          # Built static files
│   └── ...
├── backend/
│   ├── main.py        # Flask API server
│   ├── requirements.txt
│   ├── static/        # Frontend build output (served by Flask)
│   └── artshift.db    # SQLite database (auto-created)
├── nginx/             # Nginx config (if needed)
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Serve landing page |
| POST | `/api/waitlist` | Join waitlist (email) |
| POST | `/api/generate` | AI image generation |
| GET | `/api/products` | Product catalog |
| GET | `/api/stats` | Public stats |
| GET | `/api/health` | Health check |

## Environment Variables

```env
FLASK_ENV=production
PORT=8080

# AI Provider (choose one)
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...

# Optional
AI_PROVIDER=openai          # openai | deepseek
OPENAI_API_BASE=https://api.openai.com/v1
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
AI_MODEL=dall-e-3
PRINTFUL_API_KEY=
```

## Deployment (Zeabur)

1. Push this repo to GitHub
2. Create new service in Zeabur
3. Link Git repository
4. Set environment variables in Zeabur dashboard
5. Deploy!

## Roadmap

- [x] Landing page with waitlist
- [ ] AI image generation integration
- [ ] Photo upload + style transfer UI
- [ ] Printful product catalog sync
- [ ] Stripe checkout
- [ ] User accounts & order history
- [ ] Admin dashboard
