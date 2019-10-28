<template>
  <q-layout
    view="hHh Lpr lff"
    container style="height: calc(100vh - 54px); min-height: calc(100vh - 54px);"
    class="shadow-2 rounded-borders">
    <q-drawer
      side="left"
      v-model="left"
      :width="300"
      :breakpoint="500"
      show-if-above
      bordered
      content-class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <div class="admin-heading">Administration</div>
        <q-separator style="height:2px" class="q-mb-md" />

        <q-item to="/admin/users">
          <q-item-section avatar>
            <q-icon name="perm_identity" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Users</q-item-label>
            <q-item-label caption>Manage user accounts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/admin/custodians">
          <q-item-section avatar>
            <q-icon name="account_balance" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Custodians</q-item-label>
            <q-item-label caption>Manage custodians</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/admin/organisations">
          <q-item-section avatar>
            <q-icon name="location_city" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Organisations</q-item-label>
            <q-item-label caption>Manage organisations</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/admin/roles">
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Roles</q-item-label>
            <q-item-label caption>View role permissions</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator  class="q-my-sm" />
        <q-item to="/admin/report-templates">
          <q-item-section avatar>
            <q-icon name="library_books" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Report templates</q-item-label>
            <q-item-label caption>Upload new report templates</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/admin/documents">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Documents</q-item-label>
            <q-item-label caption>Upload user guides and other static documentation files</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator  class="q-my-sm" />
        <q-item to="/admin/record-state-log">
          <q-item-section avatar>
            <q-icon name="supervisor_account" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Record State Log</q-item-label>
            <q-item-label caption>View changes to record state for requests and plans</q-item-label>
          </q-item-section>
        </q-item>

      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page
        style="height: calc(100vh - 54px); min-height: calc(100vh - 54px);"
        class="q-pt-sm q-pl-sm"
      >
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from 'vue'
const _ = require('lodash');

export default {
  components: {
  },
  computed: {
  },

  data() {
    return {
      left: false,
    }
  }
}
</script>

<style>
.admin-heading {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 2rem;
  padding: 16px;
}

</style>
