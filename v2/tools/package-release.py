"""Create a reproducible static site from the known entry points and their assets."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

v2 = Path(__file__).resolve().parents[1]
root = v2.parent
files = ["index.html", "css/style.css", "js/calendar.js", "v2/index.html", "v2/guide.html", "v2/timeline.css"]
modules = ["app", "timeline", "selection", "chronology", "civil", "hebrew", "chinese", "chinese-years"]
files.extend(f"v2/dist/{name}.js" for name in modules)
archive = v2 / "dist/sabbath-calendar-v2.zip"
with ZipFile(archive.with_suffix(".tmp"), "w") as output:
    for name in sorted(files):
        record = ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
        record.external_attr = 0o100644 << 16
        output.writestr(record, (root / name).read_bytes(), compress_type=ZIP_DEFLATED)
archive.with_suffix(".tmp").replace(archive)
print(f"{archive.name}  SHA-256 {sha256(archive.read_bytes()).hexdigest()}")
