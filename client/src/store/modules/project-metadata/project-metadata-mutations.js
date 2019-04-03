export const update = (state, { path, value }) => {
  _.set(state, path, _.cloneDeep(value))
  state.dirty = true;
}

export const replace = (state, updated_state) => {
  Object.assign(state, updated_state);
  state.dirty = true;
}

export const setAoi = (state, geojson) => {

  state.projectMetadata.areaOfInterest = geojson;
  state.dirty = true;
}

export const setInstrumentTypes = (state, instrumentTypes) => {
  state.projectMetadata.instrumentTypes = instrumentTypes;

  // update list of valid data capture types based on what instruments have
  // been selected.
  let idSet = new Set();
  for (const instType of state.projectMetadata.instrumentTypes) {
    for (const dtcType of instType.dataCaptureTypes) {
      idSet.add(dtcType.id);
    }
  }
  state.validDataCaptureTypeIds = idSet;
  state.dirty = true;
  // This was the old approach to automatically update list of selected
  // data capture types. Now handled by presenting validation error.
  // if (state.projectMetadata.dataCaptureTypes === undefined) {
  //   return;
  // }
  // // setting the list of instrument types can cause the list of dataCaptureTypes
  // // to be updated. A DataCaptureType will be removed if there is no instrument
  // // to support it.
  // state.projectMetadata.dataCaptureTypes
  //   = state.projectMetadata.dataCaptureTypes.filter( dct =>
  //   {
  //     return state.validDataCaptureTypeIds.has(dct.id);
  //   });
}

export const setDataCaptureTypes = (state, dataCaptureTypes) => {
  state.projectMetadata.dataCaptureTypes = dataCaptureTypes;
  state.dirty = true;
}

export const addOrganisation = (state, organisation) => {
  state.projectMetadata.organisations.push(organisation);
  state.dirty = true;
}

export const setOrganisations = (state, organisations) => {
  state.projectMetadata.organisations = organisations;
  state.dirty = true;
}

export const removeOrganisation = (state, organisation) => {
  let index = state.projectMetadata.organisations.findIndex(function (o) {
    return o.id == organisation.id;
  });
  state.projectMetadata.organisations.splice(index, 1);
  state.dirty = true;
}

export const setStartDate = (state, startDate) => {
  state.projectMetadata.startDate = startDate.getTime();
  state.dirty = true;
}

export const setSurveyApplication = (state, surveyApplication) => {
  state.projectMetadata.surveyApplication = surveyApplication;
  state.dirty = true;
}

export const setProjectStatuses = (state, statuses) => {
  state.projectStatuses = statuses;
}

export const setSurveyors = (state, organisations) => {
  state.projectMetadata.surveyors = organisations;
  state.dirty = true;
}

export const setTenderer = (state, organisation) => {
  state.projectMetadata.tenderer = organisation;
  state.dirty = true;
}

export const setSurveyApplicationIdOther = (state, surveyApplicationIdOther) => {
  return state.surveyApplicationIdOther = surveyApplicationIdOther;
}

export const setSurveyApplicationNameOther = (state, surveyApplicationNameOther) => {
  return state.surveyApplicationNameOther = surveyApplicationNameOther;
}

export const setSurveyApplicationGroupNameOther = (state, surveyApplicationGroupNameOther) => {
  return state.surveyApplicationGroupNameOther = surveyApplicationGroupNameOther;
}

export const setDirty = (state, dirty) => {
  return state.dirty = dirty;
}
