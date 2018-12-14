import Vue from 'vue'

export const createSession = ({ commit, state }) => {
  return Vue.axios.post('/api/uav/' + state.id + '/session', state)
    .then((response) => {
      return commit('replace', response.data);
    })
    .catch((error) => {
      console.log(error)
    });
}

export const getSession = ({ commit, state }, payload) => {

}
