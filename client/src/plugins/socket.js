import SockJS from 'sockjs-client'
const SOCKET_ENDPOINT = 'https://localhost:8888/socket'

export default ({ Vue }) => {
  Vue.prototype.$sock = SockJS(SOCKET_ENDPOINT);
}
