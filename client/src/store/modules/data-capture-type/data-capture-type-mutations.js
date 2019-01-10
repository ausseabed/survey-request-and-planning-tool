export const clearDataCaptureTypeList = (state, payload) => {
  state.dataCaptureTypes.splice(0, state.dataCaptureTypes.length);
}

export const setDataCaptureTypes = (state, dataCaptureTypes) => {
  state.dataCaptureTypes = _.cloneDeep(dataCaptureTypes);
}

export const addDataCapture = (state, dataCaptureType) => {
  state.dataCaptureTypes.push(dataCaptureType);
}
