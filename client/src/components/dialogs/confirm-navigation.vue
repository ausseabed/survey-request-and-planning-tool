<template>
  <q-dialog
    v-model="active"
    persistent
  >
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Confirm navigation</div>
        <div>
          Modifications have been made to the current form that have <strong>not been saved.</strong>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Save and continue" @click="clickContinueSave()" />
        <q-btn color="warning" label="Discard changes" @click="clickContinueNoSave()" />
        <q-btn label="Cancel" @click="clickCancel()" />
      </q-card-actions>

    </q-card>
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
