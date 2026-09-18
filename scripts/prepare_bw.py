from pathlib import Path
import subprocess

SOURCE_ROOT = Path(r"D:\LGL\03 Outputs\02 Predictions")
OUTPUT_ROOT = Path(r"D:\Resume\Website\green-roof-bw-map\data\bw")

OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

# Baden-Württemberg Stadt-/Landkreise represented in your dataset
BW_AREAS = [
    "Alb-Donau-Kreis",
    "Baden-Baden",
    "Biberach",
    "Bodenseekreis",
    "Breisgau-Hochschwarzwald",
    "Böblingen",
    "Calw",
    "Emmendingen",
    "Enzkreis",
    "Esslingen",
    "Freiburg_im_Breisgau",
    "Freudenstadt",
    "Göppingen",
    "Heidelberg",
    "Heidenheim",
    "Heilbronn",
    "Hohenlohekreis",
    "Karlsruhe",
    "Konstanz",
    "Ludwigsburg",
    "Lörrach",
    "Main-Tauber-Kreis",
    "Mannheim",
    "Neckar-Odenwald-Kreis",
    "Ortenaukreis",
    "Ostalbkreis",
    "Pforzheim",
    "Rastatt",
    "Ravensburg",
    "Rems-Murr-Kreis",
    "Reutlingen",
    "Rhein-Neckar-Kreis",
    "Rottweil",
    "Schwarzwald-Baar-Kreis",
    "Schwäbisch_Hall",
    "Sigmaringen",
    "Stuttgart",
    "Tuttlingen",
    "Tübingen",
    "Ulm",
    "Waldshut",
    "Zollernalbkreis",
]

KEEP_FIELDS = ",".join([
    "roof_id",
    "building_id",
    "city",
    "area_m2",
    "slope_deg",
    "height_m",
    "roofType",
    "function",
    "proba_greenroof",
    "pred_f1",
    "pred_ge_085",
    "pred_ge_090",
    "pred_top1pct",
    "pred_top2pct",
    "pred_top5pct",
])

for area in BW_AREAS:

    src = (
        SOURCE_ROOT
        / f"city={area}"
        / f"{area}.geoparquet"
    )

    dst = OUTPUT_ROOT / f"{area}.fgb"

    if not src.exists():
        print(f"[MISSING] {src}")
        continue

    if dst.exists():
        print(f"[SKIP] {area}")
        continue

    print(f"[PROCESS] {area}")

    cmd = [
        "ogr2ogr",

        "-f",
        "FlatGeobuf",

        str(dst),
        str(src),

        area,

        "-t_srs",
        "EPSG:4326",

        "-select",
        KEEP_FIELDS,

        "-lco",
        "SPATIAL_INDEX=NO",

        "--config",
        "OGR2OGR_USE_ARROW_API",
        "NO",

        "-progress",
    ]

    result = subprocess.run(cmd)

    if result.returncode != 0:
        print(f"[FAILED] {area}")
    else:
        print(f"[DONE] {area}")

print("Finished.")