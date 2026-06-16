"""
Gooten API Integration for ArtShift
====================================

Replaces Printful with Gooten (api.print.io) as the print-on-demand fulfillment backend.
No Cloudflare JS challenges — plain requests library works fine.

Authentication:
  - RecipeID: public key passed as URL query param `recipeid`
  - PartnerBillingKey: private key passed in order/payment request bodies

Endpoints implemented:
  GET  /api/gooten/products    — catalog grouped by category
  GET  /api/gooten/variants    — SKU variants for a product
  POST /api/gooten/preview     — generate product mockup image
  POST /api/gooten/shipping    — shipping price estimate
  POST /api/gooten/orders      — submit order
  GET  /api/gooten/orders      — search / list orders
  POST /api/gooten/webhook     — incoming shipment status events
"""

import os
import time
import logging
import requests
from flask import Blueprint, request, jsonify

# ── Config ─────────────────────────────────────────────────────────────────
GOOTEN_RECIPE_ID = os.environ.get("GOOTEN_RECIPE_ID", "2c9ed314-da42-4c32-9c0e-c1705aa501c3")
GOOTEN_PARTNER_BILLING_KEY = os.environ.get("GOOTEN_PARTNER_BILLING_KEY", "")
GOOTEN_BASE = "https://api.print.io"
BLUEPRINT_NAME = "gooten"

logger = logging.getLogger("artshift.gooten")

# ── Blueprint ─────────────────────────────────────────────────────────────
bp = Blueprint(BLUEPRINT_NAME, __name__)

# ── Helpers ───────────────────────────────────────────────────────────────

def _call_api(method: str, path: str, data: dict = None, params: dict = None,
              timeout: int = 20) -> dict:
    """Call Gooten REST API. Returns {ok, data} or {ok:False, error}."""
    url = f"{GOOTEN_BASE}{path}"
    if params is None:
        params = {}
    params.setdefault("recipeid", GOOTEN_RECIPE_ID)

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    logger.info(f"[Gooten] {method} {url}")
    start = time.time()

    try:
        if method == "GET":
            resp = requests.get(url, params=params, headers=headers, timeout=timeout)
        elif method == "POST":
            resp = requests.post(url, json=data, params=params, headers=headers, timeout=timeout)
        elif method == "PUT":
            resp = requests.put(url, json=data, params=params, headers=headers, timeout=timeout)
        elif method == "DELETE":
            resp = requests.delete(url, params=params, headers=headers, timeout=timeout)
        else:
            return {"ok": False, "error": f"Unsupported method: {method}"}

        elapsed = time.time() - start
        logger.info(f"[Gooten] {method} {url} -> {resp.status_code} ({elapsed:.2f}s)")

        if resp.status_code == 204:
            return {"ok": True, "data": {}}

        body = resp.json() if resp.text else {}
        if body.get("HadError"):
            return {"ok": False, "error": body.get("Errors", [{}])[0].get("ErrorMessage", "Unknown"),
                    "code": body.get("ErrorReferenceCode", "")}

        if resp.status_code in (200, 201):
            return {"ok": True, "data": body}
        else:
            logger.error(f"[Gooten] Error {resp.status_code}: {resp.text[:500]}")
            return {"ok": False, "error": f"HTTP {resp.status_code}", "details": resp.text[:300]}

    except Exception as e:
        logger.error(f"[Gooten] Request failed: {e}", exc_info=True)
        return {"ok": False, "error": str(e)}


# ── Product Catalog ───────────────────────────────────────────────────────
#
# Gooten Products endpoint (GET /api/v/5/source/api/products/) returns all products
# under the current Recipe with numeric IDs. Key findings for ArtShift products:
#
# Product            | ID | Brand/Model                          | Sample SKU
# ───────────────────┼────┼──────────────────────────────────────┼────────────────────────────────────────────
# Hoodie             | 85 | Gildan 18500 Pullover Hoodie          | Apparel-DTG-Hoodie-Gildan-18500-*-*-*-*
# Sweatshirt         | 145| American Apparel F496 Drop Shoulder    | Apparel-DTG-Sweatshirt-AA-F496-*-*-*-*
# T-Shirt            | 40 | Next Level 3900 The Boyfriend Tee     | Apparel-DTG-TShirt-NL-3900-*-*-*-*
# Cap (Trucker)      | 460| Richardson 113 Foamie Trucker Cap     | (available via headwear API)
# Cap (Snapback)     | 459| Richardson 256 Umpqua Snapback Cap    | (available via headwear API)
# Mug                | 186| Accent Mugs 11oz                      | (available via accessories API)
# Phone Case         | 57 | Premium Phone Case (multi-brand)      | PremiumPhoneCase-*-*-*
#
# Each product has many SKU variants (size × color × print_position).
# The /variants endpoint accepts the numeric productId from this map.
PRODUCT_MAP = {
    "hoodie": {
        "name": "Pullover Hoodie",
        "brand": "Gildan 18500",
        "product_id": 85,
        "base_sku": "Apparel-DTG-Hoodie-Gildan-18500",
        "price": 21.99,
        "available": True,
    },
    "sweatshirt": {
        "name": "Drop Shoulder Pullover Sweatshirt",
        "brand": "American Apparel F496",
        "product_id": 145,
        "base_sku": "Apparel-DTG-Sweatshirt-AA-F496",
        "price": 19.99,
        "available": True,
    },
    "tshirt": {
        "name": "The Boyfriend Tee",
        "brand": "Next Level 3900",
        "product_id": 40,
        "base_sku": "Apparel-DTG-TShirt-NL-3900",
        "price": 14.99,
        "available": True,
    },
    "hat": {
        "name": "Trucker Cap",
        "brand": "Richardson 113",
        "product_id": 460,
        "base_sku": "",
        "price": 22.10,
        "available": True,
    },
    "mug": {
        "name": "Ceramic Mug 11oz",
        "brand": "Accent Mugs",
        "product_id": 186,
        "base_sku": "",
        "price": 12.27,
        "available": True,
    },
    "phonecase": {
        "name": "Premium Phone Case",
        "brand": "Various",
        "product_id": 57,
        "base_sku": "PremiumPhoneCase",
        "price": 20.02,
        "available": True,
    },
}


@bp.route("/api/gooten/products", methods=["GET"])
def gooten_products():
    """Return ArtShift product catalog with Gooten info."""
    result = []
    for key, info in PRODUCT_MAP.items():
        entry = {
            "id": key,
            "name": info["name"],
            "brand": info.get("brand", ""),
            "product_id": info.get("product_id"),
            "base_sku": info.get("base_sku", ""),
            "price": info.get("price", 0),
            "available": info.get("available", False),
        }
        if info.get("note"):
            entry["note"] = info["note"]
        result.append(entry)
    return jsonify({"ok": True, "data": result})


@bp.route("/api/gooten/variants", methods=["GET"])
def gooten_variants():
    """
    Fetch Gooten product variants (SKUs, prices, options) for a product ID.
    Query: ?product_id=85&country=US&currency=USD
    product_id must be the numeric product ID from Gooten Products API (e.g. 85 for Hoodie).
    """
    raw_id = request.args.get("product_id", "")
    # Support both numeric ID and slug name (e.g. "hoodie" → look up in PRODUCT_MAP)
    pid = raw_id
    if not raw_id.isdigit():
        info = PRODUCT_MAP.get(raw_id)
        if info and info.get("product_id"):
            pid = str(info["product_id"])
        else:
            return jsonify({"ok": False, "error": f"Unknown product: {raw_id}"}), 400

    country = request.args.get("country", "US")
    currency = request.args.get("currency", "USD")
    if not pid:
        return jsonify({"ok": False, "error": "product_id is required"}), 400

    params = {
        "productId": pid,
        "countryCode": country,
        "currencyCode": currency,
        "page": request.args.get("page", "1"),
        "pageSize": request.args.get("pageSize", "50"),
    }
    result = _call_api("GET", "/api/v/5/source/api/productvariants/", params=params)
    return jsonify(result)


# ── Mockup Preview ────────────────────────────────────────────────────────

@bp.route("/api/gooten/preview", methods=["POST"])
def gooten_preview():
    """
    Generate a product preview (mockup) image for a given SKU + design image URL.
    POST body: { sku, image_url, template? }
    Returns: { ok: true, data: { ImageUrl: "..." } }
    """
    body = request.get_json(silent=True) or {}
    sku = body.get("sku", "").strip()
    image_url = body.get("image_url", "").strip()
    if not sku or not image_url:
        return jsonify({"ok": False, "error": "sku and image_url are required"}), 400

    payload = {
        "SKU": sku,
        "Images": [{"Image": {"Url": image_url}}],
    }
    result = _call_api("POST", "/api/v/5/source/api/productpreview/", data=payload)
    if result.get("ok"):
        images = result.get("data", {}).get("Images", [])
        image_url_out = images[0].get("Url", "") if images else ""
        result["data"] = {"image_url": image_url_out}
    return jsonify(result)


# ── Shipping Estimate ─────────────────────────────────────────────────────

@bp.route("/api/gooten/shipping", methods=["POST"])
def gooten_shipping():
    """
    Estimate shipping cost for given SKUs and destination.
    POST body: { items: [{sku, qty}], country, postal_code, currency? }
    Returns: { ok: true, data: { total, options: [...] } }
    """
    body = request.get_json(silent=True) or {}
    items = body.get("items", [])
    country = body.get("country", "US")
    postal = body.get("postal_code", "")
    currency = body.get("currency", "USD")

    if not items:
        return jsonify({"ok": False, "error": "items is required"}), 400

    payload = {
        "Items": items,
        "ShipToCountry": country,
        "ShipToPostalCode": postal,
        "CurrencyCode": currency,
    }
    result = _call_api("POST", "/api/v/5/source/api/shippingprices/", params={
        "recipeid": GOOTEN_RECIPE_ID,
    }, data=payload)
    return jsonify(result)


# ── Order Submission ──────────────────────────────────────────────────────

@bp.route("/api/gooten/orders", methods=["POST"])
def gooten_submit_order():
    """
    Submit a new order to Gooten for fulfillment.
    POST body:
    {
        shipping: { first_name, last_name, line1, city, state, country, postal, email, phone },
        items: [{ sku, quantity, image_url, price }],
        currency: "USD",
        is_test: false
    }
    """
    body = request.get_json(silent=True) or {}
    shipping = body.get("shipping", {})
    items = body.get("items", [])
    currency = body.get("currency", "USD")
    is_test = body.get("is_test", True)  # default to test mode!

    if not items or not shipping:
        return jsonify({"ok": False, "error": "shipping and items are required"}), 400

    items_price_cents = 0
    order_items = []
    for idx, item in enumerate(items):
        price_cents = int(round(item.get("price", 0) * 100))
        items_price_cents += price_cents * item.get("quantity", 1)
        order_items.append({
            "SKU": item["sku"],
            "Quantity": item.get("quantity", 1),
            "ShipType": "Standard",
            "Images": [{
                "SpaceId": "1",
                "Url": item.get("image_url", ""),
            }],
            "SourceId": f"artshift-{idx}-{int(time.time())}",
        })

    payload = {
        "ShipToAddress": {
            "FirstName": shipping.get("first_name", ""),
            "LastName": shipping.get("last_name", ""),
            "Line1": shipping.get("line1", ""),
            "Line2": shipping.get("line2", ""),
            "City": shipping.get("city", ""),
            "State": shipping.get("state", ""),
            "CountryCode": shipping.get("country", "US"),
            "PostalCode": shipping.get("postal", ""),
            "Phone": shipping.get("phone", ""),
            "Email": shipping.get("email", ""),
            "IsBusinessAddress": False,
        },
        "BillingAddress": {
            "FirstName": shipping.get("first_name", ""),
            "LastName": shipping.get("last_name", ""),
            "Line1": shipping.get("line1", ""),
            "City": shipping.get("city", ""),
            "State": shipping.get("state", ""),
            "CountryCode": shipping.get("country", "US"),
            "PostalCode": shipping.get("postal", ""),
            "Email": shipping.get("email", ""),
        },
        "Items": order_items,
        "Payment": {
            "CurrencyCode": currency,
            "PartnerBillingKey": GOOTEN_PARTNER_BILLING_KEY,
            "Total": items_price_cents,
        },
        "IsInTestMode": is_test,
        "MetaData": {
            "source": "artshift",
            "platform": "artshift-ai",
            "order_reference": body.get("reference", ""),
        },
    }

    result = _call_api("POST", "/api/v/5/source/api/orders/", data=payload)
    if result.get("ok"):
        order_data = result.get("data", {})
        result["data"] = {
            "order_id": order_data.get("Id", ""),
            "status": order_data.get("Status", "Submitted"),
            "total": order_data.get("Total", {}),
            "is_test": is_test,
        }
    return jsonify(result)


@bp.route("/api/gooten/orders", methods=["GET"])
def gooten_list_orders():
    """List Gooten orders. Query: ?id=xxx or ?search=word&start=YYYY-MM-DD&end=YYYY-MM-DD"""
    order_id = request.args.get("id", "")
    if order_id:
        params = {"id": order_id}
        result = _call_api("GET", "/api/v/5/source/api/orders/", params=params)
    else:
        params = {
            "page": request.args.get("page", "1"),
            "pageSize": request.args.get("pageSize", "20"),
        }
        start = request.args.get("start", "")
        end = request.args.get("end", "")
        search = request.args.get("search", "")
        if start:
            params["startDate"] = start
        if end:
            params["endDate"] = end
        if search:
            params["genericValues"] = search
        result = _call_api("GET", "/api/v/5/source/api/ordersearch", params=params)
    return jsonify(result)


# ── Webhook ───────────────────────────────────────────────────────────────

@bp.route("/api/gooten/webhook", methods=["POST"])
def gooten_webhook():
    """
    Receive shipment / order status updates from Gooten.
    Stores event in log for debugging.
    """
    body = request.get_json(silent=True) or {}
    logger.info(f"[Gooten Webhook] Received: {body}")
    event_type = body.get("EventType", body.get("event_type", "unknown"))
    order_id = body.get("OrderId", body.get("order_id", ""))
    logger.info(f"[Gooten Webhook] Order {order_id} -> {event_type}")

    # TODO: update local order status in database
    return jsonify({"ok": True, "received": event_type}), 200


# ── Health ────────────────────────────────────────────────────────────────

@bp.route("/api/gooten/health", methods=["GET"])
def gooten_health():
    """Check Gooten API connectivity."""
    result = _call_api("GET", "/api/v/5/source/api/countries/", timeout=10)
    if result.get("ok"):
        country_count = len(result.get("data", {}).get("Countries", []))
        return jsonify({"ok": True, "message": f"Connected. {country_count} countries available."})
    return jsonify({"ok": False, "error": result.get("error", "Unknown")})
