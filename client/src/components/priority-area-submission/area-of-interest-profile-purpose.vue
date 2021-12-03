<template>
  <div class="row q-gutter-sm"></div>
</template>

<script>
import Vue from "vue";
const _ = require("lodash");
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { required } from "vuelidate/lib/validators";

const PURPOSE_DATA = [
  {
    name: "Operational",
    sub: [
      {
        name: "Charting / Shipping",
        sub: [
          {
            name: "Ship routing"
          },
          {
            name: "Port approaches"
          },
          {
            name: "Anchoring Management"
          }
        ]
      },
      {
        name: "Defence"
      },
      {
        name: "Natural disaster management"
      },
      {
        name: "Anthropogenic disaster management"
      },
      {
        name: "Georegulation (boundaries/ borders)"
      }
    ],
    flags: ["existing", "prospective"],
    values: [
      "Decrease operational risk",
      "Reduce cost",
      "Increase human safety",
      "Inform infrastructure planning",
      "Increased economic efficiency / tonnage",
      "Freedom of manoeuvre",
      "Pollution mitigation",
      "Wildlife interaction mitigaton"
    ]
  },
  {
    name: "Economic",
    sub: [
      {
        name: "Extractive",
        sub: [
          {
            name: "fisheries"
          },
          {
            name: "oil & gas"
          },
          {
            name: "seabed mining"
          },
          {
            name: "bioprospecting / biodiscovery"
          },
          {
            name: "Dredging"
          }
        ]
      },
      {
        name: "Infrastructure",
        sub: [
          {
            name: "pipeline / cables"
          },
          {
            name: "Non-renewables"
          },
          {
            name: "Renewables"
          },
          {
            name: "Desalination"
          },
          {
            name: "Aquaculture"
          }
        ]
      },
      {
        name: "Disposal"
      },
      {
        name: "Tourism"
      },
      {
        name: "Coastal/ urban development"
      },
      {
        name: "Environmental economic accounting"
      }
    ],
    flags: ["existing", "prospective"],
    values: [
      "Increase productivity",
      "Decrease risk",
      "Create jobs",
      "Generate investment",
      "Sustainable infrastructure",
      "Environmental offsets"
    ]
  }
];

export default Vue.extend({
  mixins: [],

  async mounted() {},

  created() {},

  props: {
    purpose: {},
    readonly: true
  },

  methods: {
    valueChanged(propertyName, value) {
      this.$emit("aoi-purpose-changed", {
        purpose: this.purpose,
        propertyName: propertyName,
        value: value
      });
    },

    isValid() {
      this.$v.$touch();
      return !this.$v.$error;
    }
  },

  watch: {},

  validations() {
    return {};
  },

  computed: {},

  data() {
    return {};
  }
});
</script>


<style scoped lang="stylus"></style>
