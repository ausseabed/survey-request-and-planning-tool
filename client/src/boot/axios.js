import axios from 'axios'
import VueAxios from 'vue-axios';

export default ({ app, router, Vue, store }) => {
  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response.status === 401) {
        router.app.$auth.logout()
        router.push({ path: `/login` })
      }
      return Promise.reject(error)
    }
  );
  Vue.use(VueAxios, axios);
  // Todo: see if the baseURL can be dynamic...
  // axios.defaults.baseURL = process.env.API_HOST;
}
