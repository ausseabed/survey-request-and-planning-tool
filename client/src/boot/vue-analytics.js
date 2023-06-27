import axios from 'axios';
import VueGtag from 'vue-gtag';

// In prod the client code is hosted by nginx as straight js/html. It doesn't
// have access to any environment variables that could be set in the docker
// container, so instead get the anayltics tracking code from the server via
// a special util handler.

export default ({ router, Vue }) => {
  axios.get('/api/util/analytics-code').then(response => {
    const id = response.data;
    Vue.use(
      VueGtag,
      {
        config: {id: id}
      },
      router
    )
  })
}
