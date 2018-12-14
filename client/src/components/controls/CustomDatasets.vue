<template>
  <div>
    <q-list v-if="custom_datasets_with_format.length > 0" separator>
      <q-item multiline v-for="cd in custom_datasets_with_format" :key="cd.id">
        <q-item-main :label="cd.name"
                     :sublabel="cd.description"
                     label-lines="1"
                     sublabel-lines="2">
          <br />
          <q-checkbox v-for="format in cd.available_formats"
                      :key="format.value"
                      :value="cd.formats"
                      @change="updateFormat(cd.id, $event)"
                      :label="format.label"
                      :val="format.value"
                      style="margin-right: 10px" />
        </q-item-main>
        <q-item-side right>
          <!-- Icon should be edit or view based on user privilage -->
          <q-item-tile><q-btn flat round dense :icon="canEditIcon(cd)" @click="onEdit(cd.id)" /></q-item-tile>
          <q-item-tile><q-btn color="negative" flat round dense icon="delete" @click="onDelete(cd.id)" /></q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  export default Vue.extend({
    computed: {
      ...mapGetters({
        available_custom_datasets: 'common/custom_datasets',
        custom_datasets: 'uav_tender/custom_datasets',
      }),
      custom_datasets_with_format() {
        return _.reduce(this.custom_datasets, (result, d) => {
          d = _.cloneDeep(d);
          if (d) {
            var cd = _.find(this.available_custom_datasets, (ad) => {
              return ad.id === d.id;
            });
            if (cd) {
              d.available_formats = cd.formats;
              result.push(d)
            }
          }

          return result;
        }, []);
      }
    },
    methods: {
      canEditIcon(cd) {
        // If custom dataset was created by user then it can be edited else read only
        return this.$auth.getPayload() && this.$auth.getPayload().id === cd.created_by ? 'mode_edit' : 'fas fa-eye';
      },
      onDelete(id) {
        this.$store.commit('uav_tender/removeCustomDataset', id);
      },
      onEdit(id) {
        this.$router.push({ path: '../customdataset/' + id })
      },
      updateFormat(id, event) {
        this.$store.commit('uav_tender/updateCustomDatasetFormats', {
          id: id,
          value: event
        })
      }
    }
  });
</script>
<style lang="stylus">

</style>
