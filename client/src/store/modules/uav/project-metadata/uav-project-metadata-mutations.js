export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}

export const setAoi = (state, geojson) => {

  state.areaOfInterest = geojson;

}
