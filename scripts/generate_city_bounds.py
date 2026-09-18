import json
import subprocess
from pathlib import Path

DATA_DIR = Path(r"D:\Resume\Website\green-roof-bw-map\data\bw")
OUTPUT_FILE = Path(r"D:\Resume\Website\green-roof-bw-map\app\city_bounds.json")

bounds = {}

for fgb in sorted(DATA_DIR.glob("*.fgb")):

    city = fgb.stem

    result = subprocess.run(
        [
            "ogrinfo",
            "-al",
            "-so",
            str(fgb)
        ],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"[FAILED] {city}")
        continue

    extent_line = None

    for line in result.stdout.splitlines():

        if line.strip().startswith("Extent:"):
            extent_line = line.strip()
            break

    if not extent_line:
        print(f"[NO EXTENT] {city}")
        continue

    # Example:
    # Extent: (9.061137, 48.688777) - (9.303461, 48.854305)

    coords = (
        extent_line
        .replace("Extent:", "")
        .replace("(", "")
        .replace(")", "")
        .replace(" - ", ",")
        .split(",")
    )

    minx = float(coords[0].strip())
    miny = float(coords[1].strip())
    maxx = float(coords[2].strip())
    maxy = float(coords[3].strip())

    bounds[city] = [
        [minx, miny],
        [maxx, maxy]
    ]

    print(
        f"[OK] {city}: "
        f"{minx}, {miny} -> {maxx}, {maxy}"
    )


OUTPUT_FILE.write_text(
    json.dumps(
        bounds,
        indent=2,
        ensure_ascii=False
    ),
    encoding="utf-8"
)

print()
print(f"Saved:")
print(OUTPUT_FILE)