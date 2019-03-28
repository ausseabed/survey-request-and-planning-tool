export const id = state => {
  return state.projectMetadata.id;
}

export const surveyName = state => {
  return state.projectMetadata.surveyName;
}

export const contactPerson = state => {
  return state.projectMetadata.contactPerson;
}

export const email = state => {
  return state.projectMetadata.email;
}

export const quality = state => {
  return state.projectMetadata.quality;
}

export const comment = state => {
  return state.projectMetadata.comment;
}

export const vessel = state => {
  return state.projectMetadata.vessel;
}

export const areaOfInterest = state => {
  return state.projectMetadata.areaOfInterest;
}

export const organisations = state => {
  return state.projectMetadata.organisations;
}

export const startDate = state => {
  const date = new Date();
  date.setTime(state.projectMetadata.startDate);
  return date;
}

export const instrumentTypes = state => {
  return state.projectMetadata.instrumentTypes;
}

export const dataCaptureTypes = state => {
  return state.projectMetadata.dataCaptureTypes;
}

export const validDataCaptureTypeIds = state => {
  // returns a set of data capture type ids that related to the currently
  // selected instrument types.
  return state.validDataCaptureTypeIds;
}

export const surveyApplication = state => {
  return state.projectMetadata.surveyApplication;
}

export const projectStatus = state => {
  return state.projectMetadata.projectStatus;
}

export const projectStatuses = state => {
  return state.projectStatuses;
}

export const projectMetadata = state => {
  return state.projectMetadata;
}

export const surveyId = state => {
  return state.projectMetadata.surveyId;
}

export const contractNumber = state => {
  return state.projectMetadata.contractNumber;
}

export const tenderer = state => {
  return state.projectMetadata.tenderer;
}

export const surveyors = state => {
  return state.projectMetadata.surveyors;
}

export const surveyApplicationIdOther = state => {
  return state.surveyApplicationIdOther;
}

export const surveyApplicationNameOther = state => {
  return state.surveyApplicationNameOther;
}

export const surveyApplicationGroupNameOther = state => {
  return state.surveyApplicationGroupNameOther;
}
