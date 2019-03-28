export const clearSurveyApplicationList = (state, payload) => {
  state.surveyApplications.splice(0, state.surveyApplications.length);
}

export const setSurveyApplications = (state, surveyApplications) => {
  let sApps = _.cloneDeep(surveyApplications);
  if (state.selectedSurveyApplication) {
    // then we need to force this selected object to be in the list
    // otherwise it wont be selected.
    let index = sApps.findIndex(sa => {
      return sa.id == state.selectedSurveyApplication.id;
    });
    if (index != -1) {
      sApps[index] = state.selectedSurveyApplication;
    }
  }
  state.surveyApplications = sApps;
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
  }
  if (_.isNil(surveyAppToSet)) {
    surveyAppToSet = surveyApplication;
  }
  state.selectedSurveyApplication = surveyAppToSet;
}

export const setSelectedSurveyApplicationGroup = (state, group) => {
  state.selectedSurveyApplicationGroup = group;
}
