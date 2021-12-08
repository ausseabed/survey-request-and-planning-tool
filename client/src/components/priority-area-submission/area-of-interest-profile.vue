<template>
  <form-wrapper :validator="$v">
    <q-card flat bordered class="full-width">
      <q-card-section>
        <div class="main-page-sub-title">{{ areaOfInterest.name }}</div>
      </q-card-section>
      <q-card-section class="row q-gutter-md">
        <div class="column" style="max-width: 250px">
          <q-img
            class="rounded-borders"
            :src="`api/priority-area/${areaOfInterest.id}/thumbnail`"
            :ratio="1"
            contain
          />
          <div class="column q-pt-xs q-gutter-xs">
            <q-badge color="secondary" text-color="white">
              Registration details
            </q-badge>
            <div class="column q-pl-sm reg-details-text">
              <div><b>Identified area name:</b> {{ areaOfInterest.name }}</div>
              <div>
                <b>Seacountry name:</b> {{ areaOfInterest.seacountryName }}
              </div>
              <div>
                <b>Ecological area:</b> {{ areaOfInterest.ecologicalAreaName }}
              </div>
            </div>
          </div>
        </div>

        <q-list
          bordered
          separator
          class="col rounded-borders"
          ref="expansionItemList"
        >
          <q-expansion-item expand-separator label="Purpose">
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Data and Methods"
            icon="scatter_plot"
          >
            <q-card>
              <q-card-section class="row q-gutter-x-xs">
                <div class="col">
                  <div>Data to Capture</div>
                  <q-list dense>
                    <q-item
                      v-for="opt in DATA_OPTIONS"
                      :key="opt"
                      tag="label"
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          size="sm"
                          :value="areaOfInterest.dataToCapture"
                          :val="opt"
                          @input="valueChanged('dataToCapture', $event)"
                          :disable="readonly"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ opt }} </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col">
                  <div>Preferred Method(s)</div>
                  <q-list dense>
                    <template v-for="methodGroup of DATA_AND_METHOD_OPTIONS">
                      <q-item-label
                        header
                        :key="methodGroup.groupName + '-header'"
                        style="padding-bottom: 0px"
                      >
                        {{ methodGroup.groupName }}
                      </q-item-label>
                      <q-item
                        v-for="method in methodGroup.methods"
                        :key="method.name"
                        tag="label"
                        v-ripple
                      >
                        <q-item-section avatar>
                          <q-checkbox
                            size="sm"
                            :value="areaOfInterest.dataCaptureMethods"
                            :val="method.name"
                            @input="valueChanged('dataCaptureMethods', $event)"
                            :disable="
                              readonly || dataCaptureMethodDisabled(method.name)
                            "
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ method.name }} </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <!-- <q-item
                      v-for="opt in DATA_OPTIONS"
                      :key="opt"
                      tag="label"
                      v-ripple
                    >
                      <q-item-section avatar>
                        <q-checkbox
                          :value="areaOfInterest.dataToCapture"
                          :val="opt"
                          @input="valueChanged('dataToCapture', $event)"
                          :disable="readonly"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ opt }} </q-item-label>
                      </q-item-section>
                    </q-item> -->
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Existing Data Assessment"
            icon="fact_check"
          >
            <q-card>
              <q-card-section class="q-gutter-y-xs">
                <div>
                  Please select all existing data sources you have considered,
                  and brief note on why this area of interest is not being
                  serviced to meet your needs.
                </div>
                <q-list dense>
                  <q-item
                    v-for="opt in EXISTING_DATA_SOURCE_OPTIONS"
                    :key="opt.name"
                    tag="label"
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        :value="areaOfInterest.existingDataSources"
                        :val="opt.name"
                        @input="valueChanged('existingDataSources', $event)"
                        :disable="readonly"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ opt.name }} </q-item-label>
                      <q-item-label caption>{{ opt.datatypes }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ opt.url }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div>Reason for Area of Interest to be raised.</div>
                <q-option-group
                  dense
                  class="q-pl-md"
                  :options="REASON_FOR_AOI_RAISE_OPTIONS"
                  type="radio"
                  :value="areaOfInterest.reasonForAoiRaise"
                  @input="valueChanged('reasonForAoiRaise', $event)"
                  :disable="readonly"
                />

                <form-field-validated-input
                  name="areaOfInterest.existingDataAssessmentComments"
                  attribute="Further Comments"
                  label="Further Comments"
                  :value="areaOfInterest.existingDataAssessmentComments"
                  @input="
                    valueChanged('existingDataAssessmentComments', $event)
                  "
                  @blur="
                    $v.areaOfInterest.existingDataAssessmentComments.$touch
                  "
                  type="textarea"
                  autogrow
                  :readonly="readonly"
                  outlined
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Resolution and Standard"
            icon="grid_on"
          >
            <q-card>
              <q-card-section class="row q-gutter-x-xs">
                <form-field-validated-option-group
                  class="col"
                  :value="areaOfInterest.gridSize"
                  @input="valueChanged('gridSize', $event)"
                  :options="GRID_SIZE_OPTIONS"
                  name="areaOfInterest.gridSize"
                  label="Grid Size"
                  @blur="$v.areaOfInterest.gridSize.$touch"
                  :readonly="readonly"
                >
                </form-field-validated-option-group>

                <form-field-validated-option-group
                  class="col"
                  :value="areaOfInterest.surveyStandard"
                  @input="valueChanged('surveyStandard', $event)"
                  :options="SURVEY_STANDARD_OPTIONS"
                  name="areaOfInterest.surveyStandard"
                  label="Bathymetry Survey Standard"
                  @blur="$v.areaOfInterest.surveyStandard.$touch"
                  :readonly="readonly"
                >
                </form-field-validated-option-group>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Data collection timeline and cadence"
            icon="schedule"
          >
            <q-card>
              <q-card-section class="q-gutter-y-xs">
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.preferredTimeframe"
                  label="Preferred Timeframe"
                  :value="areaOfInterest.preferredTimeframe"
                  @input="valueChanged('preferredTimeframe', $event)"
                  :options="PREFERRED_TIMEFRAME_OPTIONS"
                  @blur="$v.areaOfInterest.preferredTimeframe.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-input
                  name="areaOfInterest.timeframeReason"
                  attribute="Reason for timeframe"
                  label="Reason for timeframe"
                  :value="areaOfInterest.timeframeReason"
                  @input="valueChanged('timeframeReason', $event)"
                  @blur="$v.areaOfInterest.timeframeReason.$touch"
                  type="textarea"
                  autogrow
                  :readonly="readonly"
                  outlined
                >
                </form-field-validated-input>
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.preferredSeason"
                  label="Preferred Season"
                  :value="areaOfInterest.preferredSeason"
                  @input="valueChanged('preferredSeason', $event)"
                  :options="PREFERRED_SEASON_OPTIONS"
                  @blur="$v.areaOfInterest.preferredSeason.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.collectionCadence"
                  label="Intended Cadence for Collection"
                  :value="areaOfInterest.collectionCadence"
                  @input="valueChanged('collectionCadence', $event)"
                  :options="COLLECTION_CADENCE_OPTIONS"
                  @blur="$v.areaOfInterest.collectionCadence.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-input
                  name="areaOfInterest.timeSeriesDescription"
                  attribute="Time Series Description"
                  label="Time Series Description"
                  :value="areaOfInterest.timeSeriesDescription"
                  @input="valueChanged('timeSeriesDescription', $event)"
                  @blur="$v.areaOfInterest.timeSeriesDescription.$touch"
                  type="textarea"
                  autogrow
                  :readonly="readonly"
                  outlined
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Organisational Priority and Perceived Impact"
            icon="hardware"
          >
            <q-card>
              <q-card-section class="q-gutter-y-xs">
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.perceivedImpact"
                  label="Perceived Impact"
                  :value="areaOfInterest.perceivedImpact"
                  @input="valueChanged('perceivedImpact', $event)"
                  :options="PERCEIVED_IMPACT_OPTIONS"
                  @blur="$v.areaOfInterest.perceivedImpact.$touch"
                  :readonly="readonly"
                />
                <form-field-validated-button-toggle
                  inline
                  name="areaOfInterest.organisationalPriority"
                  label="Organisational Priority"
                  :value="areaOfInterest.organisationalPriority"
                  @input="valueChanged('organisationalPriority', $event)"
                  :options="ORGANISATIONAL_PRIORITY_OPTIONS"
                  @blur="$v.areaOfInterest.organisationalPriority.$touch"
                  :readonly="readonly"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item expand-separator label="Pressures" icon="water">
            <q-card>
              <q-card-section class="column q-gutter-y-xs">
                <div>
                  Please select the appropriate profile within the MERI
                  framework to identify the focus areas of proposed data
                  acquisition.
                </div>
                <q-tree
                  :nodes="ACTIVITIES"
                  node-key="key"
                  tick-strategy="leaf"
                  :ticked.sync="pressuresTicked"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
  </form-wrapper>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";

import { errorHandler } from "./../mixins/error-handling";
import { permission } from "./../mixins/permission";

const PREFERRED_TIMEFRAME_OPTIONS = [
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "No Timeframe"
];

const PREFERRED_SEASON_OPTIONS = ["NA", "Spring", "Summer", "Autumn", "Winter"];

const COLLECTION_CADENCE_OPTIONS = [
  "Snapshot",
  "Time Series Desired",
  "Time Series Established"
];

const PERCEIVED_IMPACT_OPTIONS = [
  "Unknown",
  "Local (<10km)",
  "Regional (10-100km)",
  "National (>1000km)"
];

const ORGANISATIONAL_PRIORITY_OPTIONS = ["NA", "1", "2", "3"];

const EXISTING_DATA_SOURCE_OPTIONS = [
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

const REASON_FOR_AOI_RAISE_OPTIONS = [
  { label: "Data not found for AOI", value: "Data not found for AOI" },
  {
    label: "Data not found to meet requirements",
    value: "Data not found to meet requirements"
  },
  { label: "Data found, not relevant", value: "Data found, not relevant" },
  { label: "Timeseries required", value: "Timeseries required" }
];

const GRID_SIZE_OPTIONS = [
  { label: "<1 m", value: "<1 m" },
  { label: "2-5 m", value: "2-5 m" },
  { label: "10s m", value: "10s m" },
  { label: "100s m", value: "100s m" },
  { label: "kms", value: "kms" }
];

const SURVEY_STANDARD_OPTIONS = [
  { label: "HIPP – Precise", value: "HIPP – Precise" },
  { label: "IHO Exclusive Order", value: "IHO Exclusive Order" },
  { label: "IHO – Special", value: "IHO – Special" },
  { label: "IHO – 1a", value: "IHO – 1a" },
  { label: "IHO – 1b", value: "IHO – 1b" },
  { label: "HIPP – 2", value: "HIPP – 2" },
  { label: "IHO – 2", value: "IHO – 2" },
  { label: "HIPP – Passage", value: "HIPP – Passage" }
];

const DATA_AND_METHOD_OPTIONS = [
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

const ACTIVITIES = [
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
        label: "Construction and operation of pipelines",
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

export default Vue.extend({
  mixins: [errorHandler, permission],

  mounted() {
    this.setDefaults();
  },

  created() {
    this.PREFERRED_TIMEFRAME_OPTIONS = PREFERRED_TIMEFRAME_OPTIONS;
    this.PREFERRED_SEASON_OPTIONS = PREFERRED_SEASON_OPTIONS;
    this.COLLECTION_CADENCE_OPTIONS = COLLECTION_CADENCE_OPTIONS;

    this.PERCEIVED_IMPACT_OPTIONS = PERCEIVED_IMPACT_OPTIONS;
    this.ORGANISATIONAL_PRIORITY_OPTIONS = ORGANISATIONAL_PRIORITY_OPTIONS;

    this.EXISTING_DATA_SOURCE_OPTIONS = EXISTING_DATA_SOURCE_OPTIONS;
    this.REASON_FOR_AOI_RAISE_OPTIONS = REASON_FOR_AOI_RAISE_OPTIONS;

    this.GRID_SIZE_OPTIONS = GRID_SIZE_OPTIONS.map(o => {
      return o.label;
    });
    this.SURVEY_STANDARD_OPTIONS = SURVEY_STANDARD_OPTIONS.map(o => {
      return o.label;
    });

    this.DATA_AND_METHOD_OPTIONS = DATA_AND_METHOD_OPTIONS;

    // get a simple sorted list of the data types to make showing this
    // in a checklist much easier
    let optionsSet = new Set();
    for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
      for (const method of methodGroup.methods) {
        if (method.data.length != 0) {
          method.data.forEach(d => {
            optionsSet.add(d);
          });
        }
      }
    }
    this.DATA_OPTIONS = Array.from(optionsSet).sort();

    this.ACTIVITIES = ACTIVITIES;
    this.addKeys(undefined, this.ACTIVITIES);
    console.log(this.ACTIVITIES);
  },

  props: {
    areaOfInterest: {},
    readonly: true
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit("aoi-value-changed", {
        aoi: this.areaOfInterest,
        propertyName: propertyName,
        value: value
      });
    },

    setDefaults() {
      if (this.areaOfInterest.organisationalPriority == undefined) {
        this.valueChanged(
          "organisationalPriority",
          ORGANISATIONAL_PRIORITY_OPTIONS[0]
        );
      }
      if (this.areaOfInterest.perceivedImpact == undefined) {
        this.valueChanged("perceivedImpact", PERCEIVED_IMPACT_OPTIONS[0]);
      }
    },

    setExpanded(expanded) {
      // expands or contracts all expansion controls
      for (const expansionItem of this.$refs.expansionItemList.$children) {
        if (expanded) {
          expansionItem.show();
        } else {
          expansionItem.hide();
        }
      }
    },

    addKeys(parentKey, items) {
      // Each node in the tree needs a unique key, this is the value
      // that ultimately gets saved to the database to maintain selections
      // some leaf nodes use the same label, so we generate keys that
      // include the complete path to the leaf (instead of just the leaf
      // node label)
      for (const item of items) {
        item.key = parentKey ? parentKey + "-" + item.label : item.label;
        if (item.children) {
          this.addKeys(item.key, item.children);
        }
      }
    },

    dataCaptureMethodDisabled(dataCaptureMethod) {
      // data capture methods are disabled if there is no data collection
      // type selected that requires this collection type.
      for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
        for (const method of methodGroup.methods) {
          if (method.name == dataCaptureMethod) {
            let commonData = _.intersectionWith(
              this.areaOfInterest.dataToCapture,
              method.data,
              (a, b) => a == b
            );
            return commonData.length == 0;
          }
        }
      }
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {
    "areaOfInterest.dataToCapture": function(oldVal, newVal) {
      // deselect any data capture methods that should not be selected based
      // on what dataToCapture types has been selected.
      var toRemove = [];
      for (const methodGroup of this.DATA_AND_METHOD_OPTIONS) {
        for (const method of methodGroup.methods) {
          if (
            this.areaOfInterest.dataCaptureMethods.includes(method.name) &&
            this.dataCaptureMethodDisabled(method.name)
          ) {
            toRemove.push(method.name);
          }
        }
      }

      let cleanedList = this.areaOfInterest.dataCaptureMethods.filter(i => {
        return !toRemove.includes(i);
      });

      this.valueChanged("dataCaptureMethods", cleanedList);
    }
  },

  validations() {
    return {
      areaOfInterest: {
        preferredTimeframe: { required },
        timeframeReason: {},
        preferredSeason: {},
        collectionCadence: {},
        timeSeriesDescription: {},

        perceivedImpact: { required },
        organisationalPriority: { required },

        existingDataSources: {},
        reasonForAoiRaise: {},
        existingDataAssessmentComments: {},

        gridSize: { required },
        surveyStandard: {},

        dataToCapture: {},
        dataCaptureMethods: {}
      }
    };
  },

  computed: {
    pressuresTicked: {
      get: function() {
        return this.areaOfInterest.pressures;
      },
      set: function(value) {
        this.valueChanged("pressures", value);
      }
    }
  },

  data() {
    return {
      ticked: []
    };
  }
});
</script>


<style scoped lang="stylus">
.reg-details-text {
  div, b {
    font-size: 0.9em;
  }
}
</style>
