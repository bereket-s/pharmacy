import re
content = open('js/data.js', encoding='utf-8').read()
count = content.count("id: 'q_")
domains = {}
for m in re.finditer(r"domain: '(\w+)'", content):
    d = m.group(1)
    domains[d] = domains.get(d, 0) + 1
print(f'Total questions: {count}')
for d, c in sorted(domains.items(), key=lambda x: -x[1]):
    print(f'  {d}: {c}')
