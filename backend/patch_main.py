"""
Patch main.py to import and register Printful API Blueprint.
"""
import re

# Read main.py
with open("main.py", "r", encoding="utf-8") as f:
    content = f.read()

# Add import after "from flask_limiter.util import get_remote_address"
import_line = "\n# Import Printful API Blueprint\nfrom printful_api import bp as printful_bp\n"
content = content.replace(
    "from flask_limiter.util import get_remote_address",
    "from flask_limiter.util import get_remote_address" + import_line
)

# Add Blueprint registration after "CORS(app)"
register_line = "\n# Register Printful API Blueprint\napp.register_blueprint(printful_bp)\n"
content = content.replace(
    "CORS(app)\n\n# -- Logging",
    "CORS(app)\n" + register_line + "\n# -- Logging"
)

# Write back
with open("main.py", "w", encoding="utf-8") as f:
    f.write(content)

print("[OK] main.py patched successfully!")
print("   - Added import: from printful_api import bp as printful_bp")
print("   - Added registration: app.register_blueprint(printful_bp)")
