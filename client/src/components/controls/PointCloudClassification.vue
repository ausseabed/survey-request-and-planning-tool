<template>
  <div>
    <q-list highlight>
      <q-item dense>
        <q-item-main><b>Point Classifications</b></q-item-main>
        <q-item-side right>
          <b>Classification level required</b>
          <div class="row sm-gutter" style="min-width: 200px; text-align: left">
            <span class="col-xs-3 col-sm-3">L1</span>
            <span class="col-xs-3 col-sm-3">L2</span>
            <span class="col-xs-3 col-sm-3">L3</span>
            <span class="col-xs-3 col-sm-3">L4</span>
          </div>
        </q-item-side>
      </q-item>
      <q-item-separator />
      <q-item v-for="classification in clone_classifications" :key="classification.class">
        <q-item-main>
          <q-checkbox
                      toggle-indeterminate
                      :true-value="true"
                      :indeterminate-value="false"
                      :false-value="null"
                      indeterminate-icon="clear"
                      v-model="classification.required"
                      :label="classification.class + '&nbsp;&nbsp;' + classification.name"
                      @input="modelValueChanged" />
        </q-item-main>
        <q-item-side right>
          <div class="row sm-gutter" style="min-width: 200px;">
            <q-radio class="col-xs-3 col-sm-3" v-model="classification.level" :val="1" @input="modelValueChanged" />
            <q-radio class="col-xs-3 col-sm-3" v-model="classification.level" :val="2" @input="modelValueChanged" />
            <q-radio class="col-xs-3 col-sm-3" v-model="classification.level" :val="3" @input="modelValueChanged" />
            <q-radio class="col-xs-3 col-sm-3" v-model="classification.level" :val="4" @input="modelValueChanged" />
          </div>
        </q-item-side>
      </q-item>
      <q-field icon="class"
               :helper="field_label"
               :error="class_error"
               :error-label="error_label">
        <div class="row sm-gutter">
          <div class="col-3">
            <q-input placeholder="##" v-model="class_no" type="number" :min="min" :max="max" />
          </div>
          <div class="col-9">
            <q-input placeholder="Classification Name" v-model="class_name"
                     @keyup.enter="addClass"
                     :after="[{
                     icon: 'arrow_forward',
                     content: true,
                     handler () {
                      addClass();
                     }
                     }]" />
          </div>
        </div>
      </q-field>
    </q-list>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  import {
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QCheckbox,
    QRadio,
    QBtn,
    QInput,
    QField
  } from 'quasar'

  export default Vue.extend({
    name: 'PointCloudClassification',
    components: {
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QItemTile,
      QCheckbox,
      QRadio,
      QBtn,
      QInput,
      QField
    },
    props: ['classifications', 'min', 'max'],
    model: {
      prop: 'classifications',
      event: 'change'
    },
    methods: {
      modelValueChanged() {
        this.$emit('change', this.clone_classifications);
      },
      addClass() {
        if (!this.class_no) {
          this.error_label = "Please specify classification number";
          this.class_error = true;
        }
        else {
          if (!this.class_name) {
            this.error_label = "Please specify name for the classification";
            this.class_error = true;
          }
          else {
            this.class_error = false;
          }
        }

        if (!this.class_error) {
          this.clone_classifications.push(
            { class: this.class_no, name: this.class_name, required: true, level: "0", canDelete: true }
          );
          this.class_no = null;
          this.class_name = null;
        }
      }
    },
    watch: {
      // Watch Class number for invalid values
      class_no: function (val) {
        this.class_error = false;
        this.error_label = "";

        if (val === null || val === undefined) { return; }
        if (val < this.min) {
          this.error_label = "classification number should be at least " + this.min;
          this.class_error = true;
          return;
        }
        else if (val > this.max) {
          this.error_label = "classification number should not be greater than " + this.max;
          this.class_error = true;
          return;
        }
        else if (this.min <= val <= this.max) { }

        if (_.has(_.map(this.classifications, 'class'), val)) {
          this.error_label = "classification number should be unique";
          this.class_error = true;
          return;
        }
      },
      //clone_classifications: function (val) {
      //  this.modelValueChanged();
      //},
      classifications: function (val) {
        this.clone_classifications = _.cloneDeep(val);
      }
    },
    computed: {
      field_label() {
        return 'Specify additional classifications (' + this.min + ' - ' + this.max + ')'
      }
    },
    data() {
      return {
        // Use a cloned classification object to keep track of user changes.
        // If a clone is not used, vuex strict rule of not modifying object outside mutation will raise error
        clone_classifications: _.cloneDeep(this.classifications),
        class_no: null,
        class_name: "",
        class_error: false,
        error_label: ""
      }
    }
  });
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
</style>
