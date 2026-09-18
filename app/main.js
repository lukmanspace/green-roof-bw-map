import * as maplibregl
  from "https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.mjs";

import {
  Protocol,
  PMTiles
} from "https://unpkg.com/pmtiles@4.3.0/dist/index.js";

const protocol = new Protocol();

maplibregl.addProtocol(
  "pmtiles",
  protocol.tile
);

const PMTILES_URL =
  "http://localhost:8000/tiles/stuttgart.pmtiles";

const p = new PMTiles(PMTILES_URL);

protocol.add(p);

const map = new maplibregl.Map({
  container: "map",

  style: "https://tiles.openfreemap.org/styles/bright",

  center: [9.1829, 48.7758],

  zoom: 13
});

map.addControl(
  new maplibregl.NavigationControl(),
  "top-right"
);

map.on("error", (e) => {
  console.error("Map error:", e.error);
});

map.on("load", () => {

  console.log("Basemap loaded");

  map.addSource("green-roofs", {
    type: "vector",
    url: `pmtiles://${PMTILES_URL}`
  });

  map.addLayer({
    id: "green-roof-fill",

    type: "fill",

    source: "green-roofs",

    "source-layer": "green_roofs",

    paint: {
      "fill-color": "#00aa44",
      "fill-opacity": 0.75
    }
  });

  console.log("PMTiles layer added");

});