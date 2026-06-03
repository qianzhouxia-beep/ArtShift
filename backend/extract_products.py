"""
Printful Product Extractor (Fixed v2)
======================================
Extracts detailed info for 5 Printful products.
Tries public catalog first, then authenticated sync/store endpoints.

Usage:
  PowerShell:  $env:PRINTFUL_API_KEY="your_real_key"; python extract_products.py
  CMD:         set PRINTFUL_API_KEY=your_real_key && python extract_products.py

Output:
  src/data/products.json  — Frontend-ready JSON
  products_data.json      — Full detailed JSON
  products_summary.md     — Human-readable summary
"""

import os
import json
import sys
import requests

BASE_URL = "https://api.printful.com"
PRODUCT_IDS = [436131993, 436131461, 436130984, 436130651, 436126374]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def call_api(endpoint: str, use_auth: bool = False) -> dict:
    url = f"{BASE_URL.rstrip('/')}/{endpoint.lstrip('/')}"
    h = dict(HEADERS)
    if use_auth:
        api_key = os.environ.get("PRINTFUL_API_KEY", "")
        if not api_key:
            return {"error": "PRINTFUL_API_KEY not set"}
        h["Authorization"] = f"Bearer {api_key}"

    print(f"  GET {url} [auth={use_auth}]")
    try:
        resp = requests.get(url, headers=h, timeout=30)
        print(f"  ← HTTP {resp.status_code}")

        if resp.status_code == 403:
            return {"error": "403 Forbidden — Cloudflare blocked"}
        if resp.status_code == 401:
            return {"error": "401 Unauthorized"}
        if resp.status_code == 404:
            return {"error": "404 Not Found"}
        if resp.status_code != 200:
            return {"error": f"HTTP {resp.status_code}"}

        data = resp.json()
        return data.get("result", data)

    except requests.exceptions.Timeout:
        return {"error": "Request timed out"}
    except Exception as e:
        return {"error": str(e)}


def extract_sync_product(data: dict) -> dict:
    """Extract from /sync/products/{id} response."""
    sp = data.get("sync_product", {})
    sv = data.get("sync_variants", [])
    info = {
        "id": sp.get("id"),
        "name": sp.get("name"),
        "thumbnail_url": sp.get("thumbnail_url"),
        "retail_price": sp.get("retail_price"),
        "currency": sp.get("currency", "USD"),
        "variants": [],
    }
    for v in sv:
        info["variants"].append({
            "id": v.get("id"),
            "variant_id": v.get("variant_id"),
            "name": v.get("name"),
            "size": v.get("size"),
            "color": v.get("color"),
            "price": v.get("retail_price"),
            "available": v.get("availability_status") != "discontinued",
            "files": [{"type": f.get("type"), "preview_url": f.get("preview_url")} for f in v.get("files", [])],
        })
    mockups = []
    for v in sv:
        for f in v.get("files", []):
            url = f.get("preview_url")
            if url and url not in mockups:
                mockups.append(url)
    info["mockup_urls"] = mockups
    return info


def extract_catalog_product(product: dict) -> dict:
    """Extract from /products/{id} response (public catalog)."""
    info = {
        "id": product.get("id"),
        "name": product.get("name"),
        "image": product.get("image"),
        "type": product.get("type"),
        "variants": [],
    }
    for v in product.get("variants", []):
        info["variants"].append({
            "id": v.get("catalog_variant_id") or v.get("id"),
            "name": v.get("name"),
            "size": v.get("size"),
            "color": v.get("color"),
            "price": v.get("price"),
            "available": v.get("availability_status") not in ("discontinued", "out_of_stock", None),
        })
    mockups = []
    for v in product.get("variants", []):
        for f in v.get("files", []):
            url = f.get("preview_url")
            if url and url not in mockups:
                mockups.append(url)
    info["mockup_urls"] = mockups
    return info


def generate_markdown(products: list) -> str:
    from datetime import datetime
    lines = [
        "# ArtShift — Printful Product Details",
        f"Extracted: {datetime.now().isoformat()}",
        f"Products: {len(products)}",
        "---", "",
    ]
    for p in products:
        name = p.get("name", f"#{p.get('id')}")
        lines.append(f"## {name}")
        lines.append(f"- ID: `{p.get('id')}` | Image: {p.get('image') or p.get('thumbnail_url') or 'N/A'}")
        variants = p.get("variants", [])
        lines.append(f"- Variants: {len(variants)} | Mockups: {len(p.get('mockup_urls', []))}")
        if variants:
            for v in variants[:3]:
                lines.append(f"  - `{v.get('id')}` {v.get('name')} {v.get('size')} {v.get('color')} ${v.get('price')}")
            if len(variants) > 3:
                lines.append(f"  ... +{len(variants)-3} more")
        lines.append("")
    return "\n".join(lines)


def main():
    print("=" * 60)
    print("  ArtShift — Printful Product Extractor")
    print("=" * 60)
    has_key = bool(os.environ.get("PRINTFUL_API_KEY", ""))
    print(f"\n  API Key: {'SET' if has_key else 'NOT SET (public catalog only)'}")
    print(f"  Target: {len(PRODUCT_IDS)} products")
    print()

    all_products = []
    success = 0

    for pid in PRODUCT_IDS:
        print(f"\n{'─'*50}")
        print(f"  Product ID: {pid}")
        print(f"{'─'*50}")

        product_data = None

        # Strategy 1: Try authenticated sync endpoint (for user's store products)
        if has_key:
            result = call_api(f"/sync/products/{pid}", use_auth=True)
            if "error" not in result:
                product_data = extract_sync_product(result)
                print(f"  ✅ From sync API")

        # Strategy 2: Try public catalog
        if not product_data:
            result = call_api(f"/products/{pid}", use_auth=False)
            if "error" not in result:
                product_data = extract_catalog_product(result)
                print(f"  ✅ From catalog API")
            else:
                print(f"  ❌ Not found in catalog: {result['error']}")

        if product_data:
            all_products.append(product_data)
            success += 1
            vc = len(product_data.get("variants", []))
            mc = len(product_data.get("mockup_urls", []))
            print(f"  → {product_data['name']} | {vc} variants | {mc} mockups")
        else:
            all_products.append({"id": pid, "name": f"Product #{pid}", "error": "not found", "variants": [], "mockup_urls": []})

    # Summary
    print(f"\n{'═'*60}")
    print(f"  Result: {success}/{len(PRODUCT_IDS)} products extracted")
    print(f"{'═'*60}")

    # Output
    script_dir = os.path.dirname(os.path.abspath(__file__))
    from datetime import datetime

    json_path = os.path.join(script_dir, "products_data.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"products": all_products, "extracted_at": datetime.now().isoformat()}, f, indent=2, ensure_ascii=False)
    print(f"\n  JSON: {json_path}")

    md_path = os.path.join(script_dir, "products_summary.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(generate_markdown(all_products))
    print(f"  Summary: {md_path}")

    # Frontend data
    frontend = []
    for p in all_products:
        frontend.append({
            "id": p.get("id"),
            "name": p.get("name"),
            "image": p.get("image") or p.get("thumbnail_url"),
            "mockups": p.get("mockup_urls", []),
            "variants": p.get("variants", []),
        })
    fpath = os.path.join(script_dir, "..", "src", "data", "products.json")
    os.makedirs(os.path.dirname(fpath), exist_ok=True)
    with open(fpath, "w", encoding="utf-8") as f:
        json.dump(frontend, f, indent=2, ensure_ascii=False)
    print(f"  Frontend: {fpath}")

    print(f"\n{'═'*60}")
    print("  Done!")
    print(f"{'═'*60}")


if __name__ == "__main__":
    main()
