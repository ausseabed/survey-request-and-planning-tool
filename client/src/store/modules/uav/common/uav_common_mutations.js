export const clearProjectList = (state, payload) => {
  state.projects.project_list.splice(0, state.projects.project_list.length);
}

export const AddProjectsToList = (state, projectList) => {
  _.each(projectList, (t) => {
    var idx = _.findIndex(state.projects.project_list, (l) => {
      return t.id === l.id;
    });

    if (idx > -1) {
      state.projects.project_list.splice(idx, 1, t);
    }
    else {
      state.projects.project_list.push(t);
    }
  })
}

export const removeProjectFromList = (state, tender_id) => {
  var idx = _.findIndex(state.projects.project_list, (l) => {
    return tender_id === l.id;
  });

  if (idx > -1) {
    state.projects.project_list.splice(idx, 1);
  }
}

export const removeSessionFromProject = (state, { id, session_id }) => {
  var pIdx = _.findIndex(state.projects.project_list, (p) => {return id === p.id;});
  if (pIdx > -1) {
    var project = state.projects.project_list[pIdx];
    var idx = _.findIndex(project.sessions, (s) => { return session_id === s.session_id; });
    if (idx > -1) {
      project.sessions.splice(idx, 1);
      state.projects.project_list.splice(pIdx, 1, project);
    }
  }
}

export const turnProjectForceOn = (state, onOff) => {
  state.projects.forceStart = onOff;
}

export const setProjectLastKey = (state, lastKey) => {
  state.projects.lastKey = lastKey;
}

export const update_check_group = (state, { group_id, is_checked }) => {
  var idx = _.findIndex(state.check_groups, (c) => { return c.group_id === group_id });

  if (idx > -1) {
    var check_group = state.check_groups[idx];
    check_group.is_checked = is_checked;
    _.each(check_group.checks, c => {
      c.is_checked = is_checked;
    })

    state.check_groups.splice(idx, 1, check_group);
  }
}

export const update_check = (state, { check_id, is_checked }) => {
  _.each(state.check_groups, (g, gIdx) => {
    var idx = _.findIndex(g.checks, (c) => { return c.id === check_id });

    if (idx > -1) {
      var check = g.checks[idx];
      check.is_checked = g.group_id === 0 ? true: is_checked;
      g.checks.splice(idx, 1, check);
      
      var is_all_checks = _.uniq(_.map(g.checks, 'is_checked'));
      if (is_all_checks.length > 1) {
        g.is_checked = null;
      }
      else {
        if (is_all_checks[0] === true) {
          g.is_checked = true;
        }
        else if (is_all_checks[0] === false) {
          g.is_checked = false;
        }
      }

      state.check_groups.splice(gIdx, 1, g);

      return false;   // Break the loop
    }
  })
}

export const set_check_progress = (state, { check_id, progress }) => {
  _.each(state.check_groups, (g, gIdx) => {
    var idx = _.findIndex(g.checks, (c) => { return c.id.toLowerCase() === check_id.toLowerCase() });
    if (idx > -1) {
      var check = g.checks[idx];
      if (progress.progress === check.progress) return false;
      check = _.merge(check, progress)

      //check.progress = progress;
      //check.is_running = progress >= 100 ? false : true;

      g.checks.splice(idx, 1, check);
      state.check_groups.splice(gIdx, 1, g);
      return false;   // Break the loop
    }
  });
}
