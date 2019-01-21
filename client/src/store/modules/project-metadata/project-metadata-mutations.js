export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
}

export const setAoi = (state, geojson) => {

  state.projectMetadata.areaOfInterest = geojson;

}

export const setInstrumentTypes = (state, instrumentTypes) => {
  state.projectMetadata.instrumentTypes = instrumentTypes;
}

export const setDataCaptureTypes = (state, dataCaptureTypes) => {
  state.projectMetadata.dataCaptureTypes = dataCaptureTypes;
}

export const addOrganisation = (state, organisation) => {
  state.projectMetadata.organisations.push(organisation);
}

export const removeOrganisation = (state, organisation) => {
  let index = state.projectMetadata.organisations.findIndex(function (o) {
    return o.id == organisation.id;
  });
  state.projectMetadata.organisations.splice(index, 1);
}

export const setStartDate = (state, startDate) => {
  state.projectMetadata.startDate = startDate.getTime();
}

export const setSurveyApplication = (state, surveyApplication) => {
  state.projectMetadata.surveyApplication = surveyApplication;
}

export const setProjectStatuses = (state, statuses) => {
  state.projectStatuses = statuses;
}

export const setSurveyors = (state, organisations) => {
  state.projectMetadata.surveyors = organisations;
}

export const setTenderer = (state, organisation) => {
  state.projectMetadata.tenderer = organisation;
}
