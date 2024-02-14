// constants definitions for the area-of-interest-* components.
// In future these should be moved to the back end in line with
// the implementation of similar components within the SCT

export const PREFERRED_TIMEFRAME_OPTIONS = [
    "1-2 years",
    "2-5 years",
    "5-10 years",
    "No Timeframe"
];

export const PREFERRED_SEASON_OPTIONS = ["NA", "Spring", "Summer", "Autumn", "Winter"];

export const COLLECTION_CADENCE_OPTIONS = [
    "Snapshot",
    "Time Series Desired",
    "Time Series Established"
];

export const PERCEIVED_IMPACT_OPTIONS = [
    "Unknown",
    "Local (<10km)",
    "Regional (10-100km)",
    "National (>1000km)"
];

export const ORGANISATIONAL_PRIORITY_OPTIONS = ["NA", "Low", "Medium", "High"];

export const EXISTING_DATA_SOURCE_OPTIONS = [
    {
        name: "AusSeabed",
        url: "https://www.ausseabed.gov.au/data",
        datatypes: "acoustic data, bathymetry, etc"
    },
    {
        name: "MARS",
        url: "http://dbforms.ga.gov.au/pls/www/npm.mars.search",
        datatypes: "sediments"
    },
    {
        name: "Squidle+",
        url: "https://squidle.org/",
        datatypes: "epibenthos organisms / imagery"
    },
    {
        name: "SOI Squidle",
        url: "https://soi.squidle.org/",
        datatypes: "epibenthos organisms / imagery"
    },
    {
        name: "AODN  (all rationales)",
        url: "https://portal.aodn.org.au/",
        datatypes: "all data types"
    },
    {
        name: "OBIS",
        url: "https://obis.org/",
        datatypes: "ecological data; species distributions"
    },
    {
        name: "ALA",
        url: "https://www.ala.org.au/",
        datatypes: "ecological data; species distributions"
    },
    {
        name: "SeaMap Australia",
        url: "https://seamapaustralia.org/",
        datatypes: "biotope"
    },
    {
        name: "GlobalArchive",
        url: "https://globalarchive.org/",
        datatypes: "fish, BRUVS data"
    },
    {
        name: "IMSA",
        url: "https://biocollect.ala.org.au/imsa",
        datatypes: "biotope, sediment, chemical"
    }
];

export const REASON_FOR_AOI_RAISE_OPTIONS = [
    { label: "Data not found for AOI", value: "Data not found for AOI" },
    {
        label: "Data not found to meet requirements",
        value: "Data not found to meet requirements"
    },
    { label: "Data found, not relevant", value: "Data found, not relevant" },
    { label: "Timeseries required", value: "Timeseries required" }
];

export const GRID_SIZE_OPTIONS = [
    { label: "<1 m", value: "<1 m" },
    { label: "2-5 m", value: "2-5 m" },
    { label: "10s m", value: "10s m" },
    { label: "100s m", value: "100s m" },
    { label: "kms", value: "kms" },
    { label: "unknown", value: "unknown" },
];

export const SURVEY_STANDARD_OPTIONS = [
    { label: "HIPP – Precise / IHO Exclusive Order", value: "HIPP – Precise / IHO Exclusive Order", description: "This survey standard is the most stringent and should only be selected for small areas that require engineering level accuracies.  This may be for safety of navigation within or near a port or scientific research within the coastal zone where high precision measurements are required.  Obtaining the vertical accuracy required to support this standard is difficult and expensive and thus this standard should only be selected if a genuine need exists." },
    { label: "IHO – Special", value: "IHO – Special", description: "This survey quality is designed for shallow water surveys (<40m) where under-keel clearance is important and should be restricted to only small areas where this level of accuracy is required.  An example of a survey where this type of accuracy is required may be the Torres Strait UKC Area or approaches to a port where under-keel clearance is important for the economic benefit of the port or the risk of grounding has a high economic or environmental cost.  This standard may be applicable for scientific research that requires high levels of horizontal and vertical accuracy plus the ability to detect small features." },
    { label: "IHO – 1a", value: "IHO – 1a", description: "This survey standard covers general safety of navigation surveys.  This order has the requirement to conduct a systematic survey that ensures that all features are detected, thus requires the Full Bathymetric Coverage (overlapping MBES swaths – see diagram). This survey standard would also be applicable to most scientific purposes." },
    { label: "IHO – 1b", value: "IHO – 1b", description: "This survey is the same as IHO 1a in the accuracies required however does not require full bathymetric coverage and therefore not all features will be detected." },
    { label: "HIPP – 2", value: "HIPP – 2", description: "This standard is intended to cover surveys that require a greater knowledge of the seafloor on the continental shelf margins and is designed to support research within the 100-300m depth band.  This standard has increased accuracy requirements within this depth band and the need to obtain full bathymetric coverage." },
    { label: "IHO – 2", value: "IHO – 2", description: "This is a low accuracy survey standard for deep water surveys and only provides a general description of the seabed and does not require full bathymetric coverage.   If full bathymetric coverage is required, this will need to be detailed in the Comments section." },
    { label: "unknown", value: "unknown" },
];

export const DATA_AND_METHOD_OPTIONS = [
    {
        groupName: "Acoustic",
        methods: [
            {
                name: "MBES",
                data: ["Bathymetry", "Backscatter", "Water column backscatter", "Biotope/habitat"]
            },
            {
                name: "Side-scan",
                data: ["Bathymetry", "Backscatter", "Biotope/habitat"]
            },
            {
                name: "Single-beam",
                data: ["Bathymetry", "Backscatter", "Water column backscatter", "Biotope/habitat"]
            },
            {
                name: "Sub-bottom profiling",
                data: ["Sub-bottom"]
            }
        ]
    },
    {
        groupName: "Remote Sensing",
        methods: [
            {
                name: "Satellite",
                data: ["Bathymetry", "Biotope/habitat"]
            },
            {
                name: "LiDAR",
                data: ["Bathymetry", "Biotope/habitat"]
            },
            {
                name: "Aerial photography",
                data: ["Biotope/habitat"]
            }
        ]
    },
    {
        groupName: "Semi-autonomous Imagery",
        methods: [
            {
                name: "UAV",
                data: ["Bathymetry", "Biodiversity", "Biotope/habitat", "Indicator species / TEPS"]
            },
            {
                name: "AUV / Drift Camera",
                data: ["Bathymetry", "Backscatter", "Biodiversity", "Biotope/habitat", "Indicator species / TEPS"]
            },
            {
                name: "ROV Imagery",
                data: ["Bathymetry", "Biodiversity", "Biotope/habitat", "Indicator species / TEPS"]
            },
            {
                name: "Drop / Towed Video / DOV",
                data: ["Biodiversity", "Biotope/habitat", "Indicator species / TEPS"]
            },
            {
                name: "BRUV / Lander",
                data: ["Biodiversity", "Biotope/habitat", "Indicator species / TEPS"]
            }
        ]
    },
    {
        groupName: "Sensors (physical / chemical)",
        methods: [
            {
                name: "CTD",
                data: ["Water properties"]
            },
            {
                name: "ADCP",
                data: ["Water movements (currents / tides / etc)"]
            },
            {
                name: "Chemical Sniffers",
                data: ["Water properties"]
            }
        ]
    },
    {
        groupName: "Physical Collection",
        methods: [
            {
                name: "Net / Trawl",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Biological specimens"
                ]
            },
            {
                name: "Benthic Sled / Dredge",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biological specimens",
                    "Biotope/habitat",
                    "Substrate"
                ]
            },
            {
                name: "Pots / Traps",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Biological specimens"
                ]
            },
            {
                name: "ROV Collection",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Substrate",
                    "Biological specimens"
                ]
            },
            {
                name: "Grab",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Substrate",
                    "Biological specimens"
                ]
            },
            {
                name: "Sediment Cores",
                data: [
                    "Substrate",
                    "Biodiversity (inc. microbial diversity)",
                    "Biological specimens",
                    "Indicator species / TEPS",
                    "Sub-bottom"
                ]
            },
            {
                name: "Tissue Sample",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biological specimens"
                ]
            },
            {
                name: "eDNA",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biological specimens"
                ]
            },
            {
                name: "Settlement plates",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biological specimens"
                ]
            },
            {
                name: "Sediment traps",
                data: ["Substrate"]
            },
            {
                name: "Water samplers (e.g. Niskin bottle)",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Water properties",
                    "Biological specimens"
                ]
            },
            {
                name: "Hook & Line",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biological specimens"
                ]
            },
            {
                name: "Stratigraphic drilling",
                data: [
                    "Sub-bottom"
                ]
            }
        ]
    }
];

export const ACTIVITIES = [
    {
        label: "Climate change",
        children: [
            {
                label: "Climate change",
                children: [
                    {
                        label: "Altered ocean currents"
                    },
                    {
                        label: "Increased frequency and severity of weather events"
                    },
                    {
                        label: "Increased sea surface temperature"
                    },
                    {
                        label: "Ocean acidification"
                    },
                    {
                        label: "Sea level rise"
                    }
                ]
            }
        ]
    },
    {
        label: "Climate change adaptation",
        children: [
            {
                label: "Carbon storage and sequestration",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            }
        ]
    },
    {
        label: "Commercial aquaculture",
        children: [
            {
                label: "Aquaculture (including commercial pearling)",
                children: [
                    {
                        label:
                            "Habitat modification (due to changes in nutrients and organic matter)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Vessel transiting",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations - vessel transit/vessel strike etc.)"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            }
        ]
    },
    {
        label: "Commercial fishing",
        children: [
            {
                label: "Danish Seine",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Demersal trawl",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Dropline",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Hand collection",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    }
                ]
            },
            {
                label: "Hand net",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    }
                ]
            },
            {
                label: "Longline (demersal, auto-longline)",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Longline (pelagic)",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Minor line",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Net - demersal",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Net - pelagic",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Pot and Trap",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    }
                ]
            },
            {
                label: "Purse Seine",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Scallop dredge",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Trawl - midwater",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Trotline",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Vessel transiting",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    },
    {
        label: "Commercial shipping",
        children: [
            {
                label: "Anchoring",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Light pollution"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            },
            {
                label: "Vessel transiting",
                children: [
                    {
                        label:
                            "Habitat modification (due to suspended sediments - including smothering)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    },
                    {
                        label: "Oil/fuel spill or leak"
                    },
                    {
                        label: "Overabundant native species"
                    }
                ]
            }
        ]
    },
    {
        label: "Commercial tourism",
        children: [
            {
                label: "Charter fishing tours",
                children: [
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Commercial aviation tours (up to 3000 m above sea level)",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations) "
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Non-fishing related tourism - nature watching",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Non-fishing related tourism - scuba/snorkel tour",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            },
            {
                label: "Non-fishing related tourism - vessel transiting",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    },
    {
        label: "Commercial Media",
        children: [
            {
                label: "Commercial Media",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    }
                ]
            }
        ]
    },
    {
        label: "General use access and waste management",
        children: [
            {
                label: "Ballast water discharge and exchange",
                children: [
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            },
            {
                label: "Camping",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Terrestrial pest plants and animals"
                    }
                ]
            },
            {
                label: "Disposal of waste from normal operations of vessels",
                children: [
                    {
                        label: "Sewage waste"
                    }
                ]
            },
            {
                label: "Non-commercial remote piloted aircraft",
                children: [
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Recreational use – boating (including vessel transiting)",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            },
            {
                label: "Recreational use - nature watching  (above and below water)",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    }
                ]
            }
        ]
    },
    {
        label: "Hunting and fishing",
        children: [
            {
                label: "Cultural fishing",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Traditional hunting",
                children: [
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    }
                ]
            }
        ]
    },
    {
        label: "Land-use intensification",
        children: [
            {
                label: "Diffuse source runoff",
                children: [
                    {
                        label: "Changes in nutrients and organic matter"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Noxious substances (including chemicals and heavy metals)"
                    },
                    {
                        label: "Suspended sediments (includes smothering)"
                    }
                ]
            },
            {
                label: "Point discharges",
                children: [
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Noxious substances (including chemicals and heavy metals)"
                    },
                    {
                        label: "Sewage waste"
                    }
                ]
            },
            {
                label: "Stock grazing of riparian and marine vegetation",
                children: [
                    {
                        label: "Changes in nutrients and organic matter"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Suspended sediments (includes smothering)"
                    },
                    {
                        label: "Terrestrial pest plants and animals"
                    }
                ]
            }
        ]
    },
    {
        label: "Mining",
        children: [
            {
                label: "export construction and operation of pipelines",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Mining - seismic survey",
                children: [
                    {
                        label: "Noise pollution"
                    }
                ]
            },
            {
                label: "Mining operations including exploration",
                children: [
                    {
                        label:
                            "Habitat modification (due to suspended sediments - including smothering)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label: "Light pollution"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    },
                    {
                        label: "Noxious substances (including chemicals and heavy metals)"
                    },
                    {
                        label: "Oil/fuel spill or leak"
                    }
                ]
            },
            {
                label: "Vessel transiting",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    },
    {
        label: "National security and emergency response",
        children: [
            {
                label:
                    "Actions by or under direction of the Commonwealth and Commonwealth agencies - defence, border protection, law enforcement and emergency response",
                children: [
                    {
                        label: "#N/A"
                    }
                ]
            }
        ]
    },
    {
        label: "Recreational fishing",
        children: [
            {
                label: "Anchoring",
                children: [
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Recreational fishing (including spearfishing)",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Overabundant native species"
                    }
                ]
            },
            {
                label: "Vessel transiting",
                children: [
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    },
    {
        label: "Renewable energy",
        children: [
            {
                label: "Wave, tidal and wind",
                children: [
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    },
    {
        label: "Research and monitoring",
        children: [
            {
                label: "Research, collecting, tagging",
                children: [
                    {
                        label: "Extraction of benthic mobile invertebrates"
                    },
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Extraction of terrestrial biota"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label:
                            "Marine debris (including microplastics and litter on islands)"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    },
    {
        label: "Structures and works",
        children: [
            {
                label: "Artificial reefs",
                children: [
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    }
                ]
            },
            {
                label: "Dredging or disposal of dredged material",
                children: [
                    {
                        label:
                            "Habitat modification (due to suspended sediments - including smothering)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Noise pollution"
                    },
                    {
                        label: "Noxious substances (including chemicals and heavy metals)"
                    }
                ]
            },
            {
                label:
                    "Excavation other than dredging, erection and maintenance of structures, and works (including cables, trenching & boring)",
                children: [
                    {
                        label:
                            "Habitat modification (due to suspended sediments - including smothering)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label: "Marine pests"
                    },
                    {
                        label: "Noise pollution"
                    },
                    {
                        label: "Noxious substances (including chemicals and heavy metals)"
                    },
                    {
                        label: "Oil/fuel spill or leak"
                    }
                ]
            },
            {
                label: "Fish aggregating devices",
                children: [
                    {
                        label: "Extraction of fish and free-swimming invertebrates"
                    },
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label:
                            "Human presence (disturbance of mobile fauna communities or populations)"
                    }
                ]
            },
            {
                label: "Moorings",
                children: [
                    {
                        label: "Extraction of megafauna (excluding fish)"
                    },
                    {
                        label: "Habitat modification (physical disturbance and removal)"
                    },
                    {
                        label: "Introduced pathogens/disease"
                    },
                    {
                        label: "Light pollution"
                    },
                    {
                        label: "Marine pests"
                    }
                ]
            }
        ]
    }
];

export const PURPOSE_DATA = [
    {
        label: "Cultural Heritage",
        children: [
            {
                label: "Tangible",
                children: [
                    {
                        label: "Preservation of Cultural sites",
                        flags: undefined
                    },
                    {
                        label: "Management of Traditional Resources",
                        flags: undefined
                    },
                    {
                        label: "Protection of Totems",
                        flags: undefined
                    },
                    {
                        label: "Preservation of Language",
                        flags: undefined
                    }
                ]
            },
            {
                label: "Intangible",
                children: [
                    {
                        label: "Conducting Ceremony",
                        flags: undefined
                    },
                    {
                        label: "Preservation of Songlines/creation stories",
                        flags: undefined
                    },
                    {
                        label: "Preservation of Language",
                        flags: undefined
                    }
                ]
            }
        ],
        values: [
            "Access to Traditional resource areas (fishing/medicinal/ceremonial/spiritual)",
            "Maintaining and protecting culture",
            "Cultural Wellbeing",
            "Connecting to culture/country",
            "Cultural Awareness",
            "Intergenerational transfer of knowledge",
            "Responsibility to Country/cultural obligation",
            "Practice and continuation of Language",
            "Education",
            "Outstanding universal value",
        ]
    },
    {
        label: "Social/Historical",
        children: [
            {
                label: "Managing Historical Heritage",
                children: [
                    {
                        label: "Archaeology",
                        flags: ["Known", "Likely"],
                    },
                    {
                        label: "Wrecks",
                        flags: ["Known", "Likely"],
                    }
                ]
            },
            {
                label: "Enabling Recreation",
                children: [
                    {
                        label: "Enabling Recreation",
                        flags: ["Known", "Likely"]
                    }
                ]
            }
        ],
        values: [
            "Effective management of heritage sites",
            "Memorial value",
            "Increase awareness and understanding of heritage",
            "Identify new recreational assets",
            "Increase personal satisfaction",
        ]
    },
    {
        label: "Operational",
        children: [
            {
                label: "Charting / Shipping",
                children: [
                    {
                        label: "Ship routing",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Port approaches",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Anchoring Management",
                        flags: ["Prospective", "Existing"]
                    }
                ]
            },
            {
                label: "Defence",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Natural disaster management",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Anthropogenic disaster management",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Georegulation (boundaries/ borders)",
                flags: ["Prospective", "Existing"]
            }
        ],
        values: [
            "Decrease operational risk",
            "Reduce cost",
            "Increase human safety",
            "Inform infrastructure planning",
            "Increased economic efficiency / tonnage",
            "Freedom of manoeuvre",
            "Pollution mitigation",
            "Wildlife interaction mitigation"
        ]
    },
    {
        label: "Economic",
        children: [
            {
                label: "Extractive",
                children: [
                    {
                        label: "fisheries",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "oil & gas",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "seabed mining",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "bioprospecting / biodiscovery",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Dredging",
                        flags: ["Prospective", "Existing"]
                    }
                ]
            },
            {
                label: "Infrastructure",
                children: [
                    {
                        label: "pipeline / cables",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Non-renewables",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Renewables",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Desalination",
                        flags: ["Prospective", "Existing"]
                    },
                    {
                        label: "Aquaculture",
                        flags: ["Prospective", "Existing"]
                    }
                ]
            },
            {
                label: "Decommissioning",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Disposal",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Tourism",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Coastal/ urban development",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Environmental economic accounting",
                flags: ["Prospective", "Existing"]
            },
            {
                label: "Precompetitive Geoscience",
                flags: undefined
            }
        ],
        values: [
            "Increase productivity",
            "Decrease risk",
            "Create jobs",
            "Generate investment",
            "Sustainable infrastructure",
            "Environmental offsets"
        ]
    },
    {
        label: "Environmental",
        children: [
            {
                label: "Characterisation / inventory",
                flags: ["Sci.knowledge", "Intervention"]
            },
            {
                label: "Fundamental Research",
                flags: ["Sci.knowledge", "Intervention"]
            },
            {
                label: "Monitoring",
                flags: ["Sci.knowledge", "Intervention"]
            },
            {
                label: "Protection",
                flags: ["Sci.knowledge", "Intervention"]
            },
            {
                label: "Restoration",
                flags: ["Sci.knowledge", "Intervention"]
            },
            {
                label: "Rehabilitation",
                flags: ["Sci.knowledge", "Intervention"]
            },
        ],
        values: [
            "Knowledge gap / discovery",
            "Foraging / Nesting grounds for TEPS",
            "Status / trends of TEPS / ecosystems",
            "Ecosystem function",
            "New management areas (e.g. 30x30 initiative)",
        ]
    }
];


export const ECOSYSTEM_DATA = [
    {
        label: "Unknown or no ecosystem target"
    },
    {
        label: "Lower slope and abyssal reef and sediments ",
        children: [
            {
                label: "Abyssal reef and sediments (>4000m)",
                description: "Reef and sediment habitats in the abyssal zone, between 4000m and 6000m."
            },
            {
                label: "Lower slope reef and sediments (2000-4000m)",
                description: "Rocky reef and sediment habitats on the lower continental slope and continental rise (i.e. between 2000m and nominally 4000m)."
            }
        ]
    },
    {
        label: "Upper and mid-slope reefs (including canyons)",
        children: [
            {
                label: "Mid-slope reefs (700-2000m)",
                description: "Reef habitats on the mid-continental slope between 700m and 2000m."
            },
            {
                label: "Upper slope reefs (200-700m)",
                description: "Reef habitats on the upper section of the continental slope between shelf break (nominally 200m) and 700m."
            },
            {
                label: "Shelf-incising canyons (head <200m)",
                description: "Steep sided valleys in the seabed that extend onto the continental shelf at least 500m shoreward of the shelf break."
            }
        ]
    },
    {
        label: "Seamounts (including guyots)",
        children: [
            {
                label: "Seamount sediments",
                description: "Sediment habitats occurring on seamounts."
            },
            {
                label: "Seamount reefs",
                description: "Rocky and deep-sea cold-water coral formations occurring on seamounts."
            }
        ]
    },
    {
        label: "Shelf upper and mid slope unvegetated sediments",
        children: [
            {
                label: "Mid-slope sediments (700-2000m)",
                description: "Sediment habitats on the mid continental slope (700-2000m)."
            },
            {
                label: "Upper slope sediments (200-700m)",
                description: "Sediment habitats on the upper continental slope (200m-700m)."
            },
            {
                label: "Shelf unvegetated sediments (0-200m)",
                description: "Sediment habitats on the continental shelf (0-200 metres) that lack marine macroalgae or seagrass"
            }
        ]
    },
    {
        label: "Deep shelf reefs",
        children: [
            {
                label: "Rariphotic shelf reefs (70-200m)",
                description: "Rocky reef formations found on the continental shelf below the mesophotic zone where light is so scarce it is not enough to support photosynthesis. Nominally rariphotic shelf reefs occur between 70m and 200m (the nominal depth of the shelf break)."
            },
            {
                label: "Mesophotic coral reefs (30-150m)",
                description: "Coral reef formations on tropical continental shelf areas in the mesophotic zone: a reduced light zone between 30m and the maximum depth at which there is sufficient penetration of sunlight to support photosynthesis. The maximum depth is variable dependent upon water clarity and may extend to 150m in the clearest of waters however, as a national average it is nominally defined as 70m."
            },
            {
                label: "Mesophotic rocky reefs (30-70m)",
                description: "Rocky reef formations on temperate continental shelf areas in the mesophotic zone: a reduced light zone between 30m and the maximum depth at which there is sufficient penetration of sunlight to support photosynthesis. The maximum depth is variable dependent upon water clarity and may extend to 150m in the clearest of waters however, as a national average it is nominally defined as 70m."
            }
        ]
    },
    {
        label: "Shelf vegetated sediments",
        children: [
            {
                label: "Shelf vegetated sediments",
                description: "Sediment habitats on the continental shelf that support marine macroalgae or seagrass. Typically, these occur in depths of less than 30m but can extend beyond this in areas with very clear waters."
            }
        ]
    },
    {
        label: "Oceanic coral reefs",
        children: [
            {
                label: "Oceanic mesophotic coral reefs (30-150m)",
                description: "Coral reefs occurring seaward of the continental shelf break in the mesophotic zone: a reduced light zone between 30m and the maximum depth at which there is sufficient penetration of sunlight to support photosynthesis. The maximum depth is variable dependent upon water clarity and may extend to 150m in the clearest of waters however, as a national average it is nominally defined as 70m."
            },
            {
                label: "Oceanic shallow coral reefs (<30m)",
                description: "Coral reefs occurring seaward of the continental shelf break in depths shallower than 30m."
            }
        ]
    },
    {
        label: "Shallow reefs",
        children: [
            {
                label: "Shallow coral reefs (<30m)",
                description: "Coral reefs occurring in continental shelf areas shallower than 30m"
            },
            {
                label: "Shallow rocky reefs (<30m)",
                description: "Rocky reefs occurring in continental shelf areas shallower than 30m"
            }
        ]
    },
    {
        label: "Intertidal areas",
        children: [
            {
                label: "Intertidal coral reefs",
                description: "Coral reefs found in the intertidal zone (i.e. between the highest and lowest tides)"
            },
            {
                label: "Rocky shores",
                description: "An intertidal area composed of rock platforms, boulders or cobbles"
            },
            {
                label: "Beaches",
                description: "Gently sloping zone of sand and/or gravel sized rock and/or biological fragments along the shore, extending from the highest high-tide point to the lowest low-tide point."
            }
        ]
    },
    {
        label: "Islands (including cays and islets)",
        children: [
            {
                label: "Islands (including cays and islets)",
                description: "Island - Relatively small body of land surrounded by water; Cay – a low bank or reef of coral or sand; Islet – a little island."
            }
        ]
    },
    {
        label: "IUCN - MFT1 Brackish tidal biome",
        children: [
            {
                label: "MFT1.1 Coastal river deltas",
                description: "River inflows structure the dynamic mosaics of coastal river deltas. Inflows depend on catchment geomorphology and climate and influence water levels, nutrient input, turbidity (hence light penetration), tidal amplitude, salinity gradients, temperature, dissolved oxygen and organic carbon."
            },
            {
                label: "MFT1.2 Intertidal forests and shrublands",
                description: "Mangrove forests"
            },
            {
                label: "MFT1.3 Coastal saltmarshes and reedbeds",
                description: "Coastal saltmarshes are vegetated by salt-tolerant forbs, grasses and shrubs, with fine-scale mosaics related to strong local hydrological and salinity gradients, as well as competition and facilitation."
            }
        ]
    },
    {
        label: "IUCN - MT2 Supralittoral coastal biome",
        children: [
            {
                label: "MT2.1 Coastal shrublands and grasslands",
                description: "Desiccating winds promote an overall water deficit and appreciable exposure to salinity due to aerosol influx and salt spray. Warm to mild temperatures across the tropics to temperate zones and cold temperatures in the cool temperate to boreal zones are moderated by direct maritime influence. Above the regular intertidal zone, these systems are exposed to periodic disturbance from exceptional tides, coastal storm events, wind shear, bioturbation and aeolian substrate mobility."
            }
        ]
    },
    {
        label: "IUCN - MT3 Anthropogenic shorelines biome",
        children: [
            {
                label: "MT3.1 Artificial shorelines",
                description: "Constructed sea walls, breakwaters, piers, docks, tidal canals, islands and other coastal infrastructure create substrates inhabited by intertidal and subtidal, benthic and demersal marine biota around ports, harbours, and other intensively settled coastal areas."
            }
        ]
    },
    {
        label: "IUCN - FM1 - Semiconfined transitional waters biome",
        children: [
            {
                label: "FM 1.2 Permanently open riverine estuaries and bays",
                description: "Governed by the relative dominance of saline marine waters versus freshwater inflows (groundwater and riverine), the latter depending on the seasonality of precipitation and evaporative stress. Geomorphology ranges from wavedominated estuaries to drowned river valleys, tiny inlets and enormous bays."
            },
            {
                label: "FM 1.3 Intermittently Open and Closed Lakes or Lagoons (COLLS)",
                description: "Shallow coastal water bodies that are intermittently connected with the ocean. Some lagoons are mostly open, closing only once every few decades. Some open and close frequently, and some are closed most of the time. The timing and frequency of entrance opening depend on the balance between onshore and offshore sedimentation processes (which close the entrance) and flushes of catchment inflow or erosive wave action (which open the entrance)."
            }
        ]
    }
];

export const ECOSYSTEM_COMPONENT_DATA = [
    "Unknown or no ecosystem component target",
    "Benthic and cryptic fish",
    "Demersal fish",
    "Forest",
    "Grassland",
    "Herb field",
    "Infauna",
    "Macroalgae",
    "Marine mammals",
    "Marine reptiles",
    "Microbes",
    "Mobile macroinvertebrates",
    "Seabirds",
    "Seagrass",
    "Sessile invertebrates",
    "Shorebirds and waterbirds",
    "Shrubland",
];