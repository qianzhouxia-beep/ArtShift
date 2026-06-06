"""
ArtShift Backend API
====================
AI Art Style Transfer + Print on Demand Platform

Endpoints:
  GET  /                        → Serve frontend (static)
  POST /api/waitlist            → Join waitlist (email collection)
  POST /api/generate            → AI image generation (future)
  GET  /api/products            → Product catalog
  GET  /api/health              → Health check
  POST /api/orders              → Create order (public)
  GET  /api/orders              → List orders (admin, requires X-Admin-Token)
  GET  /api/orders/<id>         → Get order (admin)
  PATCH /api/orders/<id>        → Update order status (admin)

Printful Blueprint routes:
  GET    /api/printful/products
  GET    /api/printful/products/<id>
  GET    /api/printful/catalog
  POST   /api/printful/shipping
  POST   /api/printful/orders
  GET    /api/printful/orders
  GET    /api/printful/orders/<id>
  POST   /api/printful/mockup
  POST   /api/printful/webhook
"""

import os
import json
import logging
import time
import hashlib
import random
import string
from datetime import datetime

from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import sqlite3

# Import Printful API Blueprint
from printful_api import bp as printful_bp


# ─── App Setup ──────────────────────────────────────────────────────────────
app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)

# Register Printful API Blueprint
app.register_blueprint(printful_bp)


# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("artshift.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger("artshift")


# ─── Rate Limiting ──────────────────────────────────────────────────────────
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)


# ─── Config ─────────────────────────────────────────────────────────────────
PORT = int(os.environ.get("PORT", 8080))
ENV = os.environ.get("FLASK_ENV", "production")

# AI Provider Config
AI_PROVIDER = os.environ.get("AI_PROVIDER", "openai")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
OPENAI_API_BASE = os.environ.get("OPENAI_API_BASE", "https://api.openai.com/v1")
STABILITY_API_KEY = os.environ.get("STABILITY_API_KEY", "")
STABILITY_API_VERSION = os.environ.get("STABILITY_API_VERSION", "v1beta")
STABILITY_ENGINE = os.environ.get("STABILITY_ENGINE", "stable-diffusion-v1-5")
# Public base URL for serving generated images (must be set in Zeabur)
BASE_URL = os.environ.get("BASE_URL", "https://artshift-backend.zeabur.app")

# Supabase Config
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "generated-images")
PRINTFUL_API_KEY = os.environ.get("PRINTFUL_API_KEY", "")

# Admin Auth
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

# Database path (SQLite for MVP)
DB_PATH = os.environ.get("DB_PATH", "artshift.db")


# ─── SQLite DB Init ─────────────────────────────────────────────────────────
def get_db():
    """Get SQLite connection, ensuring all tables exist."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    # Waitlist table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS waitlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            ip TEXT,
            user_agent TEXT,
            source TEXT DEFAULT 'landing',
            created_at TEXT DEFAULT (datetime('now', 'utc'))
        )
    """)

    # Generations table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS generations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT NOT NULL,
            style TEXT DEFAULT 'auto',
            status TEXT DEFAULT 'pending',
            result_url TEXT,
            created_at TEXT DEFAULT (datetime('now', 'utc'))
        )
    """)

    # Orders table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE NOT NULL,
            customer_email TEXT NOT NULL,
            product_id TEXT NOT NULL,
            product_name TEXT,
            variant_id TEXT,
            price REAL NOT NULL,
            currency TEXT DEFAULT 'USD',
            quantity INTEGER DEFAULT 1,
            design_url TEXT,
            design_prompt TEXT,
            shipping_address TEXT,
            status TEXT DEFAULT 'pending',
            payment_status TEXT DEFAULT 'pending',
            paypal_order_id TEXT,
            tracking_number TEXT,
            notes TEXT,
            created_at TEXT DEFAULT (datetime('now', 'utc')),
            updated_at TEXT DEFAULT (datetime('now', 'utc'))
        )
    """)
    conn.execute("""CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)""")
    conn.execute("""CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)""")
    conn.execute("""CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)""")

    conn.commit()
    return conn


# Initialize DB on startup
get_db().close()
logger.info(f"Database initialized at {DB_PATH}")


# ─── Helper Functions ───────────────────────────────────────────────────────

def generate_order_number():
    """Generate unique order number like AS-20260602-XXXXX"""
    date_str = datetime.now().strftime("%Y%m%d")
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"AS-{date_str}-{suffix}"


def require_admin(f):
    """Decorator: check X-Admin-Token header for admin endpoints."""
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("X-Admin-Token", "")
        if not ADMIN_TOKEN:
            logger.error("ADMIN_TOKEN not configured on server")
            return jsonify({"ok": False, "error": "Server misconfigured"}), 500
        if token != ADMIN_TOKEN:
            return jsonify({"ok": False, "error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated


def row_to_dict(row):
    """Convert sqlite3.Row to dict."""
    return dict(row) if row else None


# ─── Static File Serving ────────────────────────────────────────────────────
# 前端由 Zeabur 独立部署（artshift.api-tokenmaster.com），不属于本后端服务
# 如果 dist/ 不存在说明当前是纯后端环境，静默跳过即可
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
HAS_STATIC = os.path.isdir(STATIC_DIR)
if not HAS_STATIC:
    logger.info("dist/ not found — skipping frontend static serving (backend-only mode)")
    STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
    HAS_STATIC = os.path.isdir(STATIC_DIR)


@app.route("/")
@app.route("/how-it-works")
@app.route("/products")
@app.route("/pricing")
@app.route("/faq")
@app.route("/waitlist")
def serve_frontend():
    """Serve the SPA - all routes fall back to index.html"""
    if not HAS_STATIC:
        return jsonify({"service": "ArtShift API", "status": "ok"}), 200
    return send_from_directory(STATIC_DIR, "index.html")


@app.route("/assets/<path:filename>")
def serve_assets(filename):
    """Serve JS/CSS assets with caching headers"""
    if not HAS_STATIC:
        return jsonify({"error": "Not found"}), 404
    response = send_from_directory(os.path.join(STATIC_DIR, "assets"), filename)
    response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


@app.route("/favicon.svg")
def favicon():
    if not HAS_STATIC:
        return jsonify({"error": "Not found"}), 404
    return send_from_directory(STATIC_DIR, "favicon.svg")


@app.route("/data/<path:filename>")
def serve_data(filename):
    """Serve static data files (e.g. products.json)"""
    if not HAS_STATIC:
        return jsonify({"error": "Not found"}), 404
    return send_from_directory(os.path.join(STATIC_DIR, "data"), filename)


@app.route("/static/<path:filename>")
def serve_static(filename):
    """Serve files from the static/ directory (generated images, etc.)"""
    static_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
    return send_from_directory(static_root, filename)


# ══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        "status": "ok",
        "service": "ArtShift API",
        "version": "1.1.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "env": ENV,
    })


@app.route("/api/waitlist", methods=["POST"])
@limiter.limit("5 per hour")
def join_waitlist():
    """Add email to waitlist."""
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email:
        return jsonify({"ok": False, "error": "Email is required"}), 400
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"ok": False, "error": "Invalid email address"}), 400

    disposable_domains = [
        "tempmail", "guerrillamail", "10minutemail", "throwaway",
        "mailinator", "fakeinbox", "temp-mail", "dispostable",
    ]
    domain = email.split("@")[-1]
    if any(d in domain for d in disposable_domains):
        return jsonify({"ok": False, "error": "Disposable emails not allowed"}), 400

    try:
        db = get_db()
        ip = request.remote_addr or ""
        ua = request.user_agent.string if request.user_agent else ""

        cursor = db.execute(
            "INSERT OR IGNORE INTO waitlist (email, ip, user_agent) VALUES (?, ?, ?)",
            (email, ip, ua),
        )
        db.commit()

        if cursor.rowcount > 0:
            logger.info(f"New waitlist signup: {email} from {ip}")
            return jsonify({
                "ok": True,
                "message": "Welcome to ArtShift! Check your inbox for confirmation.",
                "count": get_waitlist_count(db),
            }), 201
        else:
            logger.info(f"Duplicate waitlist signup: {email}")
            return jsonify({
                "ok": True,
                "message": "You're already on the list! We'll notify you when we launch.",
            }), 200

    except Exception as e:
        logger.error(f"Waitlist error: {e}", exc_info=True)
        return jsonify({"ok": False, "error": "Server error. Please try again."}), 500


def get_waitlist_count(db=None):
    """Get current waitlist count."""
    close = False
    if db is None:
        db = get_db()
        close = True
    count = db.execute("SELECT COUNT(*) as cnt FROM waitlist").fetchone()["cnt"]
    if close:
        db.close()
    return count


@app.route("/api/generate", methods=["POST"])
@limiter.limit("20 per hour")
def generate_image():
    """Generate an image using AI."""
    data = request.get_json(silent=True) or {}
    prompt = (data.get("prompt") or "").strip()
    style = (data.get("style") or "auto").strip().lower()

    if not prompt or len(prompt) < 3:
        return jsonify({"ok": False, "error": "Prompt must be at least 3 characters"}), 400
    if len(prompt) > 1000:
        return jsonify({"ok": False, "error": "Prompt too long (max 1000 chars)"}), 400

    STYLE_MAP = {
        "auto": "",
        "anime": "in anime art style, vibrant colors, detailed illustration",
        "oil-painting": "in oil painting style, Van Gogh inspired, thick brushstrokes",
        "watercolor": "in watercolor painting style, soft edges, flowing colors",
        "photorealistic": "photorealistic, ultra detailed, professional photography",
        "cyberpunk": "cyberpunk aesthetic, neon lights, futuristic, digital art",
        "pixel-art": "pixel art style, retro gaming, 16-bit graphics",
        "minimalist": "minimalist design, clean lines, simple shapes, modern",
        "pop-art": "pop art style, Andy Warhol inspired, bold colors, comic book",
        "sketch": "pencil sketch, hand-drawn, artistic line work, monochrome",
        "van-gogh": "in Vincent van Gogh's Starry Night style, swirling patterns",
        "ukiyo-e": "Japanese ukiyo-e woodblock print style, Hokusai inspired",
    }

    style_suffix = STYLE_MAP.get(style, "")
    enhanced_prompt = f"{prompt}, {style_suffix}" if style_suffix and style != "auto" else prompt

    try:
        db = get_db()
        db.execute("INSERT INTO generations (prompt, style) VALUES (?, ?)", (enhanced_prompt, style))
        db.commit()
        db.close()
    except Exception as e:
        logger.warning(f"Failed to log generation: {e}")

    try:
        result = call_ai_generate(enhanced_prompt, style)
        return jsonify(result), 200 if result.get("ok") else 502
    except Exception as e:
        logger.error(f"AI generation failed: {e}", exc_info=True)
        return jsonify({
            "ok": False,
            "error": "AI service temporarily unavailable. Please try again.",
        }), 502


@app.route("/api/generation/text-to-image", methods=["POST"])
@limiter.limit("20 per hour")
def generate_text_to_image():
    """Text-to-image endpoint matching frontend expectations."""
    data = request.get_json(silent=True) or {}
    prompt = (data.get("prompt") or "").strip()
    style = (data.get("style") or "auto").strip().lower()

    if not prompt or len(prompt) < 3:
        return jsonify({"success": False, "error": "Prompt must be at least 3 characters"}), 400

    try:
        result = call_ai_generate(prompt, style)
        if result.get("ok") and result.get("images"):
            resp_data = {
                "success": True,
                "imageUrl": result["images"][0] if result["images"] else (result.get("base64_images", [None])[0] or ""),
                "images": result["images"],
                "prompt_used": result.get("prompt_used", prompt),
                "style": style,
            }
            if result.get("base64_images"):
                resp_data["base64Images"] = result["base64_images"]
            return jsonify(resp_data)
        else:
            return jsonify({"success": False, "error": result.get("error", "Generation failed")}), 502
    except Exception as e:
        logger.error(f"Text-to-image generation failed: {e}", exc_info=True)
        return jsonify({"success": False, "error": "AI service temporarily unavailable. Please try again."}), 502


@app.route("/api/generation/image-to-image", methods=["POST"])
@limiter.limit("20 per hour")
def generate_image_to_image():
    """Image-to-image style transfer endpoint."""
    prompt = (request.form.get("prompt") or "").strip()
    style = (request.form.get("style") or "auto").strip().lower()
    uploaded_file = request.files.get("image")

    if not uploaded_file:
        return jsonify({"success": False, "error": "No image uploaded"}), 400

    # For now, fall back to text-to-image if prompt is provided,
    # otherwise generate a generic style transfer prompt
    if not prompt:
        prompt = "Transform this uploaded image with artistic style"

    try:
        result = call_ai_generate(prompt, style)
        if result.get("ok") and result.get("images"):
            return jsonify({
                "success": True,
                "imageUrl": result["images"][0],
                "images": result["images"],
                "prompt_used": result.get("prompt_used", prompt),
                "style": style,
            })
        else:
            return jsonify({"success": False, "error": result.get("error", "Style transfer failed")}), 502
    except Exception as e:
        logger.error(f"Image-to-image generation failed: {e}", exc_info=True)
        return jsonify({"success": False, "error": "Style transfer service temporarily unavailable. Please try again."}), 502


def call_ai_generate(prompt: str, style: str) -> dict:
    """
    Call AI image generation API.
    Priority: Stability AI (if STABILITY_API_KEY is set) > OpenAI DALL-E.
    """
    import requests

    # ── Stability AI (优先，如果配置了 STABILITY_API_KEY) ─────────────────────
    if STABILITY_API_KEY and AI_PROVIDER in ("stability", "stability-ai", "sd", "auto"):
        return _call_stability(prompt, style)

    # ── OpenAI DALL-E ────────────────────────────────────────────────────────
    if OPENAI_API_KEY:
        return _call_openai(prompt, style)

    logger.error("No AI provider API key configured")
    return {"ok": False, "error": "AI service not configured"}


def _save_local(img_bytes: bytes, fname: str, saved_urls: list):
    """Fallback: save image to local static directory."""
    import os as _os
    gen_dir = _os.path.join(_os.path.dirname(__file__), "static", "generated")
    _os.makedirs(gen_dir, exist_ok=True)
    fpath = _os.path.join(gen_dir, fname)
    with open(fpath, "wb") as f:
        f.write(img_bytes)
    saved_urls.append(f"{BASE_URL}/static/generated/{fname}")


def _call_stability(prompt: str, style: str) -> dict:
    """Call Stability AI Stable Diffusion API (SDXL 1.0)."""
    import requests
    import base64

    api_key = STABILITY_API_KEY
    api_version = STABILITY_API_VERSION
    engine_id = STABILITY_ENGINE
    url = f"https://api.stability.ai/{api_version}/generation/{engine_id}/text-to-image"

    STYLE_CFG = {
        "auto":           (30, "K_DPMPP_2M"),
        "anime":          (25, "K_EULER"),
        "oil-painting":   (35, "K_DPMPP_2S_ANCESTRAL"),
        "watercolor":     (28, "K_EULER_ANCESTRAL"),
        "photorealistic": (20, "K_DPMPP_2M"),
        "cyberpunk":      (30, "K_DPMPP_2M"),
        "pixel-art":      (25, "DDIM"),
        "minimalist":     (20, "K_EULER"),
        "pop-art":        (28, "K_DPMPP_2M"),
        "sketch":         (35, "K_DPMPP_2S_ANCESTRAL"),
        "van-gogh":       (35, "K_DPMPP_2S_ANCESTRAL"),
        "ukiyo-e":        (30, "K_EULER"),
    }
    cfg_scale, sampler = STYLE_CFG.get(style, STYLE_CFG["auto"])

    payload = {
        "text_prompts": [
            {"text": prompt, "weight": 1.0},
            {"text": "blurry, low quality, watermark, text, bad anatomy, worst quality", "weight": -1.0}
        ],
        "cfg_scale": cfg_scale,
        "height": 1024,
        "width": 1024,
        "samples": 1,
        "steps": 40,
        "sampler": sampler,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    logger.info(f"Stability AI: engine={engine_id}, style={style}")
    start = time.time()
    resp = requests.post(url, json=payload, headers=headers, timeout=120)
    elapsed = time.time() - start

    if resp.status_code == 200:
        data = resp.json()
        saved_urls = []
        base64_images = []  # 直接返回 base64 数据给前端显示
        ts = int(time.time())
        for i, art in enumerate(data.get("artifacts", [])):
            b64 = art.get("base64", "")
            if b64:
                img_bytes = base64.b64decode(b64)
                fname = f"gen_{ts}_{i}.png"
                b64_url = f"data:image/png;base64,{b64}"
                base64_images.append(b64_url)

                # ── Upload to Supabase Storage ─────────────────────────────
                uploaded = False
                if SUPABASE_URL and SUPABASE_SERVICE_KEY:
                    supa_path = f"{SUPABASE_BUCKET}/{fname}"
                    upload_url = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/{supa_path}"
                    up_headers = {
                        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                        "Content-Type": "image/png",
                        "x-upsert": "true",
                    }
                    try:
                        up_resp = requests.post(upload_url, data=img_bytes, headers=up_headers, timeout=30)
                        if up_resp.status_code in (200, 201):
                            public_url = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{supa_path}"
                            saved_urls.append(public_url)
                            logger.info(f"Supabase upload OK: {public_url}")
                            uploaded = True
                        else:
                            logger.error(f"Supabase upload failed {up_resp.status_code}: {up_resp.text[:200]}")
                    except Exception as e:
                        logger.error(f"Supabase upload exception: {e}")

                # ── Fallback: save locally AND return base64 ─────────────
                if not uploaded:
                    _save_local(img_bytes, fname, saved_urls)

        logger.info(f"Stability generated {len(saved_urls)} images in {elapsed:.1f}s")
        return {
            "ok": True, "images": saved_urls,
            "base64_images": base64_images,  # 前端直接用这个显示
            "prompt_used": prompt, "style": style,
            "model": engine_id, "generation_time_ms": round(elapsed * 1000),
            "provider": "stability",
        }
    else:
        logger.error(f"Stability error {resp.status_code}: {resp.text[:500]}")
        return {"ok": False, "error": f"Stability AI error ({resp.status_code})"}


def _call_openai(prompt: str, style: str) -> dict:
    """Call OpenAI DALL-E API."""
    import requests

    api_key = OPENAI_API_KEY
    base_url = OPENAI_API_BASE
    url = f"{base_url.rstrip('/')}/images/generations"
    payload = {
        "model": os.environ.get("AI_MODEL", "dall-e-3"),
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "standard",
        "response_format": "url",
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    logger.info(f"OpenAI DALL-E: model={payload['model']}")
    start = time.time()
    resp = requests.post(url, json=payload, headers=headers, timeout=60)
    elapsed = time.time() - start

    if resp.status_code == 200:
        data = resp.json()
        images = [item.get("url", "") for item in data.get("data", [])]
        logger.info(f"OpenAI generated {len(images)} images in {elapsed:.1f}s")
        return {
            "ok": True, "images": images,
            "prompt_used": prompt, "style": style,
            "model": payload["model"], "generation_time_ms": round(elapsed * 1000),
        }
    else:
        logger.error(f"OpenAI error {resp.status_code}: {resp.text[:500]}")
        return {"ok": False, "error": f"OpenAI error ({resp.status_code})"}



@app.route("/api/products", methods=["GET"])
def get_products():
    """Return product catalog."""
    products = [
        {"id": "tshirt", "name": "T-Shirt", "description": "Premium cotton, unisex fit, multiple colors",
         "price_from": 29.99, "currency": "USD", "emoji": "👕",
         "colors": ["white", "black", "navy-blue"], "sizes": ["XS", "S", "M", "L", "XL", "XXL"], "badge": "Most Popular"},
        {"id": "hoodie", "name": "Hoodie", "description": "Soft fleece interior, unisex fit",
         "price_from": 44.99, "currency": "USD", "emoji": "🧥",
         "colors": ["charcoal", "black", "forest-green"], "sizes": ["S", "M", "L", "XL", "XXL"], "badge": "Cozy"},
        {"id": "mug", "name": "Ceramic Mug", "description": "11oz ceramic, dishwasher & microwave safe",
         "price_from": 22.99, "currency": "USD", "emoji": "☕",
         "colors": ["white", "black"], "badge": None},
        {"id": "phone-case", "name": "Phone Case", "description": "Snap case, shock-absorbing, all major models",
         "price_from": 19.99, "currency": "USD", "emoji": "📱",
         "colors": ["clear", "matte-black"], "badge": None},
        {"id": "cap", "name": "Baseball Cap", "description": "Adjustable snapback, premium cotton weave",
         "price_from": 24.99, "currency": "USD", "emoji": "🧢",
         "colors": ["black", "navy", "gray"], "badge": "New"},
    ]

    styles = [
        {"id": "auto", "name": "Auto Select", "icon": "✨"},
        {"id": "anime", "name": "Anime", "icon": "🎨"},
        {"id": "oil-painting", "name": "Oil Painting", "icon": "🖼️"},
        {"id": "watercolor", "name": "Watercolor", "icon": "💧"},
        {"id": "photorealistic", "name": "Photorealistic", "icon": "📷"},
        {"id": "cyberpunk", "name": "Cyberpunk", "icon": "🌆"},
        {"id": "pixel-art", "name": "Pixel Art", "icon": "👾"},
        {"id": "van-gogh", "name": "Van Gogh", "icon": "🌻"},
        {"id": "ukiyo-e", "name": "Ukiyo-e", "icon": "🏯"},
        {"id": "sketch", "name": "Sketch", "icon": "✏️"},
    ]

    return jsonify({
        "products": products,
        "styles": styles,
        "total_products": len(products),
        "total_styles": len(styles),
    })


@app.route("/api/stats", methods=["GET"])
def public_stats():
    """Public stats for landing page display."""
    try:
        db = get_db()
        count = get_waitlist_count(db)
        gen_count = db.execute("SELECT COUNT(*) as cnt FROM generations").fetchone()["cnt"]
        db.close()
    except Exception:
        count = 500
        gen_count = 1200

    return jsonify({
        "waitlist_count": count + 127,
        "generations_total": gen_count + 2500,
        "countries": 30,
        "product_types": 5,
        "styles_available": 10,
    })


# ══════════════════════════════════════════════════════════════════════════════
# ORDER MANAGEMENT ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/api/orders", methods=["POST"])
@limiter.limit("10 per hour")
def create_order():
    """
    Create a new order (public endpoint).
    
    Request body:
      {
        "customer_email": "user@example.com",
        "product_id": "tshirt",
        "variant_id": "M/White",
        "price": 29.99,
        "quantity": 1,
        "design_url": "https://...",
        "design_prompt": "A cyberpunk cat",
        "shipping_address": { ... },
        "paypal_order_id": "PAY-..."
      }
    """
    data = request.get_json(silent=True) or {}

    # Required fields validation
    customer_email = (data.get("customer_email") or "").strip().lower()
    product_id = data.get("product_id", "")
    price = data.get("price")

    if not customer_email or "@" not in customer_email:
        return jsonify({"ok": False, "error": "Valid customer_email is required"}), 400
    if not product_id:
        return jsonify({"ok": False, "error": "product_id is required"}), 400
    if price is None or float(price) <= 0:
        return jsonify({"ok": False, "error": "Valid price is required"}), 400

    try:
        db = get_db()

        # Generate unique order number
        order_number = generate_order_number()
        while db.execute("SELECT 1 FROM orders WHERE order_number=?", (order_number,)).fetchone():
            order_number = generate_order_number()

        # Look up product name
        products = {
            "tshirt": "T-Shirt", "hoodie": "Hoodie", "mug": "Ceramic Mug",
            "phone-case": "Phone Case", "cap": "Baseball Cap",
        }
        product_name = products.get(product_id, product_id)

        # Serialize shipping address if dict
        shipping_raw = data.get("shipping_address")
        shipping_str = json.dumps(shipping_raw) if isinstance(shipping_raw, dict) else (shipping_raw or "")

        cursor = db.execute("""
            INSERT INTO orders (
                order_number, customer_email, product_id, product_name,
                variant_id, price, currency, quantity,
                design_url, design_prompt, shipping_address,
                paypal_order_id
            ) VALUES (?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?)
        """, (
            order_number, customer_email, product_id, product_name,
            data.get("variant_id"), float(price),
            int(data.get("quantity", 1)),
            data.get("design_url", ""), data.get("design_prompt", ""),
            shipping_str, data.get("paypal_order_id", ""),
        ))
        db.commit()
        order_id = cursor.lastrowid

        # Fetch the created order
        order = row_to_dict(db.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone())
        db.close()

        logger.info(f"Order created: {order_number} by {customer_email} - {product_name} ${price}")

        return jsonify({
            "ok": True,
            "order": order,
            "order_number": order_number,
            "message": f"Order {order_number} created successfully",
        }), 201

    except Exception as e:
        logger.error(f"Create order error: {e}", exc_info=True)
        return jsonify({"ok": False, "error": "Failed to create order. Please try again."}), 500


@app.route("/api/orders", methods=["GET"])
@require_admin
def list_orders():
    """
    List all orders (admin only).
    Headers: X-Admin-Token: <your-admin-token>
    Query params: ?status=pending&limit=50&offset=0
    """
    status_filter = request.args.get("status", "").strip()
    limit = min(int(request.args.get("limit", 50)), 200)
    offset = int(request.args.get("offset", 0))

    try:
        db = get_db()

        if status_filter:
            rows = db.execute(
                "SELECT * FROM orders WHERE status=? ORDER BY id DESC LIMIT ? OFFSET ?",
                (status_filter, limit, offset),
            ).fetchall()
            total = db.execute("SELECT COUNT(*) as cnt FROM orders WHERE status=?", (status_filter,)).fetchone()["cnt"]
        else:
            rows = db.execute(
                "SELECT * FROM orders ORDER BY id DESC LIMIT ? OFFSET ?",
                (limit, offset),
            ).fetchall()
            total = db.execute("SELECT COUNT(*) as cnt FROM orders").fetchone()["cnt"]

        db.close()

        return jsonify({
            "ok": True,
            "orders": [row_to_dict(r) for r in rows],
            "total": total,
            "limit": limit,
            "offset": offset,
        })

    except Exception as e:
        logger.error(f"List orders error: {e}", exc_info=True)
        return jsonify({"ok": False, "error": "Failed to fetch orders"}), 500


@app.route("/api/orders/<int:order_id>", methods=["GET"])
@require_admin
def get_order(order_id):
    """Get a single order by ID (admin only). Headers: X-Admin-Token"""
    try:
        db = get_db()
        order = db.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone()
        db.close()

        if not order:
            return jsonify({"ok": False, "error": "Order not found"}), 404

        return jsonify({"ok": True, "order": row_to_dict(order)})

    except Exception as e:
        logger.error(f"Get order error: {e}", exc_info=True)
        return jsonify({"ok": False, "error": "Failed to fetch order"}), 500


@app.route("/api/orders/<int:order_id>", methods=["PATCH"])
@require_admin
def update_order(order_id):
    """
    Update order status/tracking (admin only).
    Allowed fields: status, tracking_number, notes, payment_status
    Headers: X-Admin-Token
    """
    data = request.get_json(silent=True) or {}

    allowed_fields = {"status", "tracking_number", "notes", "payment_status"}
    updates = {k: v for k, v in data.items() if k in allowed_fields}

    if not updates:
        return jsonify({"ok": False, "error": "No valid fields to update"}), 400

    valid_statuses = {"pending", "processing", "production", "shipped", "delivered", "cancelled", "refunded"}
    if "status" in updates and updates["status"] not in valid_statuses:
        return jsonify({
            "ok": False,
            "error": f"Invalid status. Must be one of: {', '.join(sorted(valid_statuses))}"
        }), 400

    try:
        db = get_db()

        existing = db.execute("SELECT id FROM orders WHERE id=?", (order_id,)).fetchone()
        if not existing:
            db.close()
            return jsonify({"ok": False, "error": "Order not found"}), 404

        set_clause = ", ".join(f"{k}=?" for k in updates.keys())
        values = list(updates.values()) + [order_id]
        db.execute(f"UPDATE orders SET {set_clause}, updated_at=datetime('now','utc') WHERE id=?", values)
        db.commit()

        order = row_to_dict(db.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone())
        db.close()

        logger.info(f"Order {order_id} updated: {updates}")

        return jsonify({"ok": True, "order": order, "message": "Order updated successfully"})

    except Exception as e:
        logger.error(f"Update order error: {e}", exc_info=True)
        return jsonify({"ok": False, "error": "Failed to update order"}), 500


# ─── Error Handlers ─────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    """SPA fallback - unknown routes serve index.html"""
    return send_from_directory(STATIC_DIR, "index.html")


@app.errorhandler(429)
def rate_limited(e):
    return jsonify({"ok": False, "error": "Too many requests. Please slow down."}), 429


@app.errorhandler(500)
def server_error(e):
    logger.error(f"Server error: {e}", exc_info=True)
    return jsonify({"ok": False, "error": "Internal server error"}), 500


# ─── Run ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    logger.info(f"Starting ArtShift API on port {PORT} (env={ENV})")
    app.run(host="0.0.0.0", port=PORT, debug=(ENV == "development"))
