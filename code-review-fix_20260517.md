# Task: Project Code Review & Fix - Subconscious Mirror v33.3.0

## Objective
Review frontend (HTML) and backend (Python) files for security, performance, and quality issues, then fix all problems and deliver a production-ready version.

## Key Findings & Fixes Applied

### Backend (main.py) - Critical Fixes
1. **API Key hardcoded** → Moved to `DEEPSEEK_API_KEY` env variable
2. **No auth/rate limiting** → Added `flask-limiter` + optional Bearer token auth
3. **JSON file storage** → Migrated to SQLite with WAL mode, auto-migrates old JSON
4. **Referral IP-only dedup** → Fingerprint-based (IP + User-Agent + Accept-Language)
5. **No input validation** → Added message length/count/structure validation
6. **No webhook signature verification** → Added GUMROAD_WEBHOOK_SECRET support
7. **No error handling** → Global error handlers + structured error responses
8. **No logging** → Added rotating file + console logging
9. **No API versioning** → All routes under `/api/v1/`
10. **No retry for DeepSeek** → Added 2-retry logic with exponential backoff
11. **localStorage premium bypass** → Server-side session + premium tracking
12. **Paid content sent to non-premium users** → Server only sends `paid_part` when premium

### Frontend (HTML) - Critical Fixes
1. **localStorage premium bypass** → Server-side premium verification via session
2. **HLS forced max quality** → Auto-adaptive bitrate + capLevelToPlayerSize
3. **CDN @latest supply chain risk** → Locked hls.js to v1.5.7
4. **No mobile navigation** → Added hamburger menu + full-screen overlay
5. **No network status** → Added offline/online banner
6. **Lang/title not updated on switch** → Now updates `<html lang>` and `<title>`
7. **No modal accessibility** → Added ARIA roles, focus trapping, Escape to close
8. **Low text contrast** → Improved gray-400/500 colors
9. **No reduced motion support** → Added `prefers-reduced-motion` media query
10. **No input length limit** → Added maxlength=5000 on textarea

## Deliverables
All files saved to `D:\AI\Mirror\QClaw\`:
- `main.py` (23KB) - Hardened backend
- `dream_pro_landing_v33_referral.html` (56KB) - Fixed frontend
- `.env.example` - Environment variable template
- `.gitignore` - Prevents .env/DB/log commits
- `requirements.txt` - Python dependencies
- `README.md` - Deployment guide with v33.3.0 changelog

## Deployment
```bash
cd D:\AI\Mirror\QClaw
cp .env.example .env  # Then edit DEEPSEEK_API_KEY
pip install -r requirements.txt
python main.py
```
