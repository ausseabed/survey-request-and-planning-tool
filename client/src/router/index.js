import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})
router.beforeEach((to, from, next) => {
  if (router.app.$auth.isAuthenticated() && to.path == "/login") {
    next({ path: '/'});
  } else if (router.app.$auth.isAuthenticated() ||
      to.path == "/login" ||
      to.path == "/auth/callback"
    ) {
    // if authenticated go to where they want
    // and prevent redirection if they're going to the login page.
    next();
  } else {
    // set a redirect query param, so we can send the user to where they
    // wanted to go after auth succeeds
    const query = to.path == '/' ? {} : {redirect:to.path};
    next({ path: '/login', query: query });
  }
})

export default router
