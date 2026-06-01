import json
import re
import sys

with open('js/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

with open('new_questions.json', 'r', encoding='utf-8') as f:
    new_qs = json.load(f)

# Find the start and end of the QUESTIONS array
match = re.search(r'const QUESTIONS = (\[(.*?)\]);', data_js, re.DOTALL)
if not match:
    print("Could not find QUESTIONS array in data.js")
    sys.exit(1)

questions_json_str = match.group(1)

# Because it's javascript, the keys might not be quoted, but let's just append the new items 
# inside the array by injecting them before the closing bracket.
new_qs_str = json.dumps(new_qs, indent=2)

# remove the outer brackets from new_qs_str
new_qs_inner = new_qs_str[1:-1].strip()

# find the last closing bracket of the QUESTIONS array
end_idx = data_js.rfind(']', match.start(1), match.end(1))

# insert a comma if there are existing questions
if data_js[end_idx-1].strip() != '[':
    merged_js = data_js[:end_idx] + ',\n  ' + new_qs_inner + '\n' + data_js[end_idx:]
else:
    merged_js = data_js[:end_idx] + '\n  ' + new_qs_inner + '\n' + data_js[end_idx:]

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(merged_js)

print(f"Successfully added {len(new_qs)} new questions to js/data.js")
