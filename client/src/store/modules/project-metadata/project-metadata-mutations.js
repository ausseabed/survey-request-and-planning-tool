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

  // update list of valid data capture types based on what instruments have
  // been selected.
  let idSet = new Set();
  for (const instType of state.projectMetadata.instrumentTypes) {
    for (const dtcType of instType.dataCaptureTypes) {
      idSet.add(dtcType.id);
    }
  }
  state.validDataCaptureTypeIds = idSet;

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

export const setSurveyApplicationIdOther = (state, surveyApplicationIdOther) => {
  return state.surveyApplicationIdOther = surveyApplicationIdOther;
}

export const setSurveyApplicationNameOther = (state, surveyApplicationNameOther) => {
  return state.surveyApplicationNameOther = surveyApplicationNameOther;
}

export const setSurveyApplicationGroupNameOther = (state, surveyApplicationGroupNameOther) => {
  return state.surveyApplicationGroupNameOther = surveyApplicationGroupNameOther;
}
