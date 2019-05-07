import Administration from 'components/administration.vue'
import HippMain from 'components/hipp/hipp-main.vue'
import HippSummary from 'components/hipp/hipp-summary.vue'
import Login from 'components/login.vue'
import Main from 'components/main.vue'
import Organisations from 'components/organisations/organisations.vue'
import ProjectMain from 'components/project-main.vue'
import ProjectMetadata from 'components/project-metadata.vue'
import SurveyDeliverables from 'components/survey-deliverables.vue'
import SurveyFile from 'components/survey-file.vue'
import SurveyTechnicalSpecification from 'components/survey-technical-specification.vue'
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
      path: '/survey/new',
      component: ProjectMetadata,
    },
    {
      path: '/survey/:id',
      component: ProjectMain,
      children: [
        {
          path: 'summary',
          component: ProjectMetadata,
        },
        {
          path: 'specifications',
          component: SurveyTechnicalSpecification,
        },
        {
          path: 'deliverables',
          component: SurveyDeliverables,
        },
        {
          path: 'attachments',
          component: SurveyFile,
          props: {attachesTo:"survey"}
        },
      ]
    },

    {
      path: '/hipp-request/new',
      component: HippSummary,
    },
    {
      path: '/hipp-request/:id',
      component: HippMain,
      children: [
        {
          path: 'summary',
          component: HippSummary,
        },
        {
          path: 'attachments',
          component: SurveyFile,
          props: {attachesTo:"hipp-request"}
        },
      ]
    },

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
