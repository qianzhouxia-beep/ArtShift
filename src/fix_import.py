# 修复 App.tsx 中的重复 Globe 导入
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换重复的 Globe
content = content.replace('ArrowUp, Globe,', 'ArrowUp,')

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed duplicate Globe import')
