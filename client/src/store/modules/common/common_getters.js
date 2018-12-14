export const pc_versions = state => {
  return state.pc_versions;
}

export const pdrf_formats = state => {
  return state.pdrf_formats;
}

export const hcs = state => {
  return state.hcs;
}

export const vcs = state => {
  return state.vcs;
}

export const video_resolution = state => {
  return state.video_resolution;
}

export const naming_conventions = state => {
  return _.map(state.standard_datasets, (s) => { return { value: s.id, label: s.name } });
}

export const custom_datasets = state => {
  return state.custom_datasets;
}

export const standard_datasets = state => {
  return state.standard_datasets;
}

export const current_standard_dataset = state => {
  return state.current_standard_dataset;
}

export const scan_angle = state => {
  return state.scan_angle;
}

export const classification_old = state => {
  return state.classification_old;
}

export const classification_new = state => {
  return state.classification_new;
}

export const all_formats = state => {
  return state.all_formats;
}
