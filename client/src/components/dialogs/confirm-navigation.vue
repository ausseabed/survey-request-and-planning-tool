<template>
  <q-dialog
    v-model="active"
    prevent-close
  >
    <span slot="title">Confirm navigation</span>
    <span slot="message">Modifications have been made to the current form that have <strong>not been saved.</strong></span>


    <template slot="buttons" slot-scope="props">
      <q-btn label="Save and continue" @click="clickContinueSave()" />
      <q-btn color="warning" label="Discard changes" @click="clickContinueNoSave()" />
      <q-btn label="Cancel" @click="clickCancel()" />
    </template>
  </q-dialog>
</template>

<script>
export default {
  name: 'ConfirmNavigation',
  data () {
    return {
      active: false,
      name: '',
      resolve: null,
    }
  },
  methods: {
    pop(){
        this.active = true;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    },
    clickContinueSave(){
        this.active = false;
        this.resolve("save");
    },
    clickContinueNoSave(){
        this.active = false;
        this.resolve("no save");
    },
    clickCancel(){
        this.active = false;
        this.resolve("cancel");
    }
  }
}
</script>
