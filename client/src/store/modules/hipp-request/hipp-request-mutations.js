const _ = require('lodash');

import { UPDATE, SET_REQUEST_STATUS, SET_REQUEST_ERROR,
  UPDATE_WITH_DEFAULTS, SET_DIRTY}
  from './hipp-request-mutation-types';

const mutations = {
  [UPDATE] (state, { path, value }) {
    state.dirty = true;
    _.set(state, path, _.cloneDeep(value))
  },

  [SET_REQUEST_STATUS] (state, status) {
    state.requestStatus = status;
  },

  [SET_REQUEST_ERROR] (state, error) {
    state.requestError = error;
  },

  [UPDATE_WITH_DEFAULTS] (state, defaults) {
    const item = defaults;
    // replace all `null` values with `undefined`
    Object.keys(item).forEach(function(key) {
      item[key] = item[key] == null ? undefined : item[key];
    })
    _.merge(state.hippRequest, item);
    // set tech spec attributes to new objects for Vue change detection to
    // pick up on. Mostly works without this, but array types aren't being
    // picked up.
    Object.keys(state.hippRequest).forEach(function(key) {
      state.hippRequest[key] = _.cloneDeep(state.hippRequest[key]);
    })

    state.dirty = true;
  },

  [SET_DIRTY] (state, dirty) {
    return state.dirty = dirty;
  }
}

export default {
  mutations
}
