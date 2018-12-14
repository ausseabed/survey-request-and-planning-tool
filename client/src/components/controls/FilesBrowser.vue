<template>
  <q-list v-if="files" no-border>
    <q-list-header>
      <q-btn no-ripple flat round icon="home" size="SM" color="primary" @click="current_dir = null" />
      <template v-for="(dir, idx) in current_dirs">
        <span class="q-breadcrumbs-separator text-faded" style="margin-left: 0.5em; margin-right: 0.5em;">/</span>
        <a v-if="idx < current_dirs.length - 1"
           class="text-primary text-weight-bold"
           @click="setPath(current_dirs.splice(0, idx + 1).join('.'))"
           href="javascript: void(0);">{{dir}}</a>
        <span v-if="idx === current_dirs.length - 1"
              class="text-faded">{{dir}}</span>
      </template>
    </q-list-header>

    <template v-for="(dir, k, idx) in dir_files">
      <template v-if="k !== 'files'">
        <q-item>
          <q-item-side icon="far fa-folder" flat small />
          <q-item-main>
            <q-item-tile label>
              <a @click="changePath(k)" href="javascript: void(0);" class="text-primary">{{k}}</a>
            </q-item-tile>
          </q-item-main>
        </q-item>
      </template>
    </template>

    <template v-for="(dir, k, idx) in dir_files">
      <template v-if="k === 'files'">
        <q-item v-for="file in dir">
          <q-item-side icon="far fa-file" flat small />
          <q-item-main>
            <q-item-tile label>{{file.path}}</q-item-tile>
            <q-item-tile sublabel>{{datatypeName(file)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{humanFileSize(file.size, true)}}</q-item-tile>
          </q-item-main>
        </q-item>
      </template>
    </template>
  </q-list>
</template>
<script>
  import Vue from 'vue'

  export default Vue.extend({
    props: ['files', 'editable'],
    model: {
      prop: 'files',
      event: 'change'
    },
    methods: {
      humanFileSize(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
          return bytes + ' B';
        }
        var units = si
          ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        var u = -1;
        do {
          bytes /= thresh;
          ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
      },
      datatypeName(file) {
        if (file.productname) {
          return file.productname + (file.datatype ? '-' + file.datatype : '')
        }
        else if (file.datatype_id) {
          return _.get(this.datatype, file.datatype_id.toString(), 'Unknown')
        }
        else { return 'Unknown' }
      },
      changePath(dir) {
        if (!this.current_dir) { this.current_dir = dir }
        else { this.current_dir += ("." + dir) }
      },
      setPath(dir) { this.current_dir = dir }
    },
    computed: {
      dir_files() {
        if (!this.current_dir) { return this.files }
        else {
          return _.get(this.files, this.current_dir);
        }
      },
      current_dirs() {
        return this.current_dir ? this.current_dir.split('.') : []
      }
    },
    data() {
      return {
        datadir: null,
        path: '/',
        current_dir: null,
        datatype: {
          '-1': 'Not Yet Assessed'
        }
      }
    }
  })
</script>
<style lang="stylus">
</style>
