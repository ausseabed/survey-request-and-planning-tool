export const id = state => {
  return state.id;
}

export const surveyName = state => {
  return state.surveyName;
}

export const contactPerson = state => {
  return state.contactPerson;
}

export const email = state => {
  return state.email;
}

export const comment = state => {
  return state.comment;
}

export const vessel = state => {
  return state.vessel;
}

export const areaOfInterest = state => {
  return state.areaOfInterest;
}

export const organisations = state => {
  return state.organisations;
}

export const startDate = state => {
  const date = new Date();
  date.setTime(state.startDate);
  return date;
}

export const instrumentTypes = state => {
  return state.instrumentTypes;
}

export const dataCaptureTypes = state => {
  return state.dataCaptureTypes;
}

export const surveyApplication = state => {
  return state.surveyApplication;
}
