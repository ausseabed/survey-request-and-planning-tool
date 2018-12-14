import { retry } from "rxjs/operators";

export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}

export const addCustomDataset = (state, value) => {
  var v_to_push = _.cloneDeep(value);
  v_to_push.formats = [];
  state.custom_datasets.push(v_to_push);
}

export const removeCustomDataset = (state, id) => {
  var idx = _.findIndex(state.custom_datasets, (d) => {
    return d.id === id;
  });

  if (idx > -1) {
    state.custom_datasets.splice(idx, 1);
  }
}

export const updateCustomDatasetFormats = (state, { id, value }) => {
  var idx = _.findIndex(state.custom_datasets, (d) => {
    return d.id === id;
  });

  if (idx > -1) {
    var cd = state.custom_datasets[idx];
    cd.formats = value;
    state.custom_datasets.splice(idx, 1, cd);
  }
}

export const addFile = (state, file) => {
  var idx = _.findIndex(state.assets, (a) => {
    return a.toLowerCase() === file.toLowerCase();
  });

  if (idx <= -1) {
    state.assets.push(file);
  }
}

export const removeFile = (state, file) => {
  var idx = _.findIndex(state.assets, (a) => {
    return a.toLowerCase() === file.toLowerCase();
  });

  if (idx > -1) {
    state.assets.splice(idx, 1);
  }
}

export const addAoi = (state) => {
  var idx = _.findIndex(state.assets, (a) => { return a.toLowerCase() === 'aoi.geojson' })
  if (idx < 0) {
    state.assets.push('aoi.geojson');
  }
}
