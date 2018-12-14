import * as actions from './uav_tender_actions'
import * as getters from './uav_tender_getters'
import * as mutations from './uav_tender_mutations'

function initialState() {
  return {
    id: "",
    project_name: null,
    contract_no: null,
    tenderer: null,
    company: null,
    created: "",
    updated: "",
    aoi: "",
    hcs: "",
    vcs: "",
    can_edit: true,
    collection: {
      time_sensitive: { is_sensitive: false, time_range: null, comment: null },
      time_series_data: false,
      environmental_consideration: null,
      gps_positioning: true,
      image_overlap: {
        forward: 30, side: 50
      },
      standoff: null
    },
    delivery: {
      date: null,
      method: [],
      method_comment: null,
      ancillary_data: [],
      naming_convention: null
    },
    spatial_reference: {
      hcs: null,
      vcs: [],
      accuracy: {
        horizontal: { abs: null, rel: null },
        vertical: { abs: null, rel: null }
      }
    },
    point_cloud: {
      required: false,
      formats: [],
      types: [],
      full_wave_form: null,
      version: -1,
      pdrf: -1,
      classification: null,
      tile_sizes: [],
      density: null,
      scan_angle: null,
      file_size: null,
    },
    imagery: {
      required: false,
      types: [],
      capture_angle: null,
      resolutions: [],
      formats: [],
      tile_sizes: []
    },
    dem: {
      required: false,
      hydro_flatten: false,
      resolutions: [],
      formats: [],
      tile_sizes: []
    },
    dsm: {
      required: false,
      resolutions: [],
      formats: [],
      tile_sizes: []
    },
    contours: {
      required: false,
      interval: null,
      attributes: [],
      formats: [],
      tile_sizes: []
    },
    video: {
      required: false,
      formats: [],
      resolution: null
    },
    metadata: {
      formats: []
    },
    trajectory: {
      required: false,
      formats: [],
      attributes: []
    },
    project_report: {
      formats: [],
      notes: null
    },
    tile_index: {
      required: false,
      formats: [],
      tile_sizes: []
    },
    custom_datasets: [
    ],
    additional: {
      client_needed: false,
      background: null,
      raw_data: null,
      features: null,
      flight_pattern: null,
      landing_takeoff: null,
      flight_height: null,
      flight_risk: null,
      permits: null,
      safety_approvals: null,
      casa_requirements: null,
      site_access: null,
      vantage_point: null,
      vegetation: null,
      environment_terrain: null,
      others: null
    },
    assets: [],
    aoiUrl: null,
    qAnswers: null
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations: {
    reset(state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    },
    ...mutations
  }
}
