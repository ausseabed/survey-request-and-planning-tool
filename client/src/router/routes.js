import Hello from 'components/Hello.vue'

import UavHome from 'components/uav/Home.vue'
import UavSurvey from 'components/uav/Survey.vue'
import UavTender from 'components/uav/Tender.vue'
import UavSession from 'components/uav/Session.vue'
import UavProjects from 'components/uav/Projects.vue'
import UavProjectMetadata from 'components/uav/ProjectMetadata.vue'


import CustomDataset from 'components/controls/CreateCustomDataset.vue'
import StandardDataset from 'components/controls/CreateStandardDataset.vue'

export default [
    { path: '/', component: Hello },

    { path: '/customdataset/:id', name: 'CreateCustomDataset', component: CustomDataset },
    { path: '/standarddataset/:id', name: 'StandardDataset', component: StandardDataset },

    { path: '/uav', component: UavHome },
    { path: '/uav/survey', component: UavSurvey },
    { path: '/uav/tender', component: UavTender },
    { path: '/uav/session', component: UavSession },
    { path: '/uav/project', component: UavProjects },
    { path: '/uav/project-metadata', component: UavProjectMetadata },

    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    }
]
