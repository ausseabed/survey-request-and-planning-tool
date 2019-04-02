// place to define custom components used throughout the application
// means we don't need to import and define in individual components

import Quasar from 'quasar-framework';

import ConfirmNavigation from '../components/dialogs/confirm-navigation';
import FormFieldValidated from '../components/controls/form-field-validated';

export default ({ Vue }) => {
  Vue.component('confirm-navigation', ConfirmNavigation)
  Vue.component('form-field-validated', FormFieldValidated)
}
