export const clearSurveyApplicationList = (state, payload) => {
  state.surveyApplications.splice(0, state.surveyApplications.length);
}

export const setSurveyApplications = (state, surveyApplications) => {
  state.surveyApplications = _.cloneDeep(surveyApplications);
}

export const setSurveyApplicationGroups = (state, surveyApplicationGroups) => {
  state.surveyApplicationGroups = _.cloneDeep(surveyApplicationGroups);
}

export const addSurveyApplication = (state, surveyApplication) => {
  state.surveyApplications.push(surveyApplication);
}

export const setSelectedSurveyApplication = (state, surveyApplication) => {
  if (!surveyApplication) {
    //  clears selection
    state.selectedSurveyApplication = undefined;
    return;
  }
  // when setting the selected survey application set it to one that already
  // exists in the list
  let surveyAppToSet = undefined;
  if (state.surveyApplications) {
    surveyAppToSet = state.surveyApplications.find(sa => {
      return sa.id == surveyApplication.id;
    });
  } else {
    surveyAppToSet = surveyApplication;
  }
  state.selectedSurveyApplication = surveyAppToSet;
}

export const setSelectedSurveyApplicationGroup = (state, group) => {
  state.selectedSurveyApplicationGroup = group;
}
