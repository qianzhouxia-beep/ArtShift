import urllib.request, json, time

products = [
    (40, 'T-Shirt'),
    (85, 'Hoodie Pullover'),
    (145, 'Sweatshirt'),
    (146, 'Tank Top'),
    (187, 'Long Sleeve'),
    (281, 'AOP Sweatshirt'),
    (282, 'AOP Zip Hoodie'),
    (280, 'AOP Pullover Hoodie'),
    (460, 'Cap Trucker'),
    (57, 'Phone Case'),
    (61, 'Mug'),
    (186, 'Accent Mug'),
    (94, 'Tote Bag'),
    (401, 'Oversized T-Shirt'),
    (268, 'Viking Tumbler'),
    (179, 'Leggings'),
    (344, 'Windbreaker Jacket'),
    (270, 'Pajamas'),
    (387, 'Denim Jacket'),
    (422, 'Oversized Long Sleeve'),
]

R = '2c9ed314-da42-4c32-9c0e-c1705aa501c3'

for pid, name in products:
    url = f'https://api.print.io/api/v/5/source/api/productvariants/?recipeid={R}&productId={pid}&countryCode=US&currencyCode=USD&page=1&pageSize=500'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=20)
        d = json.loads(resp.read().decode())
        variants = d.get('ProductVariants', [])
        colors = set()
        sizes = set()
        models = set()
        for v in variants:
            for o in v.get('Options', []):
                if o.get('Name') == 'Color':
                    colors.add(o.get('Value'))
                if o.get('Name') == 'Size':
                    sizes.add(o.get('Value'))
                if o.get('Name') == 'Model':
                    models.add(o.get('Value'))
        s_colors = ', '.join(sorted(colors))
        s_sizes = ', '.join(sorted(sizes))
        s_models = ', '.join(sorted(models))
        print(f'id={pid} {name}:')
        print(f'  {len(variants)} variants')
        print(f'  Colors: {s_colors}')
        print(f'  Sizes: {s_sizes}')
        if models:
            print(f'  Models: {s_models}')
        print()
    except Exception as e:
        print(f'id={pid} {name}: ERROR {e}\n')
    time.sleep(0.3)
