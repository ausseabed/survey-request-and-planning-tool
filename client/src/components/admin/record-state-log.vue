<template>

  <div>
    <q-table
      title="Record State Log"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, -4]">Search by plan/request name, or user name</q-tooltip>
        </q-input>
      </template>
      <template v-slot:body="props" :columns="columns">
        <q-tr :props="props" :columns="columns">
          <q-td v-for="column in columns" :key="column.name" :props="props">
            <template v-if="column.name == 'recordType'">
              <q-icon
                :name="typeDisplayIcon(props.row[column.field])"
                style="font-size: 1.75em;"
              >
                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                  {{ column.format(props.row[column.field]) }}
                </q-tooltip>
              </q-icon>
              <q-btn dense round flat :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" />
            </template>
            <template v-else-if="column.name == 'state'">
              <q-icon
                :name="stateDisplayIcon(props.row[column.field])"
                style="font-size: 1.75em;"
              >
                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                  {{ column.format(props.row[column.field]) }}
                </q-tooltip>
              </q-icon>
            </template>
            <template v-else-if="column.name == 'entityName'">
              <div style="max-width:300px; white-space: normal;">
                {{ column.format(props.row[column.field]) }}
              </div>

            </template>
            <template v-else>
              {{ column.format(props.row[column.field]) }}
            </template>


          </q-td>

        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left q-pl-xl"> {{ props.row.changeDescription }}</div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</template>

<script>
import Vue from 'vue'
const _ = require('lodash');
const moment = require('moment');

import { errorHandler } from './../mixins/error-handling'

// There's no vuex store here as the component only displays information. Vuex
// would only make things more complicated.
// Most of this component is based off the server sync example in the quasar
// docs https://quasar.dev/vue-components/table#Server-side-pagination%2C-filter-and-sorting
export default Vue.extend({
  mounted () {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  methods: {
    onRequest (props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
      let filter = props.filter

      this.loading = true

      // get all rows if "All" (0) is selected
      let fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

      // calculate starting row of data
      let startRow = (page - 1) * rowsPerPage

      // fetch data from "server"
      this.fetchFromServer(startRow, fetchCount, filter).then(res => {

        this.pagination.rowsNumber = res.count;
        // clear out existing data and add new
        this.data.splice(0, this.data.length, ...res.data)

        // don't forget to update local pagination object
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        // ...and turn of loading indicator
        this.loading = false
      })

    },

    async fetchFromServer (startRow, count, filter) {
      const url = `api/record-state`
      const payload = {
        params: {
          start: startRow,
          limit: count,
          filter: filter,
        }
      }

      const res = await Vue.axios.get(url, payload)
      return res.data;
    },

    stateDisplayIcon(recordState) {
      if (recordState == 'draft') {
        return 'edit'
      } else if (recordState == 'finalised') {
        return 'done'
      } else if (recordState == 'underReview') {
        return 'restore_page'
      } else if (recordState == 'accepted') {
        return 'done_all'
      } else {
        return 'help'
      }
    },

    typeDisplayIcon(recordType) {
      if (recordType == 'plan') {
        return 'layers'
      } else if (recordType == 'request') {
        return 'device_hub'
      } else {
        return 'help'
      }
    },
  },

  data() {
    return {
      filter: '',
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        { name: 'recordType', align: 'left', label: 'Type', field: 'recordType', format: val => val },
        { name: 'entityName', align: 'left', label: 'Record name', field: 'entityName', format: val => val },
        {
          name: 'state',
          align: 'left',
          label: 'State',
          field: 'state',
          format: val => {
            var notCamelCase = val.replace( /([A-Z])/g, " $1" );
            var label = notCamelCase.charAt(0).toUpperCase() + notCamelCase.slice(1);
            return label
          },
        },
        { name: 'version', align: 'right', label: 'Ver', field: 'version', format: val => val },
        { name: 'userName', align: 'left', label: 'User', field: 'userName', format: val => val },
        {
          name: 'created',
          label: 'Date',
          field: 'created',
          format: val => {
            return moment(val).fromNow();
          },
        },
      ],
      data: [],
    }
  }
});
</script>

<style>


</style>
