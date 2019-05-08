<template>
  <form-wrapper :validator="$v" :messages="validationMessagesOverride"
    class="row justify-center">

    <q-page padding class="docs-input row justify-center">
      <q-page-sticky
        position="top-right"
        :offset="hippRequest.id ? [18, 18+66] : [18, 18]"
        style="z-index:100">

        <q-btn
          round
          color="primary"
          @click="submit"
          icon="save"
          class="q-ml-sm"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Save summary</q-tooltip>
        </q-btn>
        <q-btn :disable="!hippRequest.id"
          round
          color="primary"
          @click="deleteHippRequest"
          icon="delete"
          class="q-ml-sm"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 4]">Delete project</q-tooltip>
        </q-btn>
      </q-page-sticky>

      <div style="width: 900px; max-width: 90vw;" class="column q-gutter-md">
        <div v-if="!hippRequest.id" class="text-h5"> New HIPP Request </div>
        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Basic </div>
          </q-card-section>
          <q-card-section>
            <form-field-validated-input
              name="hippRequest.name"
              attribute="name"
              label="Name"
              :value="hippRequest.name"
              @input="update({path:'hippRequest.name', value:$event})"
              @blur="$v.hippRequest.name.$touch"
              type="text"
              >
            </form-field-validated-input>

            <form-field-validated-select
              name="hippRequest.requestingAgency"
              attribute="Requesting Agency"
              label="Requesting Agency"
              :value="hippRequest.requestingAgency"
              @input="update({path:'hippRequest.requestingAgency', value:$event})"
              :options="organisations"
              option-label="name"
              option-value="id"
              @blur="$v.hippRequest.requestingAgency.$touch"
              >
            </form-field-validated-select>

            <form-field-validated-input
              name="hippRequest.requestorName"
              attribute="Requestor’s Name"
              label="Requestor’s Name"
              :value="hippRequest.requestorName"
              @input="update({path:'hippRequest.requestorName', value:$event})"
              @blur="$v.hippRequest.requestorName.$touch"
              type="text"
              >
            </form-field-validated-input>

            <form-field-validated-input
              name="hippRequest.pointOfContactDetails"
              label="Contact email"
              attribute="Contact email"
              :value="hippRequest.pointOfContactDetails"
              @input="update({path:'hippRequest.pointOfContactDetails', value:$event})"
              @blur="$v.hippRequest.pointOfContactDetails.$touch"
              type="email"
              >
            </form-field-validated-input>

            <form-field-validated
              name="hippRequest.requestDate"
              label="Request Date"
              attribute="Request Date"
              >
              <q-date :landscape="$q.platform.is.desktop"
                :value="formattedRequestDate"
                @input="setFormattedRequestDate($event)"
                @blur="$v.hippRequest.requestDate.$touch" />
            </form-field-validated>

            <form-field-validated-input
              name="hippRequest.areaName"
              attribute="Area Name"
              label="Name of the Area to be surveyed"
              :value="hippRequest.areaName"
              @input="update({path:'hippRequest.areaName', value:$event})"
              @blur="$v.hippRequest.areaName.$touch"
              type="text"
              >
            </form-field-validated-input>

          </q-card-section>
        </q-card>

        <q-card class="full-width">
          <q-card-section>
            <div class="text-h6"> Moratorium </div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <q-field
              class="col-12 col-md-6"
              stack-label
              label="Subject to moratorium"
              hint="Optional"
              bottom-slots>
              <q-checkbox
                :value="hippRequest.hasMoratorium"
                @input="update({path:'hippRequest.hasMoratorium', value: $event})"
                />
            </q-field>

            <form-field-validated-input
              class="col-12 col-md-6"
              v-if="hippRequest.hasMoratorium"
              filled
              name="hippRequest.moratoriumDate"
              attribute="Date moratorium ends"
              label="Date moratorium ends (YYYY/MM/DD)"
              :value="formattedMoratoriumDate"
              @input="setFormattedMoratoriumDate($event)"
              @blur="$v.hippRequest.moratoriumDate.$touch"
              >

                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date
                      :value="formattedMoratoriumDate"
                      @input="setFormattedMoratoriumDate($event)"
                      @blur="$v.hippRequest.moratoriumDate.$touch"
                      />
                  </q-popup-proxy>
                </q-icon>

            </form-field-validated-input>
          </q-card-section>
        </q-card>

      </div>
    </q-page>

    <confirm-navigation id="confirmNavigation" ref="confirmNavigation"></confirm-navigation>
  </form-wrapper>
</template>
<script>
import Vue from 'vue'
import { date } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'
const _ = require('lodash');
import { DirtyRouteGuard } from './../mixins/dirty-route-guard'
import { errorHandler } from './../mixins/error-handling'
import * as hippMutTypes
  from '../../store/modules/hipp-request/hipp-request-mutation-types'
import * as orgMutTypes
  from '../../store/modules/organisation/organisation-mutation-types'
import OlMap from './../olmap/olmap';
import { required, email, minLength } from 'vuelidate/lib/validators';

const timespan = require('readable-timespan');
timespan.set({
  lessThanFirst: 'now',
  millisecond: false
});

import axios from 'axios';
const path = require('path');

// custom validators
const validMoratorium = (value, vm) => {
  if (vm.hasMoratorium) {
    // only needs date if the moratorium check has been set
    return !_.isNil(vm.moratoriumDate)
  } else {
    return true
  }
};

export default Vue.extend({
  mixins: [DirtyRouteGuard, errorHandler],

  beforeMount() {
    this.getFormData();
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    ...mapActions('hippRequest', [
      'getHippRequest',
      'saveHippRequest',
    ]),
    ...mapActions('organisation', [
      'getOrganisations',
    ]),
    ...mapMutations('hippRequest', {
      'setDirty': hippMutTypes.SET_DIRTY,
      'update': hippMutTypes.UPDATE,
      'resetHippRequest': hippMutTypes.RESET_HIPP_REQUEST,
    }),
    ...mapMutations('organisation', {
      'setDeletedOrganisations': orgMutTypes.SET_DELETED_ORGANISATIONS,
    }),

    fetchData () {
      if (this.$route.params.id) {
        // if id given, then load this hipp request
        this.getHippRequest({ id: this.$route.params.id })
      } else {
        // a new hipp request so clear whatever is in store
        this.resetHippRequest()
      }
    },

    setFormattedRequestDate(requestDate) {
      if (_.isNil(requestDate)) {
        this.update({path:'hippRequest.requestDate', value:undefined})
        return
      }
      let d = Date.parse(requestDate)
      this.update({path:'hippRequest.requestDate', value:d})
    },

    setFormattedMoratoriumDate(requestDate) {
      this.tmpMoratoriumDateEntry = requestDate;
      // check if no text provided, or if the string contains two / chars
      if (_.isNil(requestDate) || (requestDate.match(/\//g) || []).length != 2) {
        this.update({path:'hippRequest.moratoriumDate', value:undefined})
        return
      }
      let d = Date.parse(requestDate)
      if (_.isNaN(d)) {
        this.update({path:'hippRequest.moratoriumDate', value:undefined})
        return
      }
      this.update({path:'hippRequest.moratoriumDate', value:d})
    },

    submit() {
      this.$v.$touch()

      if (this.$v.$error) {
        this.notifyError('Please review fields')
        return
      }

      const isNew = (
        _.isNil(this.hippRequest.id) ||
        this.hippRequest.id.length == 0)

      this.saveHippRequest().then((hr) => {
        if (isNew) {
          this.$router.replace({ path: `/hipp-request/${hr.id}/summary` })
        }
        this.notifySuccess('Saved HIPP Request')
      })
    },

    deleteHippRequest() {
      if (this.hippRequest.id) {
        // an existing id indicated this project has been saved, so check
        // with user if they really want to delete project.
        this.$q.dialog({
          title: 'Delete HIPP Request',
          message: `HIPP Request ${this.hippRequest.name} will be deleted`,
          ok: 'Delete',
          cancel: 'Cancel'
        }).onOk(() => {
          // this.$store.dispatch(
          //   'projectMetadata/deleteProjectMetadata',
          //   { id: this.id }
          // ).then(pmd => {
          //   this.notifySuccess('Deleted project');
          //   this.$router.replace({ path: `/` });
          // });
        })
      } else {
        // no id, so hasn't been saved. I this case reset form and go back
        // to main page.
        this.resetHippRequest()
        this.$router.replace({ path: `/` })
      }
    },

    getFormData() {
      // only get non-deleted organisations
      this.setDeletedOrganisations(false);
      // gets the list of all orgs, not just those associated to this project
      this.getOrganisations();
    },
  },

  computed: {
    ...mapGetters('hippRequest', [
      'hippRequest',
      'dirty',
    ]),
    ...mapGetters('organisation', [
      'organisations',
    ]),
    formattedRequestDate: function() {
      if (_.isNil(this.hippRequest.requestDate)) {
        return undefined;
      }
      const d = new Date();
      d.setTime(this.hippRequest.requestDate);
      let formattedString = date.formatDate(d, 'YYYY/MM/DD')
      return formattedString
    },
    formattedMoratoriumDate: function() {
      if (_.isNil(this.tmpMoratoriumDateEntry) && !_.isNil(this.hippRequest.moratoriumDate)) {
        const d = new Date();
        d.setTime(this.hippRequest.moratoriumDate);
        let formattedString = date.formatDate(d, 'YYYY/MM/DD')
        this.tmpMoratoriumDateEntry = formattedString
      }
      return this.tmpMoratoriumDateEntry
    },

  },

  validations: {
    hippRequest: {
      name: { required, minLength:minLength(1) },
      requestingAgency: { required },
      requestorName: { required },
      pointOfContactDetails: { required, email },
      requestDate: { required },
      areaName: {required},
      area: {},
      businessJustification: {},
      costBenefit: {},
      moratoriumDate: {validMoratorium},
    }
  },

  watch: {
    // update data if route changes to a new id
    '$route': function (newRoute, oldRoute) {
      if (this.id == newRoute.params.id) {
        // then we've only set the url, no need to fetch new data
      } else {
        this.fetchData();
      }
    },
    'hippRequest.hasMoratorium': function (newM, oldM) {
      this.$v.hippRequest.moratoriumDate.$touch()
    },
  },

  data() {
    return {
      tmpMoratoriumDateEntry: undefined,
      validationMessagesOverride: {
        validMoratorium: "Must provide valid moratorium date"
      }
    }
  }
});

</script>

<style>

</style>
