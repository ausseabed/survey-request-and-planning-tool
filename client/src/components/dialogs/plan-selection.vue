<template>
  <q-dialog
    v-model="active"
    persistent
  >

    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-footer class="bg-black text-white">
        <q-toolbar inset>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 150" :key="n">
            {{ lorem }}
          </p>
        </q-page>
      </q-page-container>
    </q-layout>


    <!-- <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">foo</div>
        <div>
          bar
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Done" @click="clickDone()" />
        <q-btn label="Cancel" @click="clickCancel()" />
      </q-card-actions>

    </q-card> -->
  </q-dialog>
</template>

<script>
export default {
  name: 'PlanSelection',
  // computed: {
  //   contentSize () {
  //     return this.moreContent ? 150 : 5
  //   }
  // }
  data () {
    return {
      active: false,
      name: '',
      resolve: null,

      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',
    }
  },
  methods: {
    pop(){
        this.active = true;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
        });
    },
    clickDone(){
        this.active = false;
        this.resolve("save");
    },
    clickCancel(){
        this.active = false;
        this.resolve("cancel");
    }
  }
}
</script>
