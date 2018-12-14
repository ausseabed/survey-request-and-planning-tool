import SockJS from 'sockjs-client'
import { setInterval, clearInterval } from 'timers';
const SOCKET_ENDPOINT = 'https://localhost:8888/socket'
var protocolDetect = require('custom-protocol-detection');
import Vue from 'vue'

export const socketConnection = {
  methods: {
    try_open_connection() {
      this.socket_state = this.$sock ? this.$sock.readyState : -1;
      if (this.socket_state !== 1) {
        protocolDetect("qa4l:start", () => {
          this.$q.notify({ type: 'negative', message: "QA4Lab client agent not detected. You can download the latest release from here" });
        }, () => {
          // Attempt to connect every 2 second for 5 times
          this.attempt_remaing = 5;
          this.attempt_interval = setInterval(() => {
            if (this.$sock.readyState === 1) {
              clearInterval(this.attempt_interval);
            }
            else {
              this.attempt_remaing -= 1;

              // Clear iterval, max reached
              if (this.attempt_remaing <= 0 && this.attempt_interval) {
                clearInterval(this.attempt_interval);
              }

              Vue.prototype.$sock = SockJS(SOCKET_ENDPOINT);
              this.open_connection();
            }
          }, 2000);
        });
      }
      else {
        this.open_connection();
      }
    },
    open_connection() {
      this.socket_state = this.$sock ? this.$sock.readyState : -1;
      console.log('Socket is ' + (this.$sock ? 'in state ' + this.$sock.readyState : 'null'));
      if (this.socket_state === 1) {
        // Connection made, clear interval if not null
        if (this.attempt_interval) {
          clearInterval(this.attempt_interval);
        }

        console.log("Connection to QA4Lab server is open")
        return;
      }

      //this.$sock = new SockJS(SOCKET_ENDPOINT);

      this.$sock.onopen = () => {
        if (this.open_handler) {
          this.open_handler();
          this.open_handler = null;
        }
        console.log("Connected....");
        this.socket_state = this.$sock ? this.$sock.readyState : -1;
      }

      this.$sock.onerror = () => {
        console.log("Attempt to connect on error....")
        // setTimeout(this.open_connection, 2000);   // Attempt to connect after 2 seconds
        this.$q.notify({ type: 'negative', message: "Error connecting to qa4lab agent." });
        this.socket_state = this.$sock ? this.$sock.readyState : -1;
      }

      this.$sock.onmessage = (e) => {
        // Messages coming through socket
      };

      this.$sock.onclose = (e) => {
        if (e.code !== 4999) {      // This is app induced, don't bother reconnecting
          console.log("Attempt to connect on close....")
          // setTimeout(this.open_connection, 2000);     // Connection closed attempt to connect again
          this.$q.notify({ type: 'negative', message: 'Connection to qa4lab agent closed.', actions: [{ icon: 'clear' }] });
          this.socket_state = this.$sock ? this.$sock.readyState : -1;
        }
        console.log('close');
      };

      this.socket_state = this.$sock ? this.$sock.readyState : -1;
      return this.$sock;
    },
    onStop() {
      this.$sock.send(JSON.stringify({
        command: "stop"
      }));
    },
    onAbort() {
      window.location.href = 'qa4l:stop';
      this.$sock = null;
    },
  },
  data() {
    return {
      open_handler: null,
      socket_state: -1,
      attempt_interval: null,
      attempt_remaing: 5
    };
  }
}
