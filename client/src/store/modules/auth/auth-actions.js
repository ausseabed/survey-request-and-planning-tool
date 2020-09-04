import Vue from 'vue'

import * as mutTypes from './auth-mutation-types';
import * as custodianMutTypes from '../custodian/custodian-mutation-types';
import * as roleMutTypes from '../role/role-mutation-types';


export const authenticate = ({ commit, dispatch }) => {
  return new Promise((resolve, reject) => {
    const auth = Vue.prototype.$auth;

    auth.authenticate('crcsi')
    .then(() => {
      const isAuthenticated = auth.isAuthenticated();
      commit(mutTypes.SET_AUTHENTICATED, isAuthenticated);

      if (isAuthenticated) {
        dispatch('role/getUserRole', null, { root: true });
        dispatch('custodian/getUserCustodian', null, { root: true });
      }

      resolve(isAuthenticated);
    })
    .catch((error) => {
      reject(error);
    });
  });

}

export const checkAuthentication = ({ commit, dispatch }) => {
  const auth = Vue.prototype.$auth;
  const isAuthenticated = auth.isAuthenticated();
  commit(mutTypes.SET_AUTHENTICATED, isAuthenticated);
}

export const logout = ({ commit, dispatch }) => {

  const auth = Vue.prototype.$auth;

  auth.logout();
  commit(
    'role/' + roleMutTypes.SET_USER_ROLE,
    undefined,
    { root: true }
  );
  commit(
    'custodian/' + custodianMutTypes.SET_USER_CUSTODIAN,
    undefined,
    { root: true }
  );

  const isAuthenticated = auth.isAuthenticated();
  commit(mutTypes.SET_AUTHENTICATED, isAuthenticated);

  Vue.prototype.$q.cookies.remove('Authorization');

}
