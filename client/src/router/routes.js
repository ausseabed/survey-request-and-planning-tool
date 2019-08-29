import Administration from 'components/administration/administration.vue'
import Custodians from 'components/administration/custodians/custodians.vue'
import Login from 'components/login.vue'
import Main from 'components/main.vue'
import Organisations from 'components/administration/organisations/organisations.vue'
import RecordStateLog from 'components/administration/record-state-log.vue'
import ReportTemplates from 'components/administration/report-template/report-templates.vue'
import Roles from 'components/administration/roles.vue'
import SurveyFile from 'components/survey-file.vue'
import SurveyPlanDeliverables from 'components/survey-plan/survey-plan-deliverables.vue'
import SurveyPlanMain from 'components/survey-plan/survey-plan-main.vue'
import SurveyPlanSummary from 'components/survey-plan/survey-plan-summary.vue'
import SurveyPlanTechnicalSpecification from 'components/survey-plan/survey-plan-technical-specification.vue'
import SurveyRequestMain from 'components/survey-request/survey-request-main.vue'
import SurveyRequestPlans from 'components/survey-request/survey-request-plans.vue'
import SurveyRequestSummary from 'components/survey-request/survey-request-summary.vue'
import Users from 'components/administration/users/users.vue'

const routes = [
    { path: '/', component: Main },
    {
      path: '/admin',
      component: Administration,
      children: [
        {
            path: '',
            component: Custodians
        },
        {
          path: 'users',
          component: Users,
        },
        {
          path: 'users/:id',
          component: Users,
        },
        {
          path: 'custodians',
          component: Custodians,
        },
        {
          path: 'custodians/:id',
          component: Custodians,
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
          path: 'roles',
          component: Roles,
        },
        {
          path: 'roles/:id',
          component: Roles,
        },
        {
          path: 'report-templates',
          component: ReportTemplates
        },
        {
          path: 'record-state-log',
          component: RecordStateLog
        },
      ]
    },

    { path: '/login', component: Login },

    {
      path: '/survey-plan/new',
      component: SurveyPlanSummary,
    },
    {
      path: '/survey-plan/:id',
      component: SurveyPlanMain,
      children: [
        {
          path: 'summary',
          component: SurveyPlanSummary,
        },
        {
          path: 'specifications',
          component: SurveyPlanTechnicalSpecification,
        },
        {
          path: 'deliverables',
          component: SurveyPlanDeliverables,
        },
        {
          path: 'attachments',
          component: SurveyFile,
          props: {attachesTo:"survey-plan"}
        },
      ]
    },

    {
      path: '/survey-request/new',
      component: SurveyRequestSummary,
    },
    {
      path: '/survey-request/:id',
      component: SurveyRequestMain,
      children: [
        {
          path: 'summary',
          component: SurveyRequestSummary,
        },
        {
          path: 'attachments',
          component: SurveyFile,
          props: {attachesTo:"survey-request"}
        },
        {
          path: 'survey-plans',
          component: SurveyRequestPlans,
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
