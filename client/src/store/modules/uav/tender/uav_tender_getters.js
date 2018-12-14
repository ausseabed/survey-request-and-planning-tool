export const project_details = state => {
  return {
    id: state.id,
    name: state.project_name,
    contract_no: state.contract_no,
    tenderer: state.tenderer,
    created: state.created,
    updated: state.updated,
    can_edit: state.can_edit
  }
}

export const point_cloud = state => {
  return state.point_cloud;
}

export const collection = state => {
  return state.collection;
}

export const delivery = state => {
  return state.delivery;
}

export const spatial_reference = state => {
  return state.spatial_reference;
}

export const imagery = state => {
  return state.imagery;
}

export const dem = state => {
  return state.dem;
}

export const dsm = state => {
  return state.dsm;
}

export const contours = state => {
  return state.contours;
}

export const video = state => {
  return state.video;
}

export const metadata = state => {
  return state.metadata;
}

export const trajectory = state => {
  return state.trajectory;
}

export const models_3d = state => {
  return state.models_3d;
}

export const project_report = state => {
  return state.project_report;
}

export const tile_index = state => {
  return state.tile_index;
}

export const custom_datasets = state => {
  return state.custom_datasets;
}

export const additional = state => {
  return state.additional;
}

export const files = state => {
  return state.assets;
}

export const aoiUrl = state => {
  return state.aoiUrl;
}
