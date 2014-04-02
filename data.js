var baseYear = "2009";
var reportYear = "2011";

var regionNames = {
  'cape-york': 'Cape York',
  'wet-tropics': 'Wet Tropics',
  'burdekin': 'Burdekin',
  'mackay-whitsunday': 'Mackay-Whitsunday',
  'fitzroy': 'Fitzroy',
  'burnett-mary': 'Burnett-Mary'
};

var indicatorNames = {
  // Management
  "grazing": "Grazing",
  "sugarcane": "Sugarcane / Grains",
  "horticulture": "Horticulture",
  // Catchment
  "groundcover": "Groundcover",
  "nitrogen": "Nitrogen",
  "sediment": "Sediment",
  "pesticides": "Pesticides",
  // Marine
  "overall": "Overall Marine Condition",
  "coral": "Coral",
  "coral-change": "Coral change",
  "coral-cover": "Coral cover",
  "coral-juvenile": "Coral juvenile density",
  "coral-macroalgae": "Coral macroalgal cover",
  "seagrass": "Seagrass",
  "seagrass-abundance": "Seagrass abundance",
  "seagrass-reproduction": "Seagrass reproduction",
  "seagrass-nutrient": "Seagrass nutrients",
  "water": "Water Quality",
  "water-solids": "Total suspended solids",
  "water-chlorophyll": "Chlorophyll &alpha;"
};

var marineCaptions = {
  'gbr':                'The overall condition of the reef in 2010-2011 declined from moderate to poor. Inshore water quality was poor overall and varied from moderate to poor depending on the region. Inshore seagrass was in very poor condition overall, and its condition has continued to decline since 2006-2007. Inshore coral reefs were in poor condition overall.',
  'cape-york':          'The marine condition off Cape York was poor. Inshore water quality was poor and the one southern seagrass bed monitored was in moderate condition.',
  'wet-tropics':        'The Wet Tropics’ marine condition declined from moderate to poor. Inshore water quality and seagrass meadows were in poor condition and coral reefs were in moderate condition.',
  'burdekin':           'The Burdekin’s marine condition remained poor. Inshore water quality was moderate overall, while inshore seagrass meadows declined from poor to very poor and coral reefs remained in poor condition.',
  'mackay-whitsunday':  'The Mackay Whitsunday’s marine condition declined from moderate to poor. Inshore water quality also declined from moderate to poor, inshore seagrass meadows declined from poor to very poor and coral reefs remained in moderate condition.',
  'fitzroy':            'The Fitzroy’s marine condition declined from moderate to poor. Inshore water quality and inshore seagrass meadows also declined from moderate to poor and coral reefs remained in poor condition',
  'burnett-mary':       'The Burnett Mary’s marine condition remained poor. Inshore water quality remained moderate and the condition of seagrass declined from poor to very poor.'
};

var marineData = {
  "gbr": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": "Poor" },
    "coral-change": { "qualitative": "Poor" },
    "coral-cover": { "qualitative": "Poor" },
    "coral-juvenile": { "qualitative": "Very Poor" },
    "coral-macroalgae": { "qualitative": "Good" },
    "seagrass": { "qualitative": "Very Poor" },
    "seagrass-abundance": { "qualitative": "Very Poor" },
    "seagrass-reproduction": { "qualitative": "Very Poor" },
    "seagrass-nutrient": { "qualitative": "Poor" },
    "water": { "qualitative": "Poor" },
    "water-solids": { "qualitative": "Moderate" },
    "water-chlorophyll": { "qualitative": "Very Poor" }
  },
  "cape-york": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": null },
    "coral-change": { "qualitative": null },
    "coral-cover": { "qualitative": null },
    "coral-juvenile": { "qualitative": null },
    "coral-macroalgae": { "qualitative": null },
    "seagrass": { "qualitative": "Moderate" },
    "seagrass-abundance": { "qualitative": "Very Poor" },
    "seagrass-reproduction": { "qualitative": "Good" },
    "seagrass-nutrient": { "qualitative": "Moderate" },
    "water": { "qualitative": "Poor" },
    "water-solids": { "qualitative": "Moderate" },
    "water-chlorophyll": { "qualitative": "Poor" }
  },
  "wet-tropics": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": "Moderate" },
    "coral-change": { "qualitative": "Poor" },
    "coral-cover": { "qualitative": "Poor" },
    "coral-juvenile": { "qualitative": "Very Poor" },
    "coral-macroalgae": { "qualitative": "Good" },
    "seagrass": { "qualitative": "Poor" },
    "seagrass-abundance": { "qualitative": "Poor" },
    "seagrass-reproduction": { "qualitative": "Very Poor" },
    "seagrass-nutrient": { "qualitative": "Poor" },
    "water": { "qualitative": "Poor" },
    "water-solids": { "qualitative": "Good" },
    "water-chlorophyll": { "qualitative": "Very Poor" }
  },
  "burdekin": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": "Poor" },
    "coral-change": { "qualitative": "Poor" },
    "coral-cover": { "qualitative": "Very Poor" },
    "coral-juvenile": { "qualitative": "Very Poor" },
    "coral-macroalgae": { "qualitative": "Good" },
    "seagrass": { "qualitative": "Very Poor" },
    "seagrass-abundance": { "qualitative": "Very Poor" },
    "seagrass-reproduction": { "qualitative": "Very Poor" },
    "seagrass-nutrient": { "qualitative": "Very Poor" },
    "water": { "qualitative": "Moderate" },
    "water-solids": { "qualitative": "Moderate" },
    "water-chlorophyll": { "qualitative": "Poor" }
  },
  "mackay-whitsunday": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": "Moderate" },
    "coral-change": { "qualitative": "Very Poor" },
    "coral-cover": { "qualitative": "Moderate" },
    "coral-juvenile": { "qualitative": "Poor" },
    "coral-macroalgae": { "qualitative": "Very Good" },
    "seagrass": { "qualitative": "Very Poor" },
    "seagrass-abundance": { "qualitative": "Very Poor" },
    "seagrass-reproduction": { "qualitative": "Very Poor" },
    "seagrass-nutrient": { "qualitative": "Very Poor" },
    "water": { "qualitative": "Poor" },
    "water-solids": { "qualitative": "Very Poor" },
    "water-chlorophyll": { "qualitative": "Poor" }
  },
  "fitzroy": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": "Poor" },
    "coral-change": { "qualitative": "Poor" },
    "coral-cover": { "qualitative": "Poor" },
    "coral-juvenile": { "qualitative": "Very Poor" },
    "coral-macroalgae": { "qualitative": "Good" },
    "seagrass": { "qualitative": "Poor" },
    "seagrass-abundance": { "qualitative": "Poor" },
    "seagrass-reproduction": { "qualitative": "Moderate" },
    "seagrass-nutrient": { "qualitative": "Moderate" },
    "water": { "qualitative": "Poor" },
    "water-solids": { "qualitative": "Moderate" },
    "water-chlorophyll": { "qualitative": "Very Poor" }
  },
  "burnett-mary": {
    "overall": { "qualitative": "Poor" },
    "coral": { "qualitative": null },
    "coral-change": { "qualitative": null },
    "coral-cover": { "qualitative": null },
    "coral-juvenile": { "qualitative": null },
    "coral-macroalgae": { "qualitative": null },
    "seagrass": { "qualitative": "Very Poor" },
    "seagrass-abundance": { "qualitative": "Very Poor" },
    "seagrass-reproduction": { "qualitative": "Very Poor" },
    "seagrass-nutrient": { "qualitative": "Poor" },
    "water": { "qualitative": "Moderate" },
    "water-solids": { "qualitative": "Good" },
    "water-chlorophyll": { "qualitative": "Very Poor" }
  }
};

var managementData = {
  "gbr": {
    "grazing": { "qualitative": "Moderate" , "quantitative": "17%", "target": "50%" },
    "sugarcane": { "qualitative": "Good" , "quantitative": "34%", "target": "80%" },
    "horticulture": { "qualitative": "Moderate" , "quantitative": "25%", "target": "80%" }
  },
  "cape-york": {
    "grazing": { "qualitative": "Very Good" , "quantitative": "33%", "target": "50%" },
    "sugarcane": { "qualitative": null , "quantitative": null, "target": "80%" },
    "horticulture": { "qualitative": "Good" , "quantitative": "40%", "target": "80%" }
  },
  "wet-tropics": {
    "grazing": { "qualitative": "Moderate" , "quantitative": "16%", "target": "50%" },
    "sugarcane": { "qualitative": "Good" , "quantitative": "37%", "target": "80%" },
    "horticulture": { "qualitative": "Moderate" , "quantitative": "24%", "target": "80%" }
  },
  "burdekin": {
    "grazing": { "qualitative": "Good" , "quantitative": "20%", "target": "50%" },
    "sugarcane": { "qualitative": "Moderate" , "quantitative": "28%", "target": "80%" },
    "horticulture": { "qualitative": "Moderate" , "quantitative": "27%", "target": "80%" }
  },
  "mackay-whitsunday": {
    "grazing": { "qualitative": "Very Good" , "quantitative": "36%", "target": "50%" },
    "sugarcane": { "qualitative": "Good" , "quantitative": "30%", "target": "80%" },
    "horticulture": { "qualitative": "Very Good" , "quantitative": "47%", "target": "80%" }
  },
  "fitzroy": {
    "grazing": { "qualitative": "Moderate" , "quantitative": "16%", "target": "50%" },
    "sugarcane": { "qualitative": "Moderate" , "quantitative": "18%", "target": "80%" },
    "horticulture": { "qualitative": "Poor" , "quantitative": "13%", "target": "80%" }
  },
  "burnett-mary": {
    "grazing": { "qualitative": "Moderate" , "quantitative": "13%", "target": "50%" },
    "sugarcane": { "qualitative": "Very Good" , "quantitative": "42%", "target": "80%" },
    "horticulture": { "qualitative": "Moderate" , "quantitative": "25%", "target": "80%" }
  }
};

var catchmentData = {
  "gbr": {
    "groundcover": { "qualitative": "Very Good" , "quantitative": "91%", "target": "50%" },
    "nitrogen": { "qualitative": "Moderate" , "quantitative": "7%", "target": "50%" },
    "sediment": { "qualitative": "Very Good" , "quantitative": "6%", "target": "20%" },
    "pesticides": { "qualitative": "Good" , "quantitative": "15%", "target": "50%" }
  },
  "cape-york": {
    "groundcover": { "qualitative": null , "quantitative": null },
    "nitrogen": { "qualitative": "Poor" , "quantitative": "4%", "target": "50%" },
    "sediment": { "qualitative": "Good" , "quantitative": "4%", "target": "20%" },
    "pesticides": { "qualitative": null , "quantitative": null, "target": "50%" }
  },
  "wet-tropics": {
    "groundcover": { "qualitative": "Very Good" , "quantitative": "95%", "target": "50%" },
    "nitrogen": { "qualitative": "Poor" , "quantitative": "4%", "target": "50%" },
    "sediment": { "qualitative": "Good" , "quantitative": "3%", "target": "20%" },
    "pesticides": { "qualitative": "Moderate" , "quantitative": "10%", "target": "50%" }
  },
  "burdekin": {
    "groundcover": { "qualitative": "Very Good" , "quantitative": "92%", "target": "50%" },
    "nitrogen": { "qualitative": "Poor" , "quantitative": "8%", "target": "50%" },
    "sediment": { "qualitative": "Very Good" , "quantitative": "10%", "target": "20%" },
    "pesticides": { "qualitative": "Good" , "quantitative": "17%", "target": "50%" }
  },
  "mackay-whitsunday": {
    "groundcover": { "qualitative": "Very Good" , "quantitative": "92%", "target": "50%" },
    "nitrogen": { "qualitative": "Good" , "quantitative": "13%", "target": "50%" },
    "sediment": { "qualitative": "Very Good" , "quantitative": "6%", "target": "20%" },
    "pesticides": { "qualitative": "Very Good" , "quantitative": "31%", "target": "50%" }
  },
  "fitzroy": {
    "groundcover": { "qualitative": "Very Good" , "quantitative": "90%", "target": "50%" },
    "nitrogen": { "qualitative": "Poor" , "quantitative": "2%", "target": "50%" },
    "sediment": { "qualitative": "Good" , "quantitative": "3%", "target": "20%" },
    "pesticides": { "qualitative": "Moderate" , "quantitative": "4%", "target": "50%" }
  },
  "burnett-mary": {
    "groundcover": { "qualitative": "Very Good" , "quantitative": "93%", "target": "50%" },
    "nitrogen": { "qualitative": "Moderate" , "quantitative": "8%", "target": "50%" },
    "sediment": { "qualitative": "Good" , "quantitative": "3%", "target": "20%" },
    "pesticides": { "qualitative": "Good" , "quantitative": "17%", "target": "50%" }
  }
};
