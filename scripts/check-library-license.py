import json, re, sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1], strict=False)
front = "\n".join((p.extract_text() or "") for p in reader.pages[:16])
text = re.sub(r"\s+", " ", front)
# Match an explicit whole-work license in the front matter.
scope = re.search(r"(?:this (?:book|work|text|document|publication)|licensed under|license:|licensing:).{0,400}(?:creative commons|creativecommons\.org)", text, re.I)
url = re.search(r"https?://creativecommons\.org/licenses/(by|by-sa)/(3\.0|4\.0)/?", text, re.I)
if scope and url and not re.search(r"creativecommons\.org/licenses/by-nc", scope.group(0), re.I):
    print(json.dumps({"license":url.group(0).rstrip("/")+"/","pages":len(reader.pages)}))
else:
    print(json.dumps({"license":None,"pages":len(reader.pages)}))
