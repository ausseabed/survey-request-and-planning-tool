<template>
  <div class="row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-breadcrumbs separator=">" color="light">
        <q-breadcrumbs-el label="Home" icon="home" to="/" />
        <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
        <q-breadcrumbs-el label="Survey" icon="fab fa-wpforms" />
      </q-breadcrumbs>
    </div>

    <div class="layout-padding row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <div id="surveyContainer" class="layout-padding">
          <survey v-if="survey"
                  :survey="survey"></survey>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Toolbar from '../Toolbar.vue'
  import { EventBus } from '../event-bus.js'
  import axios from 'axios';
  import { errorHandler } from './../mixins/error-handling'

  const Survey = require('survey-vue');
  require('survey-vue/survey.css');
  require('../olmap/map-question');
  const uuidv4 = require('uuid/v4');

  import {
    QLayout, QToolbar, QToolbarTitle
  } from 'quasar'

  export default Vue.extend({
    mixins: [errorHandler],
    components: {
      'toolbar': Toolbar,
      QLayout
    },
    mounted() {
      var doc = axios.create({
        baseURL: process.env.S3_BUCKET
      })
        .get('/uav_questionnaire.json')
        .then((r) => {
          this.surveyId = uuidv4()

          this.survey = new Survey.Model(r.data);

          this.survey
            .onStarted
            .add(() => {
              this.assets = [];
            })

          this.survey
            .onCurrentPageChanged
            .add((survey) => {
              // Force complete button to show if user is not in first or last page
              if (!survey.isFirstPage && !survey.isFirstPage) {
                document.getElementsByClassName('sv_complete_btn')[0].style.display = 'inline';
                document.getElementsByClassName('sv_complete_btn')[0].style.marginRight = '10px';
              }
            })

          this.survey
            .onComplete
            .add((result) => {
              EventBus.$emit('surveyCompleted', _.merge({ surveyId: this.surveyId, assets: this.assets }, result.data));
              this.assets = [];
            });

          this.survey
            .onUploadFiles
            .add((surveymodel, options) => {
              if (options.files && options.files.length > 0) {
                var q = surveymodel.getQuestionByName(options.name)
                var uploaded_promise = _.map(options.files, (file) => {
                  if (!(q.maxSize > 0 && file.size > q.maxSize)) {
                    // File is within size expected, good to upload.
                    var uploaded_file_asset = options.name + '/' + file.name;
                    return axios.post('/api/signedurl', {
                      file_name: 'uav/requirements/' + this.surveyId + '/assets/' + options.name + '/' + file.name,
                      content_type: file.type
                    })
                      .then((response) => {
                        return axios.put(response.data.url, file, {
                          transformRequest: [
                            (data, headers) => {
                              delete headers.Authorization
                              return data
                            }],
                          headers: {
                            'Content-Type': file.type,
                            'x-amz-acl': 'bucket-owner-full-control'
                          }
                        })
                          .then((response) => {
                            //uploaded_files.push({ file: file });
                            this.assets.push(new URL(response.request.responseURL).pathname.split('/assets/')[1])
                            return { file: file }
                          })
                      })
                      .catch((e) => {
                        console.error(e)
                      })
                  }
                  else {
                    this.notify('negative', 'File size should be less than ' + Math.round(parseFloat(q.maxSize) / 1024.0 / 1024.0, 2) + ' MB')
                  }
                })

                Promise.all(uploaded_promise).then((uploaded_files) => {
                  options.callback("success", uploaded_files);
                  this.notify('positive', uploaded_files.length + ' files uploaded successfully')
                })
              }
            });


          EventBus.$on("surveyCompleted", this.onSurveyCompleted);


          return null;
        });
    },
    beforeDestroy() {
      EventBus.$off("surveyCompleted", this.onSurveyCompleted);
    },
    methods: {
      onSurveyCompleted(data) {
        this.$store.dispatch('uav_tender/saveSurveyAnswers', data).catch((e) => { this.handleApiError(e) })
      }
    },
    created() {
      let jqueryScript = document.createElement('script')
      jqueryScript.setAttribute('src', 'https://code.jquery.com/jquery-3.2.1.slim.min.js');
      jqueryScript.setAttribute('integrity', 'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN');
      jqueryScript.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(jqueryScript);

      let popperScript = document.createElement('script')
      popperScript.setAttribute('src', 'https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js');
      popperScript.setAttribute('integrity', 'sha384-fA23ZRQ3G/J53mElWqVJEGJzU0sTs+SvzG8fXVWP+kJQ1lwFAOkcUOysnlKJC33U');
      popperScript.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(popperScript);

      let bootstrapMaterialLink = document.createElement('link')
      bootstrapMaterialLink.setAttribute('rel', 'stylesheet');
      bootstrapMaterialLink.setAttribute('src', 'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css');
      bootstrapMaterialLink.setAttribute('integrity', 'sha384-wXznGJNEXNG1NFsbm0ugrLFMQPWswR3lds2VeinahP8N0zJw9VWSopbjv2x7WCvX');
      bootstrapMaterialLink.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(bootstrapMaterialLink);

      let bootstrapMaterialScript = document.createElement('script')
      bootstrapMaterialScript.setAttribute('src', 'https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js');
      bootstrapMaterialScript.setAttribute('integrity', 'sha384-CauSuKpEqAFajSpkdjv3z9t8E7RlpJ1UP0lKM/+NdtSarroVKu069AlsRPKkFBz9');
      bootstrapMaterialScript.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(bootstrapMaterialScript);

    },
    data() {
      return {
        survey: null,
        surveyId: null,
        assets: []        // These are files uploaded to S3 successfully
      }
    }
  });
</script>
<style lang="stylus">
  .form-control {
    width: 100%;
  }

  .panel-footer {
    margin-top: 10px;
  }

  .ripple-wrapper .ripple {
    background: #000 !important;
  }

  .ol-control button {
    min-width: 22px;
  }
</style>
