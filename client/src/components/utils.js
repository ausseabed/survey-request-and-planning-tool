// collection of util functions used throughout the application

const _ = require('lodash');

export function surveyPlanStatusIconDetails(surveyPlanStatus) {
  const ps = surveyPlanStatus.toLowerCase()
  if (ps == "planning") {
    return {icon: "assignment", color:"amber-5"};
  } else if (ps == "scheduled") {
    return {icon: "event", color:"primary"};
  } else if (ps == "complete") {
    return {icon: "check_circle_outline", color:"positive"};
  } else if (ps == "abandoned") {
    return {icon: "not_interested", color:"grey-3"};
  } else {
    // shouldn't happen, but if it does a new status option has been
    // added
    return {icon: "bug_report", color:"negative"}
  }
}

export function recordStateDetails(recordState) {
  if (_.isNil(recordState)) {
    recordState = 'draft'
  }
  else if (!_.isString(recordState)) {
    recordState = recordState.state
  }

  if (recordState == 'draft') {
    return {
      label: "Draft",
      icon: 'edit',
    }
  } else if (recordState == 'finalised') {
    return {
      label: "Finalised",
      icon: 'done',
    }
  } else if (recordState == 'underReview') {
    return {
      label: "Under Review",
      icon: 'restore_page',
    }
  } else if (recordState == 'accepted') {
    return {
      label: "Accepted",
      icon: 'done_all'
    }
  } else {
    return {
      label: "Unknown",
      icon: 'help'
    }
  }
}
