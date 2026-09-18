import * as maplibregl
  from "https://unpkg.com/maplibre-gl@6.10.0/dist/maplibre-gl.mjs";


const boundsResponse =
  await fetch(
    "./city_bounds.json"
  );

if (!boundsResponse.ok) {
  throw new Error(
    `Failed to load city_bounds.json: ${boundsResponse.status}`
  );
}

const CITY_BOUNDS =
  await boundsResponse.json();

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {

  datasetName:
    "Baden-Württemberg",

  pmtilesUrl:
  "https://pub-e024b37823c04074937dadc30812c618.r2.dev/bw_green_roofs.pmtiles",

  center: [
    9.1829,
    48.7758
  ],

  zoom:
    13

};


// ============================================================
// CITIES / DISTRICTS
// ============================================================

const CITIES = [

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
  "Zollernalbkreis"

];


// ============================================================
// CLASSIFICATION LABELS
// ============================================================

const CLASSIFICATIONS = {

  pred_f1:
    "F1-optimized classification",

  pred_ge_085:
    "Probability ≥ 0.85",

  pred_ge_090:
    "Probability ≥ 0.90",

  pred_top1pct:
    "Top 1% predictions",

  pred_top2pct:
    "Top 2% predictions",

  pred_top5pct:
    "Top 5% predictions"

};

// ============================================================
// ROOF TYPE LOOKUP
// ============================================================

const ROOF_TYPE_LABELS = {
  "1000": "Flat roof",
  "2100": "Monopitch roof",
  "2200": "Offset monopitch roof",
  "3100": "Gable roof",
  "3200": "Hip roof",
  "3300": "Half-hip roof",
  "3400": "Mansard roof",
  "3500": "Tent roof",
  "3600": "Conical roof",
  "3700": "Dome roof",
  "3800": "Sawtooth roof",
  "3900": "Arched roof",
  "4000": "Tower roof",
  "5000": "Mixed roof form",
  "9999": "Other / non-detectable roof form"
};

// ============================================================
// BUILDING FUNCTION LOOKUP
//
// Extend this object with the remainder of your ALKIS table.
// Unknown codes are still handled safely.
// ============================================================

const FUNCTION_LABELS = {

  "31001_1000": "Residential building",
  "31001_1010": "Dwelling house",
  "31001_1020": "Residential home",
  "31001_1021": "Children's home",
  "31001_1022": "Retirement home",
  "31001_1023": "Nurses' residence",
  "31001_1024": "Student or pupil dormitory",
  "31001_1025": "School camp",

  "31001_1100": "Mixed-use building with housing",
  "31001_1110": "Residential building with community facilities",
  "31001_1120": "Residential building with trade and services",
  "31001_1121": "Residential and administration building",
  "31001_1122": "Residential and office building",
  "31001_1123": "Residential and commercial building",
  "31001_1130": "Residential building with trade and industry",
  "31001_1131": "Residential and operations building",

  "31001_1210": "Agricultural/forestry residential building",
  "31001_1220": "Agricultural/forestry residential and operations building",
  "31001_1221": "Farmhouse",
  "31001_1222": "Residential and farm building",
  "31001_1223": "Forestry house",

  "31001_1310": "Building for leisure activities",
  "31001_1311": "Holiday home",
  "31001_1312": "Weekend house",
  "31001_1313": "Garden house",

  "31001_2000": "Building for economy or trade",
  "31001_2010": "Building for trade and services",
  "31001_2020": "Office building",
  "31001_2030": "Bank",
  "31001_2040": "Insurance office",
  "31001_2050": "Commercial building",
  "31001_2051": "Department store",
  "31001_2052": "Shopping centre",
  "31001_2053": "Market hall",
  "31001_2054": "Shop",
  "31001_2055": "Kiosk",
  "31001_2056": "Pharmacy",

  "31001_2060": "Exhibition hall",

  "31001_2070": "Building for accommodation",
  "31001_2071": "Hotel, motel, guesthouse",
  "31001_2072": "Youth hostel",
  "31001_2073": "Hut with overnight accommodation",
  "31001_2074": "Campsite building",

  "31001_2080": "Building for food service",
  "31001_2081": "Restaurant",
  "31001_2082": "Hut without overnight accommodation",
  "31001_2083": "Canteen",

  "31001_2090": "Leisure and amusement facility",
  "31001_2091": "Banquet hall",
  "31001_2092": "Cinema",
  "31001_2093": "Bowling alley",
  "31001_2094": "Casino",
  "31001_2095": "Amusement arcade",

  "31001_2100": "Building for trade and industry",
  "31001_2110": "Production building",
  "31001_2111": "Factory",
  "31001_2112": "Operations building",
  "31001_2113": "Brewery",
  "31001_2114": "Distillery",
  "31001_2120": "Workshop",
  "31001_2121": "Sawmill",
  "31001_2130": "Filling station",
  "31001_2131": "Car wash / washing facility",
  "31001_2140": "Building for storage",
  "31001_2141": "Cold store",
  "31001_2142": "Storage building",
  "31001_2143": "Warehouse / storage building",
  "31001_2150": "Freight forwarding building",
  "31001_2160": "Building for research purposes",

  "31001_2200": "Other building for trade and industry",
  "31001_2210": "Mill",
  "31001_2211": "Windmill",
  "31001_2212": "Watermill",
  "31001_2213": "Pumping station",
  "31001_2220": "Weather station",

  "31001_2400": "Operations building for transport facilities",
  "31001_2410": "Operations building for road traffic",
  "31001_2411": "Road maintenance depot",
  "31001_2412": "Waiting hall",

  "31001_2420": "Operations building for rail traffic",
  "31001_2421": "Gatekeeper's house",
  "31001_2422": "Engine shed / carriage hall",
  "31001_2423": "Signal box / block post",
  "31001_2424": "Freight-yard operations building",

  "31001_2430": "Operations building for air traffic",
  "31001_2431": "Aircraft hangar",

  "31001_2440": "Operations building for shipping",
  "31001_2441": "Shipyard hall",
  "31001_2442": "Dock hall",
  "31001_2443": "Lock operations building",
  "31001_2444": "Boathouse",

  "31001_2460": "Building for parking",
  "31001_2461": "Multi-storey car park",
  "31001_2462": "Parking deck",
  "31001_2463": "Garage",
  "31001_2464": "Vehicle hall",

  "31001_2500": "Utility building",
  "31001_2501": "Building for energy supply",
  "31001_2510": "Building for water supply",
  "31001_2511": "Waterworks",
  "31001_2512": "Pumping station",
  "31001_2513": "Water tank",

  "31001_2520": "Building for electricity supply",
  "31001_2521": "Power station",
  "31001_2522": "Substation",
  "31001_2523": "Converter station",
  "31001_2527": "Reactor building",
  "31001_2528": "Turbine house",
  "31001_2529": "Boiler house",

  "31001_2540": "Telecommunications building",

  "31001_2570": "Building for gas supply",
  "31001_2571": "Gasworks",
  "31001_2580": "Heating plant",

  "31001_2600": "Building for waste disposal",
  "31001_2610": "Building for wastewater disposal",
  "31001_2611": "Sewage treatment plant building",
  "31001_2612": "Public toilet",
  "31001_2620": "Building for waste treatment",

  "31001_2700": "Building for agriculture and forestry",
  "31001_2720": "Agricultural/forestry operations building",
  "31001_2721": "Barn",
  "31001_2723": "Shed",
  "31001_2724": "Stable",
  "31001_2726": "Barn and stable",
  "31001_2727": "Livestock barn",
  "31001_2728": "Riding hall",
  "31001_2729": "Farm building",
  "31001_2732": "Alpine hut",
  "31001_2735": "Hunting lodge / hunting hut",
  "31001_2740": "Greenhouse",
  "31001_2741": "Greenhouse",
  "31001_2742": "Movable greenhouse",

  "31001_3000": "Building for public purposes",
  "31001_3010": "Administration building",
  "31001_3011": "Parliament",
  "31001_3012": "Town hall",
  "31001_3013": "Post office",
  "31001_3014": "Customs office",
  "31001_3015": "Court",
  "31001_3016": "Embassy / consulate",
  "31001_3017": "District administration",
  "31001_3018": "District government",
  "31001_3019": "Tax office",

  "31001_3020": "Building for education and research",
  "31001_3021": "General education school",
  "31001_3022": "Vocational school",
  "31001_3023": "University / college building",
  "31001_3024": "Research institute",

  "31001_3030": "Building for cultural purposes",
  "31001_3031": "Palace",
  "31001_3032": "Theatre / opera",
  "31001_3033": "Concert hall",
  "31001_3034": "Museum",
  "31001_3035": "Broadcasting / television",
  "31001_3036": "Event building",
  "31001_3037": "Library",
  "31001_3038": "Castle / fortress",

  "31001_3040": "Building for religious purposes",
  "31001_3041": "Church",
  "31001_3042": "Synagogue",
  "31001_3043": "Chapel",
  "31001_3044": "Parish / community centre",
  "31001_3045": "House of worship",
  "31001_3046": "Mosque",
  "31001_3047": "Temple",
  "31001_3048": "Monastery",

  "31001_3050": "Building for health care",
  "31001_3051": "Hospital",
  "31001_3052": "Sanatorium / nursing facility",
  "31001_3053": "Medical centre / polyclinic",
  "31001_3054": "Rescue station",

  "31001_3060": "Building for social purposes",
  "31001_3061": "Youth recreation centre",
  "31001_3062": "Recreation / club / community centre",
  "31001_3063": "Senior citizens' recreation centre",
  "31001_3064": "Homeless shelter",
  "31001_3065": "Crèche / kindergarten / day-care centre",
  "31001_3066": "Asylum seekers' home",

  "31001_3070": "Building for safety and order",
  "31001_3071": "Police station",
  "31001_3072": "Fire station",
  "31001_3073": "Barracks",
  "31001_3074": "Shelter bunker",
  "31001_3075": "Prison",

  "31001_3080": "Cemetery building",
  "31001_3081": "Funeral hall",
  "31001_3082": "Crematorium",

  "31001_3090": "Station / reception building",
  "31001_3091": "Railway station building",
  "31001_3092": "Airport terminal building",
  "31001_3094": "Underground station building",
  "31001_3095": "Suburban rail station building",
  "31001_3097": "Bus station building",
  "31001_3098": "Harbour terminal building",

  "31001_3100": "Building for public purposes with housing",

  "31001_3200": "Building for recreation",
  "31001_3210": "Building for sports",
  "31001_3211": "Sports hall / gymnasium",
  "31001_3212": "Building at sports ground",

  "31001_3220": "Bathing facility building",
  "31001_3221": "Indoor swimming pool",
  "31001_3222": "Building at open-air pool",

  "31001_3230": "Building in stadium",

  "31001_3240": "Building for spa operations",
  "31001_3241": "Bathing facility for medical purposes",
  "31001_3242": "Sanatorium",

  "31001_3260": "Building in zoo",
  "31001_3261": "Zoo entrance building",
  "31001_3262": "Aquarium / terrarium / aviary",
  "31001_3263": "Animal exhibition house",
  "31001_3264": "Stable in zoo",

  "31001_3270": "Building in botanical garden",
  "31001_3271": "Botanical garden entrance building",
  "31001_3272": "Greenhouse (botany)",
  "31001_3273": "Plant exhibition house",

  "31001_3280": "Building for other recreation facility",
  "31001_3281": "Shelter hut",

  "31001_3290": "Tourist information centre",

  "31001_9998": "Not specified based on source",

  "51001_1001": "Water tower",
  "51001_1002": "Church tower",
  "51001_1003": "Observation tower",
  "51001_1004": "Control tower",
  "51001_1005": "Cooling tower",
  "51001_1006": "Lighthouse",
  "51001_1007": "Fire lookout tower",
  "51001_1008": "Broadcast / communication tower",
  "51001_1009": "City / gate tower",
  "51001_1010": "Headframe",
  "51001_1011": "Drilling rig",
  "51001_1012": "Palace / castle tower",
  "51001_9998": "Not specified based on source",
  "51001_9999": "Other",

  "51002_1215": "Biogas plant",
  "51002_1220": "Wind turbine",
  "51002_1230": "Solar panels",
  "51002_1250": "Mast",
  "51002_1251": "Overhead line mast",
  "51002_1260": "Radio mast",
  "51002_1280": "Radio telescope",
  "51002_1290": "Chimney",
  "51002_1330": "Crane",
  "51002_1331": "Slewing crane",
  "51002_1332": "Gantry crane",
  "51002_1333": "Bridge crane",
  "51002_1350": "Blast furnace",
  "51002_1400": "Converter station",
  "51002_9999": "Other",

  "51003_1201": "Silo",
  "51003_1205": "Tank",
  "51003_1206": "Gas holder",
  "51003_9999": "Other",

  "51006_1430": "Grandstand",
  "51006_1431": "Grandstand, covered",
  "51006_1432": "Grandstand, uncovered",
  "51006_1440": "Stadium",
  "51006_1441": "Stadium, covered",
  "51006_1442": "Stadium, uncovered",
  "51006_1470": "Ski jump (inrun)",
  "51006_1490": "Graduation tower",
  "51006_9999": "Other",

  "51007_1110": "Aqueduct",
  "51007_1210": "Watchtower",
  "51007_1400": "Fortification / castle ruins",
  "51007_1500": "Historic wall",
  "51007_1510": "City wall",
  "51007_1520": "Other historic wall",
  "51007_9999": "Other",

  "51009_1610": "Roofing / cover",
  "51009_1611": "Carport",
  "51009_1700": "Wall",
  "51009_1750": "Monument",
  "51009_9999": "Other",

  "52003_1010": "Boat lift",
  "52003_1020": "Chamber lock",

  "53001_1800": "Bridge",
  "53001_1806": "Swing bridge",
  "53001_1807": "Lift bridge",
  "53001_1808": "Drawbridge",
  "53001_1830": "Elevated railway / road",
  "53001_1890": "Lock chamber",

  "53009_2030": "Dam",
  "53009_2050": "Weir",
  "53009_2060": "Safety gate",
  "53009_2070": "Sluice",
  "53009_2080": "Storm surge barrier",
  "53009_2090": "Pumping station"

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const datasetNameElement =
  document.getElementById("dataset-name");

const citySelect =
  document.getElementById("citySelect");

const classificationSelect =
  document.getElementById("classification");

const classLegend =
  document.getElementById("classLegend");

const probabilityLegend =
  document.getElementById("probabilityLegend");

const legendTitle =
  document.getElementById("legend-title");

const statusElement =
  document.getElementById("status");

const resetViewButton =
  document.getElementById("resetView");


datasetNameElement.textContent =
  CONFIG.datasetName;


// ============================================================
// CITY SELECTOR
// ============================================================

for (const city of CITIES) {

  const option =
    document.createElement("option");

  option.value =
    city;

  option.textContent =
    city.replaceAll("_", " ");

  citySelect.appendChild(
    option
  );

}

citySelect.value = "Stuttgart";


// ============================================================
// PMTILES
// ============================================================

const protocol =
  new window.pmtiles.Protocol();


maplibregl.addProtocol(
  "pmtiles",
  protocol.tile
);


const archive =
  new window.pmtiles.PMTiles(
    CONFIG.pmtilesUrl
  );


protocol.add(
  archive
);


// ============================================================
// MAP
// ============================================================

const map =
  new maplibregl.Map({

    container:
      "map",

    style:
      "https://tiles.openfreemap.org/styles/bright",

    center:
      CONFIG.center,

    zoom:
      CONFIG.zoom

  });


map.addControl(
  new maplibregl.NavigationControl(),
  "top-right"
);


map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 150,
    unit: "metric"
  })
);


// ============================================================
// VALUE HELPERS
// ============================================================

function isMissing(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  const text =
    String(value)
      .trim()
      .toLowerCase();

  return (
    text === "" ||
    text === "null" ||
    text === "none" ||
    text === "nan" ||
    text === "undefined"
  );

}


function formatText(
  value
) {

  if (isMissing(value)) {
    return "No information";
  }

  return String(value);

}


function formatNumber(
  value,
  decimals = 1,
  suffix = ""
) {

  if (isMissing(value)) {
    return "No information";
  }

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "No information";
  }

  return (
    number.toFixed(decimals)
    + suffix
  );

}

function roofTypeLabel(value) {

  if (isMissing(value)) {
    return "No information";
  }

  const code =
    String(value).trim();

  const label =
    ROOF_TYPE_LABELS[code];

  if (label) {
    return `${label} (${code})`;
  }

  return `Unknown roof type (${code})`;
}

function buildingFunction(
  value
) {

  if (isMissing(value)) {
    return "No information";
  }

  const code =
    String(value).trim();

  const description =
    FUNCTION_LABELS[code];

  if (description) {

    return `${description} (${code})`;

  }

  return `Unknown / unclassified (${code})`;

}


function yesNoClassification(
  value
) {

  return Number(value) === 1
    ? "Green"
    : "Non-green";

}


// ============================================================
// CURRENT UI STATE
// ============================================================

function currentClassification() {

  return classificationSelect.value;

}


function currentDisplayMode() {

  return document.querySelector(
    'input[name="display"]:checked'
  ).value;

}


function currentVisualization() {

  return document.querySelector(
    'input[name="visualization"]:checked'
  ).value;

}


function currentCity() {

  return citySelect.value;

}


// ============================================================
// FILTER CREATION
// ============================================================

function createRoofFilter() {

  const filters = [];

  const city =
    currentCity();

  const displayMode =
    currentDisplayMode();

  const field =
    currentClassification();


  filters.push([
    "==",
    ["get", "city"],
    city
  ]);


  if (displayMode === "green") {

    filters.push([
      "==",
      ["get", field],
      1
    ]);

  }


  else if (
    displayMode === "nongreen"
  ) {

    filters.push([
      "==",
      ["get", field],
      0
    ]);

  }


  if (filters.length === 0) {

    return null;

  }


  if (filters.length === 1) {

    return filters[0];

  }


  return [
    "all",
    ...filters
  ];

}


// ============================================================
// UPDATE STYLE
// ============================================================

function updateRoofStyle() {

  if (!map.getLayer("roof-fill")) {
    return;
  }


  const field =
    currentClassification();


  const visualization =
    currentVisualization();


  const filter =
    createRoofFilter();


  map.setFilter(
    "roof-fill",
    filter
  );


  map.setFilter(
    "roof-outline",
    filter
  );


  legendTitle.textContent =
    CLASSIFICATIONS[field];


  // --------------------------------
  // PROBABILITY MODE
  // --------------------------------

  if (
    visualization ===
    "probability"
  ) {

    classificationSelect.disabled =
      true;


    map.setPaintProperty(
      "roof-fill",
      "fill-color",
      [
        "interpolate",
        ["linear"],

        [
          "to-number",
          [
            "get",
            "proba_greenroof"
          ]
        ],

        0.0,
        "#d9d9d9",

        0.50,
        "#ffffb2",

        0.70,
        "#78c679",

        0.85,
        "#31a354",

        0.90,
        "#238443",

        1.0,
        "#004529"
      ]
    );


    classLegend.classList.add(
      "hidden"
    );


    probabilityLegend.classList.remove(
      "hidden"
    );

  }


  // --------------------------------
  // CLASSIFICATION MODE
  // --------------------------------

  else {

    classificationSelect.disabled =
      false;


    map.setPaintProperty(
      "roof-fill",
      "fill-color",
      [
        "case",

        [
          "==",
          ["get", field],
          1
        ],

        "#1a9850",

        "#cccccc"
      ]
    );


    classLegend.classList.remove(
      "hidden"
    );


    probabilityLegend.classList.add(
      "hidden"
    );

  }

}


// ============================================================
// POPUP
// ============================================================

function showRoofPopup(
  event
) {

  const feature =
    event.features?.[0];


  if (!feature) {
    return;
  }


  const p =
    feature.properties;


  const probability =
    Number(
      p.proba_greenroof
    );


  const probabilityText =
    Number.isFinite(probability)
      ? `${(probability * 100).toFixed(1)}%`
      : "No information";


  const html = `

    <strong>
      Roof prediction
    </strong>

    <br><br>

    <b>City / district:</b>
    ${formatText(p.city)}

    <br>

    <b>
      Green-roof probability:
    </b>
    ${probabilityText}

    <hr>

    <b>F1 optimized:</b>
    ${yesNoClassification(p.pred_f1)}

    <br>

    <b>≥ 0.85:</b>
    ${yesNoClassification(p.pred_ge_085)}

    <br>

    <b>≥ 0.90:</b>
    ${yesNoClassification(p.pred_ge_090)}

    <br>

    <b>Top 1%:</b>
    ${yesNoClassification(p.pred_top1pct)}

    <br>

    <b>Top 2%:</b>
    ${yesNoClassification(p.pred_top2pct)}

    <br>

    <b>Top 5%:</b>
    ${yesNoClassification(p.pred_top5pct)}

    <hr>

    <b>Roof ID:</b>
    ${formatText(p.roof_id)}

    <br>

    <b>Building ID:</b>
    ${formatText(p.building_id)}

    <br>

    <b>Area:</b>
    ${formatNumber(
      p.area_m2,
      1,
      " m²"
    )}

    <br>

    <b>Slope:</b>
    ${formatNumber(
      p.slope_deg,
      1,
      "°"
    )}

    <br>

    <b>Height:</b>
    ${formatNumber(
      p.height_m,
      1,
      " m"
    )}

    <br>

    <b>Roof type:</b>
    ${roofTypeLabel(
      p.roofType
    )}

    <br>

    <b>Building function:</b>
    ${buildingFunction(
      p.function
    )}

  `;


  new maplibregl.Popup()
    .setLngLat(
      event.lngLat
    )
    .setHTML(
      html
    )
    .addTo(
      map
    );

}


// ============================================================
// RESET VIEW
// ============================================================

resetViewButton.addEventListener(
  "click",
  () => {

    citySelect.value =
      "Stuttgart";


    updateRoofStyle();


    map.easeTo({

      center:
        CONFIG.center,

      zoom:
        CONFIG.zoom,

      bearing:
        0,

      pitch:
        0

    });

  }
);


// ============================================================
// MAP LOAD
// ============================================================

map.on(
  "load",
  () => {

    map.addSource(
      "roofs",
      {

        type:
          "vector",

        url:
          `pmtiles://${CONFIG.pmtilesUrl}`

      }
    );


    // ----------------------------
    // ROOF FILL
    // ----------------------------

    map.addLayer({

      id:
        "roof-fill",

      type:
        "fill",

      source:
        "roofs",

      "source-layer":
        "green_roofs",

      minzoom:
        8,

      paint: {

        "fill-color": [
          "case",

          [
            "==",
            ["get", "pred_f1"],
            1
          ],

          "#1a9850",

          "#cccccc"
        ],

        "fill-opacity":
          0.72

      }

    });


    // ----------------------------
    // ROOF OUTLINE
    // ----------------------------

    map.addLayer({

      id:
        "roof-outline",

      type:
        "line",

      source:
        "roofs",

      "source-layer":
        "green_roofs",

      minzoom:
        13,

      paint: {

        "line-color":
          "#222222",

        "line-width":
          0.45,

        "line-opacity":
          0.7

      }

    });


    // ----------------------------
    // HOVER
    // ----------------------------

    map.addLayer({

      id:
        "roof-hover",

      type:
        "line",

      source:
        "roofs",

      "source-layer":
        "green_roofs",

      minzoom:
        11,

      filter: [
        "==",
        ["get", "roof_id"],
        -1
      ],

      paint: {

        "line-color":
          "#ff6600",

        "line-width":
          2.5,

        "line-opacity":
          1

      }

    });


    updateRoofStyle();


    statusElement.textContent =
      "Ready";


    statusElement.classList.add(
      "ready"
    );


    // ----------------------------
    // POPUP
    // ----------------------------

    map.on(
      "click",
      "roof-fill",
      showRoofPopup
    );


    // ----------------------------
    // HOVER
    // ----------------------------

    map.on(
      "mousemove",
      "roof-fill",
      event => {

        map.getCanvas()
          .style.cursor =
          "pointer";


        const feature =
          event.features?.[0];


        if (!feature) {
          return;
        }


        const roofId =
          feature.properties
            ?.roof_id;


        if (
          roofId === undefined ||
          roofId === null
        ) {
          return;
        }


        map.setFilter(
          "roof-hover",
          [
            "==",
            ["get", "roof_id"],
            Number(roofId)
          ]
        );

      }
    );


    map.on(
      "mouseleave",
      "roof-fill",
      () => {

        map.getCanvas()
          .style.cursor =
          "";


        map.setFilter(
          "roof-hover",
          [
            "==",
            ["get", "roof_id"],
            -1
          ]
        );

      }
    );

  }
);


// ============================================================
// ERROR HANDLER
// ============================================================

map.on(
  "error",
  event => {

    console.error(
      "Map error:",
      event.error
    );


    statusElement.textContent =
      "Map error";


    statusElement.classList.remove(
      "ready"
    );


    statusElement.classList.add(
      "error"
    );

  }
);


// ============================================================
// UI EVENTS
// ============================================================

citySelect.addEventListener(
  "change",
  () => {

    updateRoofStyle();

    const city =
      citySelect.value;

    const bounds =
      CITY_BOUNDS[city];

    if (!bounds) {
      console.warn(
        `No bounds found for ${city}`
      );
      return;
    }

    map.fitBounds(
      bounds,
      {
        padding: 60,
        duration: 1000,
        maxZoom: 13
      }
    );

  }
);


classificationSelect.addEventListener(
  "change",
  updateRoofStyle
);


document
  .querySelectorAll(
    'input[name="display"]'
  )
  .forEach(
    element => {

      element.addEventListener(
        "change",
        updateRoofStyle
      );

    }
  );


document
  .querySelectorAll(
    'input[name="visualization"]'
  )
  .forEach(
    element => {

      element.addEventListener(
        "change",
        updateRoofStyle
      );

    }
  );