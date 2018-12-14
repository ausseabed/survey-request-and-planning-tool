export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}

export const clearFiles = (state) => {
  state.files.splice(0, state.files.length);
}

export const addFile = (state, file) => {
  state.files.push(file);
}
