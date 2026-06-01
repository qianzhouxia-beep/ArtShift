"""
Fix duplicate import in main.py.
"""
# Read main.py
with open("main.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Remove duplicate import lines
seen_import = False
unique_lines = []
for line in lines:
    if "from printful_api import bp as printful_bp" in line:
        if seen_import:
            continue  # Skip duplicate
        seen_import = True
    unique_lines.append(line)

# Write back
with open("main.py", "w", encoding="utf-8") as f:
    f.writelines(unique_lines)

print("[OK] Duplicate import removed from main.py")
