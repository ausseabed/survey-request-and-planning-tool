export const addCustomDataset = (state, dataset) => {
  if (dataset) {
    state.custom_datasets.push(dataset);
  }
}

export const addStandardDataset = (state, dataset) => {
  if (dataset) {
    state.standard_datasets.push(dataset);
  }
}

export const clearCustomDataset = (state) => {
  state.custom_datasets.splice(0, state.custom_datasets.length)
}

export const clearStandardDataset = (state) => {
  state.standard_datasets.splice(0, state.standard_datasets.length)
}

export const removeCustomDataset = (state, id) => {
  var idx = _.findIndex(state.custom_datasets, (d) => {
    return d.id === id;
  });

  if (idx > -1) {
    state.custom_datasets.splice(idx, 1);
  }
}

export const removeStandardDataset = (state, id) => {
  var idx = _.findIndex(state.standard_datasets, (d) => {
    return d.id === id;
  });

  if (idx > -1) {
    state.standard_datasets.splice(idx, 1);
  }
}

export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}
