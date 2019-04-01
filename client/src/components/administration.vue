<template>
  <!-- <q-layout view="hHh Lpr lFf"> -->
  <div>
    <q-layout-drawer
      side="left"
      v-model="left"
      class="admin-side-bar"
    >
      <q-scroll-area class="fit">
        <!-- <q-list-header>Administration</q-list-header> -->
        <div class="admin-heading">Administration</div>
        <q-card-separator class="q-mb-md" />
        <q-item to="/admin/users">
          <q-item-side icon="supervisor_account" />
          <q-item-main label="Users" sublabel="Manage user accounts" />
        </q-item>
        <q-item to="/admin/organisations">
          <q-item-side icon="account_balance" />
          <q-item-main label="Organisations" sublabel="Manage organisations" />
        </q-item>

      </q-scroll-area>
    </q-layout-drawer>

    <div class="admin-content">
      <router-view />
      <!-- <div>foo bar</div>
      <div style="padding: 25px 16px 16px;">
        <p class="caption" v-for="n in 150" :key="`left-${n}`">
          <em>Left Panel has intended scroll</em>
        </p>
      </div> -->
    </div>
  </div>
  <!-- </q-layout> -->




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
      left: true,
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

.admin-side-bar > aside {
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 16px;
}

.admin-content {
  margin-left: 32px;
  margin-right: 16px;
}
</style>
