# Baden-Württemberg Green Roof Prediction Web Map

Interactive web map for visualizing green-roof predictions across Baden-Württemberg.

The application uses:

- MapLibre GL JS for web mapping
- PMTiles for large vector-tile delivery
- Cloudflare R2 for hosting the statewide PMTiles archive
- GitHub Pages for hosting the frontend
- GeoParquet / FlatGeobuf / Tippecanoe for preprocessing and tiling

## Features

- City and district selection
- F1-optimized green-roof classification
- Probability thresholds:
  - ≥ 0.85
  - ≥ 0.90
- Top prediction slices:
  - Top 1%
  - Top 2%
  - Top 5%
- Green / non-green filtering
- Continuous green-roof probability visualization
- Roof-level popup information
- Roof type and building-function labels
- Hover highlighting

## Data

The prediction source data are stored as city-level GeoParquet files.

For web visualization, the data are converted to FlatGeobuf and then to a statewide PMTiles archive.

Large generated geospatial files are not stored in this GitHub repository.

The PMTiles archive is hosted separately on Cloudflare R2.