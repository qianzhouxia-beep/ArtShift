"""
Printful API Integration for ArtShift
======================================

Scheme H: Use Sync API (https://sync.printful.com/) to bypass Cloudflare JS Challenge.

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
"""

import os
import time
import logging
import requests
from flask import Blueprint, request, jsonify

# ── Config ───────────────────────────────────────────────────────────────────
PRINTFUL_API_KEY = os.environ.get("PRINTFUL_API_KEY", "")
PRINTFUL_BASE_URL = "https://sync.printful.com/"  # Scheme H: Sync API
BLUEPRINT_NAME = "printful"

logger = logging.getLogger("artshift.printful")

# ── Blueprint ────────────────────────────────────────────────────────────────
bp = Blueprint(BLUEPRINT_NAME, __name__)

# ── Helpers ──────────────────────────────────────────────────────────────────

def call_printful_api(endpoint: str, method: str = "GET", data: dict = None) -> dict:
    """
    Call Printful REST API (Sync API endpoint).
    Returns parsed JSON or raises exception.
    """
    url = f"{PRINTFUL_BASE_URL.rstrip('/')}/{endpoint.lstrip('/')}"
    headers = {
        "Authorization": f"Bearer {PRINTFUL_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "ArtShift/1.0 (PrintfulIntegration)",
    }

    logger.info(f"[Printful] Calling {method} {url}")
    start = time.time()

    try:
        if method.upper() == "GET":
            resp = requests.get(url, headers=headers, timeout=15)
        elif method.upper() == "POST":
            resp = requests.post(url, json=data, headers=headers, timeout=15)
        elif method.upper() == "PUT":
            resp = requests.put(url, json=data, headers=headers, timeout=15)
        elif method.upper() == "DELETE":
            resp = requests.delete(url, headers=headers, timeout=15)
        else:
            return {"ok": False, "error": f"Unsupported method: {method}"}

        elapsed = time.time() - start
        logger.info(f"[Printful] {method} {url} → {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code in [200, 201, 204]:
            return {"ok": True, "data": resp.json().get("result", {})}
        else:
            logger.error(f"[Printful] Error {resp.status_code}: {resp.text[:500]}")
            return {"ok": False, "error": f"Printful API error ({resp.status_code})", "details": resp.text[:200]}

    except Exception as e:
        logger.error(f"[Printful] Request failed: {e}", exc_info=True)
        return {"ok": False, "error": str(e)}


# ── Routes ──────────────────────────────────────────────────────────────────

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
