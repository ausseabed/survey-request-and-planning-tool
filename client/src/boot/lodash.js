import Vue from 'vue';
import VueLodash from 'vue-lodash';
import lodash from 'lodash';

export default ({ Vue }) => {
  Vue.use(VueLodash, {lodash: lodash});
}
