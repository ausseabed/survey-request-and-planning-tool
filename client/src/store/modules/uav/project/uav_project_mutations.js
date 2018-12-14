export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}

export const removeSession = (state, { id, session_id }) => {
  if (state.id === id) {
    var idx = _.findIndex(state.sessions, (s) => { return s.session_id === session_id });
    if (idx > -1) {
      state.sessions.splice(idx, 1);
    }
  }
}
