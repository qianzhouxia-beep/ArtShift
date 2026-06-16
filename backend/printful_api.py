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
    Generate product mockup (requires Printful Files API).
    Request body: { "product_id": 123, "image_url": "https://..." }
    """
    data = request.get_json(silent=True) or {}
    result = call_printful_api("/mockups", method="POST", data=data)
    if result["ok"]:
        return jsonify(result["data"]), 201
    else:
        return jsonify(result), 502


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

