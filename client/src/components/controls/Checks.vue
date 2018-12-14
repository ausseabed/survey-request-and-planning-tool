<template>
  <div>
    <q-list v-for="(check_group, k, idx) in check_groups" :key="check_group.group_id">
      <q-list-header>
        <q-checkbox :value="check_group.is_checked"
                    :label="check_group.group_name"
                    @change="update_check_group(check_group.group_id, $event)"
                    :disabled="check_group.group_id === 0"/>
      </q-list-header>
      <q-item v-for="(check, k, idx) in check_group.checks" :key="idx" tag="label">
        <q-item-side>
          <q-checkbox :value="check.is_checked"
                      @change="update_check(check.id, $event)"
                      v-model="check.is_checked"
                      :disabled="check_group.group_id === 0"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile title>
            {{check.name}}
          </q-item-tile>
          <q-item-tile>
            <q-progress v-if="check.is_running" :percentage="check.progress" color="primary" />
          </q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  export default Vue.extend({
    methods: {
      update_check(check_id, is_checked) {
        this.$store.commit('uav_common/update_check', { check_id: check_id, is_checked: is_checked })
      },
      update_check_group(group_id, is_checked) {
        this.$store.commit('uav_common/update_check_group', { group_id: group_id, is_checked: is_checked })
      }
    },
    computed: {
      ...mapGetters({
        checks: 'uav_common/check_groups',
      }),
      check_groups() {
        return _.cloneDeep(this.checks);
      }
    },
    data() {
      return {
      }
    }
  })
</script>
<style lang="stylus">
</style>
