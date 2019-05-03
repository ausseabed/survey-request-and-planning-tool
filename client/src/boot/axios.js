import axios from 'axios'
import VueAxios from 'vue-axios';

export default ({ Vue }) => {
  Vue.use(VueAxios, axios);
  // Todo: see if the baseURL can be dynamic...
  // axios.defaults.baseURL = process.env.API_HOST;
}
