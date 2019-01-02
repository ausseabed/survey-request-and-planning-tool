export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}
