import VuelidateErrorExtractor, { templates } from "vuelidate-error-extractor";

const messages = {
  required: "Field {attribute} is required",
  email: "Field {attribute} is not a valid email address",
  minLength: "Must provide at least one {attribute}"
};

export default ({ Vue }) => {
  Vue.use(VuelidateErrorExtractor, {
    messages,
    attributes: {
      name: "Name",
      surveyName: "survey name",
      projectCustodians: "custodians",
      projectInstrumentTypes: "instrument types",
      projectDataCaptureTypes: "data capture types",
      email: "Email",
      text: "Text"
    }
  });

  Vue.component("formWrapper", templates.FormWrapper);
}
