"""
ArtShift Gooten Product Catalog
================================
Curated product data extracted from Gooten API, with real factory-available
colors, sizes, and models. This file is imported by gooten_api.py to serve
the catalog to the frontend.

Last updated: 2026-06-17
Source: Gooten ProductVariants API (api.print.io)
"""

import os

# ── Color Name → Hex Mapping ──────────────────────────────────────────────
# Gooten API returns color names but not hex codes.
# This mapping covers the most common colors across all products.
COLOR_HEX_MAP = {
    # Blacks / Greys
    "Black": "#111111",
    "Deep Black": "#0A0A0A",
    "Jet Black": "#0D0D0D",
    "Vintage Black": "#1A1A1A",
    "Solid Black": "#111111",
    "Charcoal": "#36454F",
    "Dark Grey": "#4A4A4A",
    "Dark Gray": "#4A4A4A",
    "Grey Heather": "#9E9E9E",
    "Heather Grey": "#B0B0B0",
    "Heather Charcoal": "#6B6B6B",
    "Heather": "#BEBEBE",
    "Ash": "#C4C4C4",
    "Asphalt": "#5C5C5C",
    "Smoke": "#8A8A8A",
    "Steel Grey": "#71797E",
    "Sport Grey": "#8E8E8E",
    "Dark Heather": "#5A5A5A",
    "Athletic Heather": "#9CA3AF",
    "Charcoal Heather Grey": "#6D6D6D",
    "Silver": "#C0C0C0",
    "Eco Grey": "#A0A0A0",
    "Eco True Black": "#1A1A1A",
    "Black Heather": "#3D3D3D",
    "Grey Triblend": "#B8B8B8",
    "Premium Heather": "#A8A8A8",

    # Whites
    "White": "#FFFFFF",
    "Arctic White": "#FAFAFA",
    "Heather White": "#F0F0F0",
    "Cream": "#FFFDD0",
    "Ecru": "#C2B280",

    # Navy / Blues
    "Navy": "#1B2A4A",
    "Midnight Navy": "#0F1A3A",
    "Classic Navy": "#1E3A5F",
    "Oxford Navy": "#1C2D4A",
    "Night Sky Navy": "#0B1D3A",
    "Royal": "#1A3E8A",
    "Royal Blue": "#1E3A8A",
    "True Royal": "#1A3E8A",
    "Light Blue": "#87CEFA",
    "Baby Blue": "#89CFF0",
    "Sky Blue": "#7AB8D4",
    "Indigo": "#2E3A6A",
    "Indigo Blue": "#2E3A6A",
    "Solid Indigo": "#2E3A6A",
    "Tahiti Blue": "#0075C4",
    "Carolina Blue": "#56A0D3",
    "Oceanic Teal": "#006D77",
    "Arctic Blue": "#A3C6E8",
    "Midnight Blue": "#191970",
    "Cancun": "#0080A0",
    "Columbia Blue": "#9BD3DD",
    "Heather Columbia Blue": "#8BB8D0",

    # Reds
    "Red": "#CC0000",
    "Solid Red": "#CC0000",
    "Vintage Red": "#8B0000",
    "Solid Cardinal Red": "#C41E3A",
    "Cardinal Red": "#C41E3A",
    "Fire Red": "#E31837",
    "Beet Red": "#8B0000",
    "Maroon": "#800000",
    "Hot Chocolate": "#6B3A2A",

    # Greens
    "Kelly Green": "#33B864",
    "Solid Kelly Green": "#33B864",
    "Forest Green": "#1B4D3E",
    "Bottle Green": "#006A4E",
    "Irish Green": "#169B62",
    "Olive": "#556B2F",
    "Olive You Green": "#556B2F",
    "Military Green": "#4B5320",
    "Solid Military Green": "#4B5320",
    "Mint": "#3EB489",
    "Solid Mint": "#3EB489",
    "Celadon": "#ACE1AF",
    "Loden": "#4A5D23",

    # Pinks / Purples
    "Pink": "#FF69B4",
    "Light Pink": "#FFB6C1",
    "Hot Pink": "#FF69B4",
    "Solid Hot Pink": "#FF69B4",
    "Vintage Pink": "#DDA0DD",
    "Neon Pink": "#FF10F0",
    "Lavender": "#A17A9E",
    "Purple": "#800080",
    "Purple Rush": "#7B2D8E",
    "Solid Purple Rush": "#7B2D8E",
    "Lilac": "#C8A2C8",
    "Heather Purple": "#6A4C93",
    "Heather Red": "#B3446C",
    "Raspberry": "#E30B5D",
    "Pale Peach": "#FADFAD",

    # Oranges / Yellows
    "Gold": "#DAA520",
    "Sun Yellow": "#FFD700",
    "Yellow": "#FFD700",
    "Banana Cream": "#FFF5C7",
    "Orange": "#FF8C00",
    "Light Orange": "#FFB347",
    "Neon Blue": "#1B03A3",
    "Butter": "#FFF4B3",

    # Browns
    "Khaki": "#C3B091",
    "Heather Brown": "#8B7355",

    # Specialty Cap colors (two-tone)
    "White / Navy / Red": "#FFFFFF",
    "White / Navy": "#FFFFFF",
    "White / Charcoal": "#FFFFFF",
    "White / Black": "#FFFFFF",
    "White / Neon Blue / Black": "#FFFFFF",
    "Dark Orange Black": "#FF8C00",
    "Red White": "#CC0000",
    "White Black": "#FFFFFF",
    "Pale Peach Maroon": "#FADFAD",
    "Charcoal White": "#36454F",
    "Biscuit Black": "#E6C28F",
    "Loden Gold": "#4A5D23",
    "Navy Red": "#1B2A4A",

    # Long Sleeve two-tones
    "White / Neon Pink": "#FFFFFF",
    "White / Black": "#FFFFFF",
    "Black / White": "#111111",
    "White / Red": "#FFFFFF",
    "White / Asphalt": "#FFFFFF",
    "White / Kelly": "#FFFFFF",
    "White / Navy": "#FFFFFF",
    "Deep Heather / Black": "#5A5A5A",

    # Mug accent colors
    "White With Black Accents": "#FFFFFF",
    "White With Blue Accents": "#FFFFFF",
    "White With Green Accents": "#FFFFFF",
    "White With Orange Accents": "#FFFFFF",
    "White With Pink Accents": "#FFFFFF",
    "White With Red Accents": "#FFFFFF",
    "White With Yellow Accents": "#FFFFFF",
    "White With Dark Blue Accents": "#FFFFFF",
    "White With Light Blue Accents": "#FFFFFF",
    "White With Dark Green Accents": "#FFFFFF",
    "White With Light Blue Accents SC": "#FFFFFF",
    "White With Maroon Accents": "#FFFFFF",
    "White With Light Green Accents": "#FFFFFF",

    # Neons
    "Turquoise": "#40E0D0",
}

# ── ArtShift Product Catalog ──────────────────────────────────────────────
# Each product has:
#   - id: our internal slug
#   - name: display name
#   - gooten_product_id: Gooten's numeric product ID for API calls
#   - category: UI grouping
#   - icon: Material Symbols icon name
#   - price: our retail price (user-facing)
#   - gooten_cost: Gooten cost from variants API (for margin calculation)
#   - colors: list of {"name": str, "hex": str} — ONLY colors Gooten factories offer
#   - sizes: list of str — ONLY sizes Gooten factories offer
#   - models: list of str — product sub-models/styles (if applicable)
#   - requires_model: bool — whether model selection is needed for SKU formation
#   - print_placement: where the design goes ("front", "all-over", "dtg")
#   - default_model: str — default model slug for mockup

PRODUCT_CATALOG = [
    # ═══ APPAREL ═══
    {
        "id": "tshirt",
        "name": "T-Shirt",
        "gooten_product_id": 40,
        "category": "apparel",
        "category_name": "Apparel",
        "icon": "checkroom",
        "price": 34.99,
        "gooten_cost": 14.99,
        "requires_model": True,
        "default_model": "2000 Fine Jersey Short Sleeve Crew Neck",
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/05/Next-Level-7200_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Black", "hex": "#111111"}, {"name": "White", "hex": "#FFFFFF"},
            {"name": "Navy", "hex": "#1B2A4A"}, {"name": "Midnight Navy", "hex": "#0F1A3A"},
            {"name": "Charcoal", "hex": "#36454F"}, {"name": "Heather Grey", "hex": "#B0B0B0"},
            {"name": "Heather Navy", "hex": "#2A3A5A"}, {"name": "Heather Charcoal", "hex": "#6B6B6B"},
            {"name": "Heather Brown", "hex": "#8B7355"}, {"name": "Heather Green", "hex": "#5A7A5A"},
            {"name": "Heather Purple", "hex": "#6A4C93"}, {"name": "Heather Red", "hex": "#B3446C"},
            {"name": "Red", "hex": "#CC0000"}, {"name": "True Royal", "hex": "#1A3E8A"},
            {"name": "Light Blue", "hex": "#87CEFA"}, {"name": "Baby Blue", "hex": "#89CFF0"},
            {"name": "Smoke", "hex": "#8A8A8A"}, {"name": "Asphalt", "hex": "#5C5C5C"},
            {"name": "Athletic Heather", "hex": "#9CA3AF"},
        ],
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        "models": [
            "2000 Fine Jersey Short Sleeve Crew Neck",
            "3005 Short Sleeve V-Neck",
            "6004 The Favorite Tee",
            "3900 Women's The Boyfriend Tee",
            "980 Lightweight Preshrunk Crew Neck Tee",
            "DT6000 Short Sleeve Crew Neck",
        ],
    },
    {
        "id": "hoodie",
        "name": "Pullover Hoodie",
        "gooten_product_id": 85,
        "category": "apparel",
        "category_name": "Apparel",
        "icon": "apparel",
        "price": 59.99,
        "gooten_cost": 21.99,
        "requires_model": True,
        "default_model": "18500 Pullover Hoodie",
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Lane-Seven-16001_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Black", "hex": "#111111"}, {"name": "White", "hex": "#FFFFFF"},
            {"name": "Navy", "hex": "#1B2A4A"}, {"name": "Classic Navy", "hex": "#1E3A5F"},
            {"name": "Sport Grey", "hex": "#8E8E8E"}, {"name": "Grey Heather", "hex": "#9E9E9E"},
            {"name": "Dark Heather", "hex": "#5A5A5A"}, {"name": "Athletic Heather", "hex": "#9CA3AF"},
            {"name": "Charcoal", "hex": "#36454F"}, {"name": "Ash", "hex": "#C4C4C4"},
            {"name": "Red", "hex": "#CC0000"}, {"name": "Royal", "hex": "#1A3E8A"},
            {"name": "Irish Green", "hex": "#169B62"}, {"name": "Light Blue", "hex": "#87CEFA"},
            {"name": "Maroon", "hex": "#800000"}, {"name": "Indigo Blue", "hex": "#2E3A6A"},
            {"name": "Light Pink", "hex": "#FFB6C1"}, {"name": "Lavender", "hex": "#A17A9E"},
            {"name": "Kelly Heather", "hex": "#4B9B6B"},
        ],
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        "models": [
            "18500 Pullover Hoodie",
            "3719 Sponge Fleece Pullover Hoodie",
            "SS4500 Midweight Pullover Hoodie",
        ],
    },
    {
        "id": "sweatshirt",
        "name": "Sweatshirt",
        "gooten_product_id": 145,
        "category": "apparel",
        "category_name": "Apparel",
        "icon": "checkroom",
        "price": 49.99,
        "gooten_cost": 19.99,
        "requires_model": True,
        "default_model": "F496 Drop Shoulder Pullover",
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Lane-Seven-16005_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Black", "hex": "#111111"}, {"name": "White", "hex": "#FFFFFF"},
            {"name": "Jet Black", "hex": "#0D0D0D"}, {"name": "Arctic White", "hex": "#FAFAFA"},
            {"name": "Navy", "hex": "#1B2A4A"}, {"name": "Oxford Navy", "hex": "#1C2D4A"},
            {"name": "Classic Navy", "hex": "#1E3A5F"}, {"name": "Royal", "hex": "#1A3E8A"},
            {"name": "Royal Blue", "hex": "#1E3A8A"}, {"name": "Sky Blue", "hex": "#7AB8D4"},
            {"name": "Royal Heather", "hex": "#3A5A8A"},
            {"name": "Red", "hex": "#CC0000"}, {"name": "Fire Red", "hex": "#E31837"},
            {"name": "Maroon", "hex": "#800000"},
            {"name": "Sport Grey", "hex": "#8E8E8E"}, {"name": "Grey Heather", "hex": "#9E9E9E"},
            {"name": "Steel Grey", "hex": "#71797E"},
            {"name": "Kelly Green", "hex": "#33B864"}, {"name": "Bottle Green", "hex": "#006A4E"},
            {"name": "Forest Green", "hex": "#1B4D3E"},
            {"name": "Gold", "hex": "#DAA520"}, {"name": "Sun Yellow", "hex": "#FFD700"},
            {"name": "Hot Chocolate", "hex": "#6B3A2A"},
            {"name": "Eco Grey", "hex": "#A0A0A0"}, {"name": "Eco True Black", "hex": "#1A1A1A"},
            {"name": "Eco True Navy", "hex": "#1A2A4A"},
            {"name": "Heather Grey", "hex": "#B0B0B0"},
        ],
        "sizes": ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        "models": [
            "F496 Drop Shoulder Pullover",
            "18000 Crew Neck Sweatshirt",
            "SS3000 Crew Neck Sweatshirt",
            "JH030 Crew Neck Sweatshirt",
            "9575 Eco-Fleece Crew Neck Sweatshirt",
        ],
    },
    {
        "id": "tank-top",
        "name": "Tank Top",
        "gooten_product_id": 146,
        "category": "apparel",
        "category_name": "Apparel",
        "icon": "checkroom",
        "price": 29.99,
        "gooten_cost": 12.99,
        "requires_model": True,
        "default_model": "3480 Jersey Tank",
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Comfort-Colors-9360_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Black", "hex": "#111111"}, {"name": "White", "hex": "#FFFFFF"},
            {"name": "Navy", "hex": "#1B2A4A"}, {"name": "Red", "hex": "#CC0000"},
            {"name": "Gold", "hex": "#DAA520"}, {"name": "Silver", "hex": "#C0C0C0"},
            {"name": "Sport Grey", "hex": "#8E8E8E"}, {"name": "Heather Grey", "hex": "#B0B0B0"},
            {"name": "Athletic Heather", "hex": "#9CA3AF"}, {"name": "Black Heather", "hex": "#3D3D3D"},
            {"name": "Grey Triblend", "hex": "#B8B8B8"}, {"name": "Premium Heather", "hex": "#A8A8A8"},
            {"name": "Vintage Black", "hex": "#1A1A1A"}, {"name": "Heather White", "hex": "#F0F0F0"},
            {"name": "Vintage Pink", "hex": "#DDA0DD"}, {"name": "Vintage Red", "hex": "#8B0000"},
            {"name": "Dark Gray", "hex": "#4A4A4A"},
            {"name": "Indigo", "hex": "#2E3A6A"}, {"name": "Solid Indigo", "hex": "#2E3A6A"},
            {"name": "Purple Rush", "hex": "#7B2D8E"}, {"name": "Solid Purple Rush", "hex": "#7B2D8E"},
            {"name": "Mint", "hex": "#3EB489"}, {"name": "Solid Mint", "hex": "#3EB489"},
            {"name": "Tahiti Blue", "hex": "#0075C4"},
            {"name": "Banana Cream", "hex": "#FFF5C7"}, {"name": "Cancun", "hex": "#0080A0"},
            {"name": "Light Orange", "hex": "#FFB347"}, {"name": "Lilac", "hex": "#C8A2C8"},
            {"name": "Raspberry", "hex": "#E30B5D"},
            {"name": "Neon Pink", "hex": "#FF10F0"}, {"name": "Neon Blue", "hex": "#1B03A3"},
            {"name": "Solid Black", "hex": "#111111"},
            {"name": "Solid Cardinal Red", "hex": "#C41E3A"},
            {"name": "Solid Hot Pink", "hex": "#FF69B4"},
            {"name": "Solid Midnight Navy", "hex": "#0F1A3A"},
            {"name": "Solid Military Green", "hex": "#4B5320"},
            {"name": "Solid Red", "hex": "#CC0000"},
            {"name": "Solid Kelly Green", "hex": "#33B864"},
        ],
        "sizes": ["XS", "S", "M", "L", "XL", "2XL"],
        "models": [
            "3480 Jersey Tank",
            "8800 Flowy Racerback Tank",
            "2200 Ultra Cotton Tank",
            "6733 Triblend Racerback Tank",
            "8803 Womens Flowy Scoop Muscle Tank",
            "1533 Women's Tank Top SP",
        ],
    },
    {
        "id": "long-sleeve",
        "name": "Long Sleeve T-Shirt",
        "gooten_product_id": 187,
        "category": "apparel",
        "category_name": "Apparel",
        "icon": "checkroom",
        "price": 39.99,
        "gooten_cost": 16.99,
        "requires_model": True,
        "default_model": "3501 Jersey Long Sleeve Tee",
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Next-Level-3501_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Black", "hex": "#111111"}, {"name": "White", "hex": "#FFFFFF"},
            {"name": "Navy", "hex": "#1B2A4A"}, {"name": "Red", "hex": "#CC0000"},
            {"name": "Ash", "hex": "#C4C4C4"}, {"name": "Asphalt", "hex": "#5C5C5C"},
            {"name": "Charcoal", "hex": "#36454F"}, {"name": "Dark Heather", "hex": "#5A5A5A"},
            {"name": "Athletic Heather", "hex": "#9CA3AF"},
            {"name": "Cardinal Red", "hex": "#C41E3A"},
            {"name": "Carolina Blue", "hex": "#56A0D3"},
            {"name": "Celadon", "hex": "#ACE1AF"}, {"name": "Orange", "hex": "#FF8C00"},
            {"name": "Forest Green", "hex": "#1B4D3E"},
            {"name": "Vintage Black", "hex": "#1A1A1A"},
            # Two-tone colors
            {"name": "White / Neon Pink", "hex": "#FFFFFF"},
            {"name": "Black / White", "hex": "#111111"},
            {"name": "Deep Heather / Black", "hex": "#5A5A5A"},
            {"name": "White / Black", "hex": "#FFFFFF"},
            {"name": "White / Red", "hex": "#FFFFFF"},
            {"name": "White / Asphalt", "hex": "#FFFFFF"},
            {"name": "White / Kelly", "hex": "#FFFFFF"},
            {"name": "White / Navy", "hex": "#FFFFFF"},
        ],
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        "models": [
            "3501 Jersey Long Sleeve Tee",
            "1304 Adult Long Sleeve Tee",
            "2400 Ultra Cotton Adult Long Sleeve T-Shirt",
            "3200 3/4 Sleeve Baseball Tee",
            "6071 Triblend Long Sleeve Crew",
        ],
    },
    {
        "id": "oversized-tee",
        "name": "Oversized T-Shirt",
        "gooten_product_id": 401,
        "category": "apparel",
        "category_name": "Apparel",
        "icon": "checkroom",
        "price": 42.99,
        "gooten_cost": 18.99,
        "requires_model": True,
        "default_model": "AL3000 Unisex Recycled Cotton Oversized Tee",
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Bella+Canvas-3001CVC_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Black", "hex": "#111111"}, {"name": "White", "hex": "#FFFFFF"},
            {"name": "Deep Black", "hex": "#0A0A0A"}, {"name": "Cream", "hex": "#FFFDD0"},
            {"name": "Ecru", "hex": "#C2B280"}, {"name": "Midnight Blue", "hex": "#191970"},
            {"name": "Navy", "hex": "#1B2A4A"}, {"name": "Night Sky Navy", "hex": "#0B1D3A"},
            {"name": "Royal", "hex": "#1A3E8A"}, {"name": "Arctic Blue", "hex": "#A3C6E8"},
            {"name": "Red", "hex": "#CC0000"}, {"name": "Beet Red", "hex": "#8B0000"},
            {"name": "Charcoal Heather Grey", "hex": "#6D6D6D"},
            {"name": "Dark Grey", "hex": "#4A4A4A"},
            {"name": "Khaki", "hex": "#C3B091"},
            {"name": "Oceanic Teal", "hex": "#006D77"},
            {"name": "Olive", "hex": "#556B2F"}, {"name": "Olive You Green", "hex": "#556B2F"},
        ],
        "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
        "models": [
            "AL3000 Unisex Recycled Cotton Oversized Tee",
            "SHMHSS Men's Oversized Max Heavyweight Tee",
            "9580 Unisex Oversized Ultimate Heavyweight Tee",
            "5080 Mens Staple Tee",
        ],
    },

    # ═══ HEADWEAR ═══
    {
        "id": "trucker-cap",
        "name": "Trucker Cap",
        "gooten_product_id": 460,
        "category": "headwear",
        "category_name": "Headwear",
        "icon": "travel_explore",
        "price": 29.99,
        "gooten_cost": 12.00,
        "requires_model": False,
        "default_model": None,
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Richardson-113_Catalog_Photo_01-270x270.png",
        "colors": [
            {"name": "White / Navy / Red", "hex": "#FFFFFF"},
            {"name": "White / Navy", "hex": "#FFFFFF"},
            {"name": "White / Charcoal", "hex": "#FFFFFF"},
            {"name": "White / Black", "hex": "#FFFFFF"},
            {"name": "White / Neon Blue / Black", "hex": "#FFFFFF"},
            {"name": "Black", "hex": "#111111"},
            {"name": "Navy", "hex": "#1B2A4A"},
            {"name": "Charcoal", "hex": "#36454F"},
        ],
        "sizes": [],  # One size
        "models": [],
    },
    {
        "id": "snapback-cap",
        "name": "Snapback Cap",
        "gooten_product_id": 459,
        "category": "headwear",
        "category_name": "Headwear",
        "icon": "travel_explore",
        "price": 32.99,
        "gooten_cost": 13.00,
        "requires_model": False,
        "default_model": None,
        "print_placement": "front",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Richardson-256_Catalog_Photo_01-270x270.png",
        "colors": [
            {"name": "Dark Orange Black", "hex": "#FF8C00"},
            {"name": "Red White", "hex": "#CC0000"},
            {"name": "White Black", "hex": "#FFFFFF"},
            {"name": "Pale Peach Maroon", "hex": "#FADFAD"},
            {"name": "Charcoal White", "hex": "#36454F"},
            {"name": "Biscuit Black", "hex": "#E6C28F"},
            {"name": "Loden Gold", "hex": "#4A5D23"},
            {"name": "Navy Red", "hex": "#1B2A4A"},
        ],
        "sizes": [],
        "models": [],
    },

    # ═══ DRINKWARE ═══
    {
        "id": "mug",
        "name": "Accent Mug",
        "gooten_product_id": 186,
        "category": "drinkware",
        "category_name": "Drinkware",
        "icon": "coffee",
        "price": 24.99,
        "gooten_cost": 12.27,
        "requires_model": False,
        "default_model": None,
        "print_placement": "wrap",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Accent-Mug-11oz_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "White / Black Accent", "hex": "#FFFFFF"},
            {"name": "White / Blue Accent", "hex": "#FFFFFF"},
            {"name": "White / Green Accent", "hex": "#FFFFFF"},
            {"name": "White / Orange Accent", "hex": "#FFFFFF"},
            {"name": "White / Pink Accent", "hex": "#FFFFFF"},
            {"name": "White / Red Accent", "hex": "#FFFFFF"},
            {"name": "White / Yellow Accent", "hex": "#FFFFFF"},
            {"name": "White / Dark Blue Accent", "hex": "#FFFFFF"},
            {"name": "White / Light Blue Accent", "hex": "#FFFFFF"},
            {"name": "White / Dark Green Accent", "hex": "#FFFFFF"},
            {"name": "White / Maroon Accent", "hex": "#FFFFFF"},
            {"name": "White / Light Green Accent", "hex": "#FFFFFF"},
        ],
        "sizes": ["11 oz", "15 oz"],
        "models": [],
    },

    # ═══ BAGS ═══
    {
        "id": "tote-bag",
        "name": "Tote Bag",
        "gooten_product_id": 94,
        "category": "bags",
        "category_name": "Bags",
        "icon": "shopping_bag",
        "price": 39.99,
        "gooten_cost": 15.47,
        "requires_model": False,
        "default_model": None,
        "print_placement": "full",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Q-Tees-QTB_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Natural Cotton", "hex": "#F5F0E8"},
        ],
        "sizes": ["13×13 inch", "16×16 inch", "18×18 inch"],
        "models": [],
    },

    # ═══ TECH ═══
    {
        "id": "phone-case",
        "name": "Phone Case",
        "gooten_product_id": 57,
        "category": "tech",
        "category_name": "Tech",
        "icon": "smartphone",
        "price": 45.00,
        "gooten_cost": 20.02,
        "requires_model": True,
        "default_model": "iPhone 15 Pro",
        "print_placement": "full",
        "image_url": "https://www.gooten.com/wp-content/uploads/2025/04/Premium-Phone-Case_Catalog_Photo_01-270x315.png",
        "colors": [
            {"name": "Glossy Finish", "hex": "#F5F5F5"},
        ],
        "sizes": [],  # Determined by phone model
        "models": [
            "iPhone 14", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14 Pro Max",
            "iPhone 15", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15 Pro Max",
            "iPhone 16", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16 Pro Max",
            "Samsung Galaxy S22", "Samsung Galaxy S23", "Samsung Galaxy S24", "Samsung Galaxy S25",
        ],
    },
]


# ── Helper functions ───────────────────────────────────────────────────────

def get_color_hex(color_name: str) -> str:
    """Get hex code for a color name, with fallback."""
    return COLOR_HEX_MAP.get(color_name, "#888888")


def get_product_by_id(product_id: str) -> dict | None:
    """Find a product by its internal slug."""
    for p in PRODUCT_CATALOG:
        if p["id"] == product_id:
            return p
    return None


def get_products_by_category(category: str) -> list:
    """Filter products by category."""
    return [p for p in PRODUCT_CATALOG if p["category"] == category]


def get_all_categories() -> list:
    """Get list of unique category info dicts."""
    seen = {}
    for p in PRODUCT_CATALOG:
        if p["category"] not in seen:
            seen[p["category"]] = {
                "id": p["category"],
                "name": p["category_name"],
            }
    return list(seen.values())


def get_catalog_summary() -> list:
    """Return catalog without heavy fields (for listing)."""
    # Use env-based backend URL so images resolve correctly
    _backend_base = os.environ.get("ARTSHIFT_BACKEND_URL", "")
    result = []
    for p in PRODUCT_CATALOG:
        result.append({
            "id": p["id"],
            "name": p["name"],
            "category": p["category"],
            "category_name": p["category_name"],
            "icon": p["icon"],
            "price": p["price"],
            "color_count": len(p["colors"]),
            "size_count": len(p["sizes"]),
            "model_count": len(p["models"]),
            "default_model": p.get("default_model"),
            "requires_model": p.get("requires_model", False),
            "image_url": f"{_backend_base}/api/gooten/image/{p['id']}" if _backend_base else f"/api/gooten/image/{p['id']}",
        })
    return result
