"""
Printful API Integration for ArtShift
======================================

Uses curl_cffi (Chrome TLS fingerprint emulation) to bypass Cloudflare Bot Fight Mode
on api.printful.com. Regular 'requests' library gets blocked with CF challenge;
curl_cffi impersonates a real browser and passes through.

Endpoints implemented:
  GET  /api/printful/products
  GET  /api/printful/products/<id>
  GET  /api/printful/catalog
  POST /api/printful/shipping
  POST /api/printful/orders
  GET  /api/printful/orders
  GET  /api/printful/orders/<id>
  POST /api/printful/mockup
  POST /api/printful/webhook
  POST /api/printful/edm-nonce   (EDM -- Embedded Design Maker nonce)
"""

import os
import time
import logging
from curl_cffi import requests
from flask import Blueprint, request, jsonify

# 鈹€鈹€ Config 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
PRINTFUL_API_KEY = os.environ.get("PRINTFUL_API_KEY", "")
PRINTFUL_EDM_TOKEN = os.environ.get("PRINTFUL_EDM_TOKEN", "")  # EDM专用Token（需审批通过后获取）
BLUEPRINT_NAME = "printful"

logger = logging.getLogger("artshift.printful")

# 鈹€鈹€ Blueprint 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
bp = Blueprint(BLUEPRINT_NAME, __name__)

# 鈹€鈹€ Helpers 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

def call_printful_api(endpoint: str, method: str = "GET", data: dict = None) -> dict:
    """
    Call Printful REST API using curl_cffi (Chrome impersonation).
    Returns parsed JSON or raises exception.
    """
    url = f"https://api.printful.com/{endpoint.lstrip('/')}"
    headers = {
        "Authorization": f"Bearer {PRINTFUL_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
    }

    logger.info(f"[Printful] Calling {method} {url}")
    start = time.time()

    try:
        if method.upper() == "GET":
            resp = requests.get(url, headers=headers, timeout=15, impersonate="chrome")
        elif method.upper() == "POST":
            resp = requests.post(url, json=data, headers=headers, timeout=15, impersonate="chrome")
        elif method.upper() == "PUT":
            resp = requests.put(url, json=data, headers=headers, timeout=15, impersonate="chrome")
        elif method.upper() == "DELETE":
            resp = requests.delete(url, headers=headers, timeout=15, impersonate="chrome")
        else:
            return {"ok": False, "error": f"Unsupported method: {method}"}

        elapsed = time.time() - start
        logger.info(f"[Printful] {method} {url} 鈫?{resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code in [200, 201, 204]:
            return {"ok": True, "data": resp.json().get("result", {})}
        else:
            logger.error(f"[Printful] Error {resp.status_code}: {resp.text[:500]}")
            return {"ok": False, "error": f"Printful API error ({resp.status_code})", "details": resp.text[:200]}

    except Exception as e:
        logger.error(f"[Printful] Request failed: {e}", exc_info=True)
        return {"ok": False, "error": str(e)}


# 鈹€鈹€ Routes 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

@bp.route("/api/printful/products", methods=["GET"])
def printful_products():
    """
    Get all products from Printful catalog.
    """
    result = call_printful_api("/products")
    if result["ok"]:
        return jsonify(result["data"]), 200
    else:
        return jsonify(result), 502


@bp.route("/api/printful/products/<int:product_id>", methods=["GET"])
def printful_product_detail(product_id: int):
    """
    Get product details by ID.
    """
    result = call_printful_api(f"/products/{product_id}")
    if result["ok"]:
        return jsonify(result["data"]), 200
    else:
        return jsonify(result), 502


@bp.route("/api/printful/catalog", methods=["GET"])
def printful_catalog():
    """
    Get Printful catalog (all available products).
    """
    result = call_printful_api("/catalog-products")
    if result["ok"]:
        return jsonify(result["data"]), 200
    else:
        return jsonify(result), 502


@bp.route("/api/printful/shipping", methods=["POST"])
def printful_shipping():
    """
    Calculate shipping rates.
    Request body: { "items": [...], "recipient": {...} }
    """
    data = request.get_json(silent=True) or {}
    result = call_printful_api("/shipping/rates", method="POST", data=data)
    if result["ok"]:
        return jsonify(result["data"]), 200
    else:
        return jsonify(result), 502


@bp.route("/api/printful/orders", methods=["POST"])
def printful_create_order():
    """
    Create a new order in Printful.
    Request body: { "recipient": {...}, "items": [...], "shipping": "..." }
    """
    data = request.get_json(silent=True) or {}
    result = call_printful_api("/orders", method="POST", data=data)
    if result["ok"]:
        return jsonify(result["data"]), 201
    else:
        return jsonify(result), 502


@bp.route("/api/printful/orders", methods=["GET"])
def printful_list_orders():
    """
    List all orders.
    """
    result = call_printful_api("/orders")
    if result["ok"]:
        return jsonify(result["data"]), 200
    else:
        return jsonify(result), 502


@bp.route("/api/printful/orders/<int:order_id>", methods=["GET"])
def printful_order_detail(order_id: int):
    """
    Get order details by ID.
    """
    result = call_printful_api(f"/orders/{order_id}")
    if result["ok"]:
        return jsonify(result["data"]), 200
    else:
        return jsonify(result), 502


@bp.route("/api/printful/mockup", methods=["POST"])
def printful_generate_mockup():
    """
    Generate product mockup using Printful Mockup Generator API.
    
    Flow:
    1. Map ArtShift product slug → Printful product ID
    2. Find matching variant by color
    3. Create mockup generation task
    4. Poll for completion (up to 30s)
    5. Return mockup URL
    
    Request body: {
      "product_slug": "tshirt",
      "color": "Black",
      "size": "M",
      "image_url": "https://...",
      "placement": "front"
    }
    """
    import time as time_mockup
    
    data = request.get_json(silent=True) or {}
    product_slug = data.get("product_slug", "").strip()
    color = data.get("color", "Black").strip()
    size = data.get("size", "M").strip()
    image_url = data.get("image_url", "").strip()
    placement = data.get("placement", "front").strip()
    
    if not product_slug:
        return jsonify({"ok": False, "error": "product_slug is required"}), 400
    if not image_url:
        return jsonify({"ok": False, "error": "image_url is required"}), 400
    
    # ── Step 0: Map ArtShift slug → Printful product + variant ──
    mapping = get_printful_product_mapping(product_slug)
    if not mapping:
        return jsonify({"ok": False, "error": f"No Printful mapping for: {product_slug}"}), 400
    
    printful_product_id = mapping["product_id"]
    
    # ── Step 1: Find matching variant by color ──
    variant_id = find_variant_by_color(printful_product_id, color, size)
    if not variant_id:
        # Fallback: use default variant from mapping
        variant_id = mapping.get("default_variant_id")
        if not variant_id:
            return jsonify({"ok": False, "error": f"No variant found for {color}/{size}"}), 400
    
    logger.info(f"[Printful Mockup] product={printful_product_id}, variant={variant_id}, color={color}")
    
    # ── Step 2: Create mockup task ──
    mockup_data = {
        "variant_ids": [variant_id],
        "format": "png",
        "files": [
            {
                "placement": placement,
                "image_url": image_url,
                "position": {
                    "area_width": 1800,
                    "area_height": 2400,
                    "width": 1800,
                    "height": 2400,
                    "top": 0,
                    "left": 0,
                    "limit_to_print_area": True
                }
            }
        ]
    }
    
    create_result = call_printful_api(
        f"/mockup-generator/create-task/{printful_product_id}",
        method="POST",
        data=mockup_data
    )
    
    if not create_result["ok"]:
        logger.error(f"[Printful Mockup] Create task failed: {create_result}")
        return jsonify({"ok": False, "error": create_result.get("error", "Mockup generation failed"), "phase": "create_task"}), 502
    
    task_key = create_result["data"].get("task_key")
    if not task_key:
        return jsonify({"ok": False, "error": "No task_key in response", "phase": "create_task"}), 502
    
    logger.info(f"[Printful Mockup] Task created: {task_key}")
    
    # ── Step 3: Poll for completion ──
    max_wait = 30
    poll_interval = 2
    waited = 0
    
    while waited < max_wait:
        time_mockup.sleep(poll_interval)
        waited += poll_interval
        
        task_result = call_printful_api(f"/mockup-generator/task?task_key={task_key}")
        
        if not task_result["ok"]:
            logger.warning(f"[Printful Mockup] Poll failed: {task_result}")
            continue
        
        status = task_result["data"].get("status", "")
        logger.info(f"[Printful Mockup] Task status: {status} ({waited}s)")
        
        if status == "completed":
            mockups = task_result["data"].get("mockups", [])
            if mockups:
                mockup_url = mockups[0].get("mockup_url")
                # Prefer the extra[0].url which is often higher quality
                extra = mockups[0].get("extra", [])
                if extra:
                    mockup_url = extra[0].get("url", mockup_url)
                
                logger.info(f"[Printful Mockup] Completed: {mockup_url}")
                return jsonify({
                    "ok": True,
                    "data": {
                        "mockup_url": mockup_url,
                        "task_key": task_key,
                        "product_id": printful_product_id,
                        "variant_id": variant_id
                    }
                }), 200
            else:
                return jsonify({"ok": False, "error": "No mockups in completed task", "phase": "poll"}), 502
        
        elif status == "failed":
            error_msg = task_result["data"].get("error", "Unknown error")
            return jsonify({"ok": False, "error": error_msg, "phase": "poll"}), 502
    
    # Timeout
    return jsonify({
        "ok": False,
        "error": "Mockup generation timed out",
        "task_key": task_key,
        "phase": "poll"
    }), 504


# ── Product Mapping (ArtShift slug → Printful product) ──

PRINTFUL_PRODUCT_MAP = {
    "tshirt": {
        "product_id": 71,
        "name": "Bella+Canvas 3001 Unisex Staple T-Shirt",
        "default_variant_id": 4018,  # Black/L
    },
    "hoodie": {
        "product_id": 294,
        "name": "Bella+Canvas 3719 Unisex Pullover Hoodie",
        "default_variant_id": 9229,  # Black/L
    },
    "sweatshirt": {
        "product_id": 318,
        "name": "Champion S149 Crewneck Sweatshirt",
        "default_variant_id": 9661,  # Black/L
    },
    "tank-top": {
        "product_id": 248,
        "name": "Bella+Canvas 3480 Men's Staple Tank Top",
        "default_variant_id": 8631,  # Black/L
    },
    "long-sleeve": {
        "product_id": 356,
        "name": "Bella+Canvas 3501 Unisex Long Sleeve Tee",
        "default_variant_id": 10096,  # Black/L
    },
    "oversized-tee": {
        "product_id": 71,
        "name": "Bella+Canvas 3001 (Oversized)",
        "default_variant_id": 4018,
    },
    "trucker-cap": {
        "product_id": 596,
        "name": "Flexfit 6511 Closed-Back Trucker Cap",
        "default_variant_id": 15403,  # Black/One size
    },
    "snapback-cap": {
        "product_id": 77,
        "name": "Otto Cap 125-978 Snapback",
        "default_variant_id": 4468,  # Black/One size
    },
    "mug": {
        "product_id": 403,
        "name": "White Ceramic Mug 11oz",
        "default_variant_id": 11051,  # Black/11oz
    },
    "tote-bag": {
        "product_id": 641,
        "name": "AS Colour 1001 Cotton Tote Bag",
        "default_variant_id": 16287,  # Black/One size
    },
    "phone-case": {
        "product_id": 683,
        "name": "Tough Case for iPhone",
        "default_variant_id": 16892,  # iPhone 11 Pro Max
    },
}


def get_printful_product_mapping(slug: str):
    """Get Printful product mapping for an ArtShift product slug."""
    return PRINTFUL_PRODUCT_MAP.get(slug)


# ── Variant cache (in-memory, per-process) ──
_variant_cache: dict = {}


def find_variant_by_color(product_id: int, color_name: str, size: str = "M"):
    """
    Find a Printful variant ID matching the given color and approximate size.
    Queries the Printful Products API and caches variants per product.
    """
    cache_key = f"product_{product_id}"
    
    if cache_key not in _variant_cache:
        result = call_printful_api(f"/products/{product_id}")
        if not result["ok"]:
            logger.warning(f"[Printful] Failed to fetch variants for product {product_id}")
            return None
        _variant_cache[cache_key] = result["data"].get("variants", [])
    
    variants = _variant_cache[cache_key]
    color_lower = color_name.strip().lower()
    size_lower = size.strip().lower()
    
    # Exact match: color + size
    for v in variants:
        v_color = (v.get("color") or "").strip().lower()
        v_size = (v.get("size") or "").strip().lower()
        if v_color == color_lower and v_size == size_lower:
            return v["id"]
    
    # Partial match: color only
    for v in variants:
        v_color = (v.get("color") or "").strip().lower()
        if v_color == color_lower:
            return v["id"]
    
    # Fuzzy match: color in name
    for v in variants:
        v_color = (v.get("color") or "").strip().lower()
        if color_lower in v_color or v_color in color_lower:
            return v["id"]
    
    return None


@bp.route("/api/printful/webhook", methods=["POST"])
def printful_webhook():
    """
    Handle Printful webhook events (order status updates, etc.).
    """
    # TODO: Verify webhook signature
    event = request.get_json(silent=True) or {}
    event_type = event.get("type", "unknown")
    logger.info(f"[Printful Webhook] Received event: {event_type}")
    # Process event (update order status in DB, etc.)
    return jsonify({"ok": True}), 200


# ─── EDM (Embedded Design Maker) ─────────────────────────────────────────────

@bp.route("/api/printful/edm-nonce", methods=["POST"])
def printful_edm_nonce():
    """
    Generate an EDM nonce for the Printful Embedded Design Maker.

    The PRINTFUL_EDM_TOKEN is a dedicated token (separate from PRINTFUL_API_KEY)
    that Printful issues after EDM access is approved.

    Request body:
      { "external_product_id": "my-tshirt-001",
        "external_customer_id": null }

    Returns:
      { "ok": true, "nonce": "...", "data": {...} }
    """
    # ── Guard: EDM not configured ──────────────────────────────────────────
    if not PRINTFUL_EDM_TOKEN:
        logger.error("[Printful EDM] PRINTFUL_EDM_TOKEN not configured")
        return jsonify({
            "ok": False,
            "error": "EDM is not enabled. Configure PRINTFUL_EDM_TOKEN to activate the designer.",
        }), 503

    # ── Parse request ──────────────────────────────────────────────────────
    data = request.get_json(silent=True) or {}
    external_product_id = (data.get("external_product_id") or "").strip()
    external_customer_id = data.get("external_customer_id")  # optional, can be None/null

    if not external_product_id:
        return jsonify({
            "ok": False,
            "error": "external_product_id is required",
        }), 400

    # ── Call Printful EDM API ──────────────────────────────────────────────
    url = "https://api.printful.com/embedded-designer/nonces"
    headers = {
        "Authorization": f"Bearer {PRINTFUL_EDM_TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "application/json",
    }
    payload = {
        "external_product_id": external_product_id,
        "external_customer_id": external_customer_id,
    }

    logger.info(f"[Printful EDM] Requesting nonce for product: {external_product_id}")
    start = time.time()

    try:
        resp = requests.post(
            url, json=payload, headers=headers,
            timeout=15, impersonate="chrome",
        )
        elapsed = time.time() - start
        logger.info(f"[Printful EDM] Nonce response: {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code in (200, 201):
            result = resp.json()
            nonce_data = result.get("result", result)
            return jsonify({
                "ok": True,
                "nonce": nonce_data.get("nonce", ""),
                "data": nonce_data,
            }), 200
        else:
            logger.error(f"[Printful EDM] Error {resp.status_code}: {resp.text[:500]}")
            return jsonify({
                "ok": False,
                "error": f"Printful EDM error ({resp.status_code})",
                "details": resp.text[:300],
            }), 502

    except Exception as e:
        logger.error(f"[Printful EDM] Request failed: {e}", exc_info=True)
        return jsonify({
            "ok": False,
            "error": f"EDM service unavailable: {str(e)}",
        }), 502

