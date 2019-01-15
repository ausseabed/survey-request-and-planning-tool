export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}

export const setAoi = (state, geojson) => {

  state.areaOfInterest = geojson;

}

export const setInstrumentTypes = (state, instrumentTypes) => {
  state.instrumentTypes = instrumentTypes;
}

export const setDataCaptureTypes = (state, dataCaptureTypes) => {
  state.dataCaptureTypes = dataCaptureTypes;
}

export const addOrganisation = (state, organisation) => {
  state.organisations.push(organisation);
}

export const removeOrganisation = (state, organisation) => {
  let index = state.organisations.findIndex(function (o) {
    return o.id == organisation.id;
  });
  state.organisations.splice(index, 1);
}

export const setStartDate = (state, startDate) => {
  state.startDate = startDate.getTime();
}

export const setSurveyApplication = (state, surveyApplication) => {
  state.surveyApplication = surveyApplication;
}
