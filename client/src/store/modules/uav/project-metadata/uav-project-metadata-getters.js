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
