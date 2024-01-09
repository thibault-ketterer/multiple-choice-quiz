
import json

# Markdown content as a string
markdown_content = open("linux.md").read()
markdown_conent = """
## Linux


#### Q4. What does this command string do?

```bash
find / -size +10M -exec ls -l {} ;
```

- [ ] It finds all files using ls -l and hands them off to the find command to display.
- [ ] It finds all files older than 10 minutes and long lists them using the ls command.
- [x] It finds all files larger than 10 MB and long lists them using the ls command.
- [ ] It uses the ls command to find all files in the filesystem matching the {} wildcard.

#### Q1. To mount a drive by its ID, what command would you use first to retrieve it?

- [ ] df -h
- [ ] listid
- [ ] ls -l
- [x] blkid

#### Q2. Linux file access control lists (ACLs) are _.

- [x] discretionary access control system permissions layered over standard Linux permissions
- [ ] mandatory access control system permissions layered over standard Linux permissions
- [ ] a type of firewall for Linux
- [ ] the same as standard Linux permissions
"""

# Function to convert markdown to JSON
def markdown_to_json(md):
    questions = []
    current_question = {}
    options = []
    correct_answer = ""
    in_code_block = False

    for line in md.split('\n'):
        if line.startswith("```"):
            in_code_block = not in_code_block
            if in_code_block:
                code_block = ""
            elif current_question:
                current_question["questionText"] += "<pre>" + code_block + "</pre>"
            continue
        elif in_code_block:
            code_block += line + "\n"
            continue
        elif line.startswith("####"):
            if current_question:
                current_question["options"] = options
                current_question["answer"] = correct_answer
                questions.append(current_question)
                options = []
            current_question = {"questionText": line[5:].strip()}
        elif line.startswith("- ["):
            option = line[6:].strip()
            if line[3] == 'x':
                correct_answer = option
            options.append(option)

    if current_question:
        current_question["options"] = options
        current_question["answer"] = correct_answer
        questions.append(current_question)

    return json.dumps(questions, indent=4)

# Convert markdown to JSON
json_output = markdown_to_json(markdown_content)
print(json_output)
