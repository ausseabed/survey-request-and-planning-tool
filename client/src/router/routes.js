import Administration from 'components/administration/administration.vue'
import AreaOfInterestProfiles from 'components/priority-area-submission/area-of-interest-profiles.vue'
import Custodians from 'components/administration/custodians/custodians.vue'
import Documents from 'components/administration/document/documents.vue'
import Login from 'components/login.vue'
import Main from 'components/main.vue'
import MarineParks from 'components/administration/marine-parks/marine-parks.vue'
import Organisations from 'components/administration/organisations/organisations.vue'
import PriorityAreaSubmission from 'components/priority-area-submission/priority-area-submission.vue'
import PriorityAreaSubmissionAreas from 'components/priority-area-submission/priority-area-submission-areas.vue'
import PriorityAreaSubmissionConfirmation from 'components/priority-area-submission/priority-area-submission-confirmation.vue'
import PriorityAreaSubmissionRegistration from 'components/priority-area-submission/priority-area-submission-registration.vue'
import RecordStateLog from 'components/administration/record-state-log.vue'
import ReportTemplates from 'components/administration/report-template/report-templates.vue'
import Roles from 'components/administration/roles.vue'
import SurveyFile from 'components/survey-file.vue'
import SurveyPlanDeliverables from 'components/survey-plan/survey-plan-deliverables.vue'
import SurveyPlanMain from 'components/survey-plan/survey-plan-main.vue'
import SurveyPlanSummary from 'components/survey-plan/survey-plan-summary.vue'
import SurveyRequest from 'components/survey-request/survey-request.vue'
import SurveyRequestAreasOfInterest from 'components/survey-request/survey-request-areas-of-interest.vue'
import SurveyRequestBusinessCase from 'components/survey-request/survey-request-business-case.vue'
import SurveyRequestRegistration from 'components/survey-request/survey-request-registration.vue'
import SurveyRequestSubAreaInfo from 'components/survey-request/survey-request-sub-area-info.vue'
import SurveyRequestSubAreaDetails from 'components/survey-request/survey-request-sub-area-details.vue'
import SurveyRequestSubmissionDetails from 'components/survey-request/survey-request-submission-details.vue'
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
        path: 'marine-parks',
        component: MarineParks,
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
        path: 'documents',
        component: Documents
      },
      {
        path: 'record-state-log',
        component: RecordStateLog
      }
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
        path: 'deliverables',
        component: SurveyPlanDeliverables,
      },
      {
        path: 'attachments',
        component: SurveyFile,
        props: { attachesTo: "survey-plan" }
      },
    ]
  },

  {
    path: '/survey-request/:id',
    component: SurveyRequest,
    children: [
      {
        name: 'survey-request-registration',
        path: 'registration',
        component: SurveyRequestRegistration,
      },
      {
        name: 'survey-request-business-case',
        path: 'business-case',
        component: SurveyRequestBusinessCase,
      },
      {
        name: 'survey-request-areas-of-interest',
        path: 'areas-of-interest',
        component: SurveyRequestAreasOfInterest,
      },
      {
        name: 'survey-request-sub-area-details',
        path: 'sub-area-details',
        component: SurveyRequestSubAreaDetails,
      },
      {
        name: 'survey-request-sub-area-info',
        path: 'sub-area-info',
        component: SurveyRequestSubAreaInfo,
      },
      {
        name: 'survey-request-summary',
        path: 'summary',
        component: SurveyRequestSummary,
      },
      {
        name: 'survey-request-submission-details',
        path: 'submission-details',
        component: SurveyRequestSubmissionDetails,
      },
    ]
  },

  {
    path: '/priority-area-submission/:id?',
    component: PriorityAreaSubmission,
    children: [
      {
        path: '',
        component: PriorityAreaSubmissionRegistration,
      },
      {
        path: 'registration',
        name: 'priority-area-submission-registration',
        component: PriorityAreaSubmissionRegistration,
      },
      {
        path: 'areas',
        name: 'priority-area-submission-areas',
        component: PriorityAreaSubmissionAreas,
      },
      {
        path: 'profiles',
        name: 'area-of-interest-profiles',
        component: AreaOfInterestProfiles,
      },
      {
        path: 'confirmation',
        name: 'priority-area-submission-confirmation',
        component: PriorityAreaSubmissionConfirmation,
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
