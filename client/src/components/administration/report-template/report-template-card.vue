<template>
  <q-card>
    <q-card-section class="row">
      <div class="col row items-center">
        <q-icon v-if="template.valid" name="check_circle" style="font-size: 2.5em;color: green;">
          <q-tooltip>
            Template passed validation
          </q-tooltip>
        </q-icon>
        <q-icon v-else name="error" style="font-size: 2.5em;color: red;">
          <q-tooltip>
            Template failed validation. Check errors.
          </q-tooltip>
        </q-icon>
        <div class="text-subtitle1 q-pl-md">
          {{template.name}}
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          type="a"
          :href="`/api/report-template/${template.id}/download`"
          round flat icon="cloud_download">
          <q-tooltip>
            Download template
          </q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="row q-col-gutter-sm">
      <div class="column col-6">
        <div>
          <div class="caption-text text-weight-light">Type:</div>
          <div class="q-pl-md">{{template.templateType}}</div>
        </div>
        <div>
          <div class="caption-text text-weight-light">Filename:</div>
          <div class="q-pl-md">{{template.fileName}}</div>
        </div>
        <div>
          <div class="caption-text text-weight-light">Created:</div>
          <div class="q-pl-md">{{template.created | dateString }}</div>
        </div>
      </div>
      <div class="column col-6">
        <div v-if="template.valid">
          <div class="caption-text text-weight-light">Parameters found in template:</div>
          <pre >{{printObj(removeStacks(template.parameters,0))}}</pre>
        </div>
        <div v-else>
          <div class="caption-text text-weight-light">Errors found in template:</div>
          <pre >{{printObj(removeStacks(template.errors),0)}}</pre>
        </div>
      </div>

    </q-card-section>
  </q-card>
</template>
<script>
import { date } from 'quasar'
import Vue from 'vue'
import _ from 'lodash'

export default Vue.extend({
  props: [
    'template',
  ],
  data() {
    return {}
  },
  methods: {
    removeStacks(obj) {
      // strip out chunks of the JSON that make it hard to read
      this.removeKeys(obj, ['stack', 'id', 'file'])
      return obj
    },
    removeKeys(obj, keys){
      var index;
      for (var prop in obj) {
        // important check that this is objects own property
        // not from prototype prop inherited
        if(obj.hasOwnProperty(prop)){
          switch(typeof(obj[prop])){
            case 'string':
              index = keys.indexOf(prop);
              if(index > -1){
                  delete obj[prop];
              }
              break;
            case 'object':
              index = keys.indexOf(prop);
              if(index > -1){
                  delete obj[prop];
              }else{
                  this.removeKeys(obj[prop], keys);
              }
              break;
          }
        }
      }
    },
    printObj(object, level) {
      var SPACER = '  '
      var NEWLINE = '\n'
      var result = ''

      level = level || 0;
      if (_.isNil(object)) {
        return result
      }
      Object.keys(object).forEach((key) => {
        var i = level;
        while (i--) {
          result += SPACER;
        }
        if (typeof object[key] === 'object' && object[key] !== null) {
          result += key + NEWLINE;
          result += this.printObj(object[key], level + 1);
          return;
        }
        result += key + ': ' + object[key] + NEWLINE;
      });
      return result;
    }
  },
  computed: {

  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; white-space: pre-wrap;}
.string { color: green; }
.number { color: darkorange; }
.boolean { color: blue; }
.null { color: magenta; }
.key { color: red; }

</style>
