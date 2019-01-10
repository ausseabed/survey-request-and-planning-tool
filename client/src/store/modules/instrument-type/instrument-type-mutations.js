export const clearInstrumentTypeList = (state, payload) => {
  state.instrumentTypes.splice(0, state.instrumentTypes.length);
}

export const setInstrumentTypes = (state, instrumentTypes) => {
  state.instrumentTypes = _.cloneDeep(instrumentTypes);
}

export const addInstrumentType = (state, instrumentType) => {
  state.instrumentTypes.push(instrumentType);
}
