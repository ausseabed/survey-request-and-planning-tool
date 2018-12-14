
export const lastEvaluatedKey = state => {
  return state.projects.last_key
}

export const forceStartOn = state => {
  return state.projects.forceStart;
}

export const projects = state => {
  return state.projects.project_list;
}

export const check_groups = state => {
  return state.check_groups;
}

export const selected_checks = state => {
  var checks = [];
  _.reduce(state.check_groups, (accumulator, g) => {
    _.each(g.checks, (c) => {
      if (c.is_checked) {
        accumulator.push(c.id);
      }
    });
    return accumulator;
  }, checks);
  return checks;
}

export const is_check_selected = (state, getters) => {
  return getters.selected_checks.length > 0;
}
