<template>
  <q-page padding class="docs-input row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-card inline style="width:100%">
        <q-card-title>
          Custom Dataset
          <span slot="subtitle">
            Definition for identifying custom dataset in data delivery
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
                     helper="Name for the custom dataset">
              <q-input type="text"
                       v-model="name"
                       :disable="!canEdit" />
            </q-field>

            <q-field :label-width="2"
                     label="Description"
                     helper="Description for the custom dataset">
              <q-input type="textarea"
                       v-model="description"
                       :disable="!canEdit" />
            </q-field>

            <q-field :label-width="2"
                     label="Pattern"
                     class="helper-with-example"
                     :helper="'Regular expression pattern to followed while naming files.' + patterns_example_computed">
              <q-chips-input :value="pattern"
                             @input="update_pattern($event)"
                             @duplicate="duplicateAdded($event)"
                             placeholder="Select named patterns by typing their name, for static texts just type them in"
                             ref="pattern"
                             :disable="!canEdit">
                <q-autocomplete :static-data="{field: 'label', list: namedpattern }" />
              </q-chips-input>
            </q-field>

            <q-field :label-width="2"
                     label="Formats"
                     helper="Possible file formats in which this dataset could be delivered">
              <q-checkbox v-for="format in all_formats"
                          :key="format.value"
                          v-model="formats"
                          :label="format.label"
                          :val="format.value"
                          :disable="!canEdit"
                          style="margin-right: 10px" />
            </q-field>
          </q-item-main>          
        </q-item>

        <q-item
                v-if="canEdit && isLoggedUser">
          <q-item-tile class="self-end">
            <q-btn icon="save"
                   @click="saveCustomDataset"
                   :label="datasetLabel" />

            <q-btn v-if="id && isLoggedUser"
                   icon="delete"
                   color="negative"
                   @click="deleteCustomDataset"
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
    computed: {
      ...mapGetters({
        available_custom_datasets: 'common/custom_datasets'
      }),
      canEdit() {
        return _.isNil(this.created_by) || (this.$auth.getPayload() && this.$auth.getPayload().id === this.created_by);
      },
      patterns_example_computed() {
        return this.example_from_pattern(this.pattern)
      }
    },
    mounted() {
      console.log(this.$route.params)
      if (this.$route.params) {
        var known_cd = _.find(this.available_custom_datasets, (d) => {
          return d.id === this.$route.params.id;
        });

        if (known_cd) {
          this.id = known_cd.id;
          this.name = known_cd.name;
          this.description = known_cd.description;
          this.pattern = known_cd.pattern;
          this.formats = _.map(known_cd.formats, (f) => { return f.value });
          this.created_by = known_cd.created_by;
        }
      }
    },
    updated() {
      console.log("Updated")
    },
    methods: {
      saveCustomDataset() {
        if (!this.name) { this.$q.notify({ type: 'negative', message: "Custom dataset name is required.", position: 'bottom-left' }); return; }
        if (!this.pattern) { this.$q.notify({ type: 'negative', message: "Naming pattern is required for the custom dataset.", position: 'bottom-left' }); return; }
        if (!(this.formats && this.formats.length > 0)) { this.$q.notify({ type: 'negative', message: "Atleast one file format is required.", position: 'bottom-left' }); return; }

        var filtered = _.filter(this.all_formats, (f) => {
          return _.indexOf(this.formats, f.value) > -1;
        })

        this.$store.dispatch('common/saveDataset', {
          id: this.id,
          type: 'custom',
          name: this.name,
          description: this.description,
          pattern: this.pattern,
          pattern_regex: this.pattern_regex,
          formats: filtered
        }).catch((e) => { this.handleApiError(e) })
      },
      deleteCustomDataset() {
        this.$q.dialog({
          title: 'Delete Dataset Defintion?',
          message: 'Type the name of the dataset to delete. Once deleted, the dataset defintion cannot be used, this will affect old requirement forms created with this dataset definition.',
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          color: 'secondary'
        }).then(data => {
          if (data === this.name) {
            this.$store.dispatch('common/deleteDataset', { type: 'custom', id: this.id }).catch((e) => { this.handleApiError(e) })
          }
        }).catch(() => {
          // Let it pass nothing to do
        })
      },
      onBack() {
        this.$router.go(-1);
      },
      update_pattern(value) {
        this.pattern = value;
        this.pattern_regex = this.regex_pattern(this.pattern);
      },
      duplicateAdded(value) {
        var model_value = this.pattern;
        model_value.push(value);
        this.$refs.pattern.input = '';
        this.pattern = model_value;
      }
    },
    data() {
      return {
        name: null,
        description: null,
        pattern: [],
        pattern_regex: null,
        formats: [],
        created_by: null
      }
    }
  });
</script>
<style>
  .helper-with-example .q-field-helper {
    white-space: pre;
  }
</style>

