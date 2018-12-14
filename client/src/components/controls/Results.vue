<template>
  <div>
    <q-collapsible icon="fas fa-globe" label="Coordinate System & File Attributes" popup :opened="has_spatial_ref_attr" icon-toggle>
      <q-list separator>
        <q-item>
          <q-item-side left>
            <q-btn flat round dense icon="more_horiz" @click="showDetailsModal(hcs_check)" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>Horizontal Coordinate System</q-item-tile>
            <q-item-tile sublabel>{{hcs_check.result_summary}}</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <status :value="hcs_check.adjusted_pass"
                    :status_changed="hcs_check.adjusted_pass !== hcs_check.pass"
                    :disabled="hcs_check.pass == 'PENDING'"
                    @input="result_status_changed('C9D2B796-C1A4-44BE-9736-33F6BFC7196E', $event)"></status>
          </q-item-side>
        </q-item>
      </q-list>
    </q-collapsible>

    <!-- Show detailed reason as dialog -->
    <q-modal v-model="showDetails" :content-css="{minWidth: '80vw', minHeight: '80vh', padding: '20px'}">
      <h4>{{detailsHeading}}</h4>
      <q-input v-model="comments"
               :max-height="50"
               float-label="Add comments..."
               type="textarea"
               :after="[{icon: 'arrow_forward', content: true, handler () {addComments()}}]" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn color="primary"
               fab
               v-back-to-top.animate="{offset: 500, duration: 200}"
               class="animate-pop">
          <q-icon name="keyboard_arrow_up" />
        </q-btn>
      </q-page-sticky>

      <q-list inset-separator v-if="reasons.length > 0">
        <q-item v-for="(reason, idx) in reasons" :key="idx">
          <q-item-main>
            <q-item-tile label>{{reason}}</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import CheckStatus from './CheckStatus.vue'

  export default Vue.extend({
    components: {
      'status': CheckStatus
    },
    props: ['result'],
    methods: {
      result_status_changed(check_id, e) {
        // TODO: Post result status change
        console.log(check_id + ' ' + e);
      },
      showDetailsModal(chk) {
        this.showDetails = true;
        this.detailsHeading = chk.check_name;
        this.reasons = chk.reasons ? chk.reasons : [];
      },
      addComments() {
        // TODO: Post comments
      }
    },
    computed: {
      has_spatial_ref_attr() {
        return this.hcs_check ? true : false;
      },
      hcs_check() {
        return this.result ? this.result['C9D2B796-C1A4-44BE-9736-33F6BFC7196E'] : { pass: 'PENDING', adjusted_pass: 'PENDING'};
      }
    },
    data() {
      return {
        reasons: [],
        comments: null,
        showDetails: false,
        detailsHeading: null
      }
    }
  });

</script>
<style lang="stylus">
</style>
