export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const setAoi = (state, geojson) => {

  state.areaOfInterest = geojson;

}
