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

export const ORGANISATIONAL_PRIORITY_OPTIONS = ["NA", "1", "2", "3"];

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
        url: "biotope, sediment, chemical",
        datatypes: "https://biocollect.ala.org.au/imsa"
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
    { label: "kms", value: "kms" }
];

export const SURVEY_STANDARD_OPTIONS = [
    { label: "HIPP – Precise", value: "HIPP – Precise" },
    { label: "IHO Exclusive Order", value: "IHO Exclusive Order" },
    { label: "IHO – Special", value: "IHO – Special" },
    { label: "IHO – 1a", value: "IHO – 1a" },
    { label: "IHO – 1b", value: "IHO – 1b" },
    { label: "HIPP – 2", value: "HIPP – 2" },
    { label: "IHO – 2", value: "IHO – 2" },
    { label: "HIPP – Passage", value: "HIPP – Passage" }
];

export const DATA_AND_METHOD_OPTIONS = [
    {
        groupName: "Acoustic",
        methods: [
            {
                name: "MBES",
                data: ["Bathymetry", "Backscatter", "Water column backscatter"]
            },
            {
                name: "Side-scan",
                data: ["Bathymetry", "Backscatter"]
            },
            {
                name: "Single-beam",
                data: ["Bathymetry", "Backscatter", "Water column backscatter"]
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
                data: ["Bathymetry", "Imagery"]
            },
            {
                name: "LiDAR",
                data: ["Bathymetry"]
            },
            {
                name: "Aerial photography",
                data: ["Imagery"]
            }
        ]
    },
    {
        groupName: "Semi-autonomous Imagery",
        methods: [
            {
                name: "UAV",
                data: ["Imagery", "Bathymetry"]
            },
            {
                name: "AUV / Drift Camera",
                data: ["Imagery", "Bathymetry", "Backscatter"]
            },
            {
                name: "ROV Imagery",
                data: ["Imagery", "Bathymetry"]
            },
            {
                name: "Drop / Towed Video / DOV",
                data: ["Imagery"]
            },
            {
                name: "BRUV / Lander",
                data: ["Imagery"]
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
                    "Biotope/habitat"
                ]
            },
            {
                name: "Benthic Sled / Dregde",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Substrate"
                ]
            },
            {
                name: "Pots / Traps",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat"
                ]
            },
            {
                name: "ROV Collection",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Substrate"
                ]
            },
            {
                name: "Grab",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS",
                    "Biotope/habitat",
                    "Substrate"
                ]
            },
            {
                name: "Sediment Cores",
                data: ["Substrate", "Biodiversity (inc. microbial diversity)"]
            },
            {
                name: "Tissue Sample",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS"
                ]
            },
            {
                name: "eDNA",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS"
                ]
            },
            {
                name: "Settlement plates",
                data: [
                    "Biodiversity (inc. microbial diversity)",
                    "Indicator species / TEPS"
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
                    "Water properties"
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
            "Access to Traditional resource areas (fishing, medicinal, ceremonial, spiritual)",
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
                label: "Restoration",
                flags: ["Sci.knowledge", "Intervention"]
            },
            {
                label: "Rehabilitation",
                flags: ["Sci.knowledge", "Intervention"]
            },
        ],
        values: []
    }
];