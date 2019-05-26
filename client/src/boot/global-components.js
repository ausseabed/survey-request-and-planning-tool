// place to define custom components used throughout the application
// means we don't need to import and define in individual components

import ConfirmNavigation from '../components/dialogs/confirm-navigation';
import FormFieldValidated from
  '../components/controls/form-field-validated';
import FormFieldValidatedDate from
  '../components/controls/form-field-validated-date';
import FormFieldValidatedInput from
  '../components/controls/form-field-validated-input';
import FormFieldValidatedSelect from
  '../components/controls/form-field-validated-select';

export default ({ Vue }) => {
  Vue.component('confirm-navigation', ConfirmNavigation)
  Vue.component('form-field-validated', FormFieldValidated)
  Vue.component('form-field-validated-date', FormFieldValidatedDate)
  Vue.component('form-field-validated-input', FormFieldValidatedInput)
  Vue.component('form-field-validated-select', FormFieldValidatedSelect)
}
