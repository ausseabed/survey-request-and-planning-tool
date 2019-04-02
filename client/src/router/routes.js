import Administration from 'components/administration.vue'
import Login from 'components/login.vue'
import Main from 'components/Main.vue'
import Organisations from 'components/organisations/organisations.vue'
import ProjectMain from 'components/project-main.vue'
import ProjectMetadata from 'components/uav/ProjectMetadata.vue'
import SurveyTechnicalSpecification
  from 'components/uav/survey-technical-specification.vue'
import SurveyFile from 'components/uav/survey-file.vue'
import SurveyDeliverables from 'components/uav/survey-deliverables.vue'
import Users from 'components/users/users.vue'

export default [
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
            component: Users
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
        },
      ]
    },

    { path: '/project-metadata', component: ProjectMetadata },
    { path: '/project-metadata/:id', component: ProjectMetadata },
    { path: '/survey-technical-specification/:id',
      component: SurveyTechnicalSpecification},
    { path: '/survey-file/:id', component: SurveyFile},
    { path: '/survey-deliverables/:id', component: SurveyDeliverables},

    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    }
]
