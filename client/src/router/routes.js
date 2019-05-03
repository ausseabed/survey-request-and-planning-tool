import Administration from 'components/administration.vue'
import Login from 'components/login.vue'
import Main from 'components/main.vue'
import Organisations from 'components/organisations/organisations.vue'
import Users from 'components/users/users.vue'

const routes = [
    { path: '/', component: Main },
    {
      path: '/admin',
      component: Administration,
      children: [
        {
          path: 'users',
          component: Users,
        },
        {
          path: 'organisations',
          component: Organisations,
        },
        {
          path: 'organisations/:id',
          component: Organisations,
        },
        {
            path: '',
            component: Organisations
        },
      ]
    },

    { path: '/login', component: Login },

    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
