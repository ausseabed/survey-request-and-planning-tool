<template>
  <q-page padding class="docs-input row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-card inline style="width:100%" flat>
        <q-card-title>
          Standard Dataset
          <span slot="subtitle">
            Definition for identifying standard dataset in data delivery
          </span>
          <q-btn outline slot="right"
                 icon="arrow_back"
                 label="Go Back"
                 @click="onBack"></q-btn>
        </q-card-title>
        <q-item dense>
          <q-item-main>
            <q-field :label-width="2"
                     label="Name"
                     helper="Name for dataset defintion">
              <q-input type="text"
                       :value="current_standard_dataset.name"
                       @change="update('current_standard_dataset.name', $event)"
                       :disable="!canEdit" />
            </q-field>

            <q-field :label-width="2"
                     label="Description"
                     helper="Description of this dataset defintion">
              <q-input type="textarea"
                       :value="current_standard_dataset.description"
                       @change="update('current_standard_dataset.description', $event)"
                       :disable="!canEdit" />
            </q-field>

            <q-field :label-width="2"
                     label="Public Visible"
                     helper="Can this defintion be used by others?">
              <q-toggle :value="current_standard_dataset.is_public"
                        @change="update('current_standard_dataset.is_public', $event)"
                        :disable="!canEdit" />
            </q-field>
          </q-item-main>
        </q-item>
      </q-card>

      <!-- Point cloud classified -->
      <q-collapsible label="Point Cloud"
                     sublabel="Classified"
                     icon="cloud_queue"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.classified_pointcloud">
          <q-chips-input :value="current_standard_dataset.classified_pointcloud.pattern"
                         @input="update_pattern('current_standard_dataset.classified_pointcloud.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.classified_pointcloud.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.classified_pointcloud.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in las_formats"
                      :key="format.value"
                      :value="current_standard_dataset.classified_pointcloud.formats"
                      @change="update('current_standard_dataset.classified_pointcloud.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Point cloud unclassified -->
      <q-collapsible label="Point Cloud"
                     sublabel="Unclassified"
                     icon="cloud_queue"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.unclassified_pointcloud">
          <q-chips-input :value="current_standard_dataset.unclassified_pointcloud.pattern"
                         @input="update_pattern('current_standard_dataset.unclassified_pointcloud.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.unclassified_pointcloud.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.unclassified_pointcloud.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in las_formats"
                      :key="format.value"
                      :value="current_standard_dataset.unclassified_pointcloud.formats"
                      @change="update('current_standard_dataset.unclassified_pointcloud.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Point cloud MKP -->
      <q-collapsible label="Point Cloud"
                     sublabel="Model Key Points"
                     icon="cloud_queue"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.mkp_pointcloud">
          <q-chips-input :value="current_standard_dataset.mkp_pointcloud.pattern"
                         @input="update_pattern('current_standard_dataset.mkp_pointcloud.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.mkp_pointcloud.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.mkp_pointcloud.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in las_formats"
                      :key="format.value"
                      :value="current_standard_dataset.mkp_pointcloud.formats"
                      @change="update('current_standard_dataset.mkp_pointcloud.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- DEM -->
      <q-collapsible label="Digital Elevation Model"
                     icon="terrain"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.dem">
          <q-chips-input :value="current_standard_dataset.dem.pattern"
                         @input="update_pattern('current_standard_dataset.dem.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.dem.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.dem.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in raster_formats"
                      :key="format.value"
                      :value="current_standard_dataset.dem.formats"
                      @change="update('current_standard_dataset.dem.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- DSM -->
      <q-collapsible label="Digital Surface Model"
                     icon="streetview"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.dsm">
          <q-chips-input :value="current_standard_dataset.dsm.pattern"
                         @input="update_pattern('current_standard_dataset.dsm.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.dsm.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.dsm.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in raster_formats"
                      :key="format.value"
                      :value="current_standard_dataset.dsm.formats"
                      @change="update('current_standard_dataset.dsm.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Imagery -->
      <q-collapsible label="Imagery"
                     icon="image"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.imagery">
          <q-chips-input :value="current_standard_dataset.imagery.pattern"
                         @input="update_pattern('current_standard_dataset.imagery.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.imagery.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.imagery.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in raster_formats"
                      :key="format.value"
                      :value="current_standard_dataset.imagery.formats"
                      @change="update('current_standard_dataset.imagery.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Contours -->
      <q-collapsible label="Contours"
                     icon="leak_add"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.contours">
          <q-chips-input :value="current_standard_dataset.contours.pattern"
                         @input="update_pattern('current_standard_dataset.contours.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.contours.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.contours.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in vector_formats"
                      :key="format.value"
                      :value="current_standard_dataset.contours.formats"
                      @change="update('current_standard_dataset.contours.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Trajectory -->
      <q-collapsible label="Trajectory"
                     icon="flight"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.trajectory">
          <q-chips-input :value="current_standard_dataset.trajectory.pattern"
                         @input="update_pattern('current_standard_dataset.trajectory.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.trajectory.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.trajectory.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in vector_formats"
                      :key="format.value"
                      :value="current_standard_dataset.trajectory.formats"
                      @change="update('current_standard_dataset.trajectory.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Tile Index -->
      <q-collapsible label="Tile Index"
                     icon="grid_on"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.tileindex">
          <q-chips-input :value="current_standard_dataset.tileindex.pattern"
                         @input="update_pattern('current_standard_dataset.tileindex.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.tileindex.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.tileindex.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in vector_formats"
                      :key="format.value"
                      :value="current_standard_dataset.tileindex.formats"
                      @change="update('current_standard_dataset.tileindex.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Video -->
      <q-collapsible label="Video"
                     icon="local_movies"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.video">
          <q-chips-input :value="current_standard_dataset.video.pattern"
                         @input="update_pattern('current_standard_dataset.video.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.video.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.video.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in video_formats"
                      :key="format.value"
                      :value="current_standard_dataset.video.formats"
                      @change="update('current_standard_dataset.video.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Control Points -->
      <q-collapsible label="Control Points"
                     icon="my_location"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.controlpoints">
          <q-chips-input :value="current_standard_dataset.controlpoints.pattern"
                         @input="update_pattern('current_standard_dataset.controlpoints.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.controlpoints.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.controlpoints.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in vector_formats"
                      :key="format.value"
                      :value="current_standard_dataset.controlpoints.formats"
                      @change="update('current_standard_dataset.controlpoints.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Metadata -->
      <q-collapsible label="Metadata"
                     icon="fa fa-tags"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.metadata">
          <q-chips-input :value="current_standard_dataset.metadata.pattern"
                         @input="update_pattern('current_standard_dataset.metadata.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.metadata.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.metadata.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in meta_formats"
                      :key="format.value"
                      :value="current_standard_dataset.metadata.formats"
                      @change="update('current_standard_dataset.metadata.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <!-- Project Report -->
      <q-collapsible label="Project Report"
                     icon="assignment_turned_in"
                     popup>
        <q-field :label-width="2"
                 label="Pattern"
                 class="helper-with-example"
                 :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed.report">
          <q-chips-input :value="current_standard_dataset.report.pattern"
                         @input="update_pattern('current_standard_dataset.report.pattern', $event)"
                         @duplicate="duplicateAdded($event, 'current_standard_dataset.report.pattern')"
                         placeholder="Select named patterns by typing their name, for static texts just type them in"
                         ref="current_standard_dataset.report.pattern"
                         :disable="!canEdit">
            <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
          </q-chips-input>
        </q-field>
        <q-field :label-width="2"
                 label="Formats"
                 helper="Possible file formats in which this dataset could be delivered">
          <q-checkbox v-for="format in report_formats"
                      :key="format.value"
                      :value="current_standard_dataset.report.formats"
                      @change="update('current_standard_dataset.report.formats', $event)"
                      :label="format.label"
                      :val="format.value"
                      :disable="!canEdit"
                      style="margin-right: 10px" />
        </q-field>
      </q-collapsible>

      <q-card inline style="width:100%" flat>
        <q-item v-if="canEdit && isLoggedUser">
          <q-item-tile class="self-end">
            <q-btn icon="save"
                   @click="saveStandardDataset"
                   :label="datasetLabel" />

            <q-btn v-if="id && isLoggedUser"
                   icon="delete"
                   color="negative"
                   @click="deleteStandardDataset"
                   label="Delete" />
          </q-item-tile>
        </q-item>

        <q-item v-if="!isLoggedUser">
          <span class="label bg-orange text-white" style="padding:10px;">
            Please login to create/update or delete a custom dataset
          </span>
        </q-item>
      </q-card>
    </div>
  </q-page>
</template>
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import { errorHandler } from './../mixins/error-handling'
  import { datasetDefinition } from './../mixins/dataset-definitions'

  export default Vue.extend({
    mixins: [errorHandler, datasetDefinition],
    mounted() {
      console.log(this.$route.params)
      if (this.$route.params) {
        var known_sd = _.find(this.available_standard_datasets, (d) => {
          return d.id === this.$route.params.id;
        });

        if (known_sd) {
          this.id = known_sd.id;
          this.update('current_standard_dataset', known_sd);
        }
      }
    },
    methods: {
      onBack() {
        this.$router.go(-1);
      },
      update(key, event) {
        this.$store.commit('common/update', { path: key, value: event })
      },
      update_pattern(key, event) {
        this.update(key, event);
        this.update(key.replace('.pattern', '.pattern_regex'), this.regex_pattern(event));
      },
      duplicateAdded(value, target) {
        var model_value = _.clone(_.get(this, target));
        model_value.push(value);
        this.$refs[target].input = '';
        this.update(target, model_value);
      },
      saveStandardDataset() {
        if (!this.current_standard_dataset.name) { this.$q.notify({ type: 'negative', message: "Dataset defintion name is required.", position: 'bottom-left' }); return; }
        this.$store.dispatch('common/saveDataset', _.assign(this.current_standard_dataset, { type: 'standard' })).catch((e) => { this.handleApiError(e) })
      },
      deleteStandardDataset() {
        this.$q.dialog({
          title: 'Delete Dataset Defintion?',
          message: 'Type the name of the dataset to delete. Once deleted, the dataset defintion cannot be used, this will not affect any requirement forms created with this dataset definition.',
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          color: 'secondary'
        }).then(data => {
          if (data === this.current_standard_dataset.name) {
            this.$store.dispatch('common/deleteDataset', { type: 'standard', id: this.id }).catch((e) => { this.handleApiError(e) })
          }
        }).catch(() => {
          // Let it pass nothing to do
        })
      }
    },
    computed: {
      ...mapGetters({
        available_standard_datasets: 'common/standard_datasets',
        current_standard_dataset: 'common/current_standard_dataset'
      }),
      canEdit() {
        return _.isNil(this.current_standard_dataset.created_by) || (this.$auth.getPayload() && this.$auth.getPayload().id === this.current_standard_dataset.created_by);
      },
      patterns_example_computed() {
        return _.reduce(this.current_standard_dataset, (accumulator, product, key) => {
          if (product && product.hasOwnProperty('pattern')) {
            accumulator[key] = this.example_from_pattern(product.pattern)
          }
          return accumulator;
        }, {});
      }
    }
  })
</script>
<style>
  .helper-with-example .q-field-helper {
    white-space: pre;
  }
</style>
