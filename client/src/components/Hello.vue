<template>
  <div class="view-parallax">
    <q-parallax :src="'statics/banner.jpg'" :height="600">
      <div slot="loading">Loading...</div>
    </q-parallax>

    <div class="layout-padding">
      <h5 style="text-align: center">Automated quality assurance for point clouds</h5>
      <h6 style="text-align: center">Collect & use data with confidence</h6>
    </div>

    <div class="layout-padding row">
      <q-card flat class="col">
        <q-card-title>
          <div class="column items-center">
            <q-icon style="text-align: center" name="fas fa-plane" size="5rem" />
            <big>LiDAR</big>
          </div>
        </q-card-title>
        <q-card-main>
          <p>
            QA4LiDAR simplifies, standardises and automates the quality assurance process for airborne topographic and bathymetric LiDAR data. The tool saves users time with robust data quality that is fit-for-use.
          </p>
        </q-card-main>
        <q-card-actions>
          <q-btn flat color="primary">Get Started</q-btn>
        </q-card-actions>
      </q-card>

      <q-card flat class="col">
        <q-card-title>
          <div class="column items-center">
            <q-icon style="text-align: center" name="directions_car" size="5rem" />
            <big>MOBiLE</big>
          </div>
        </q-card-title>
        <q-card-main>
          <p>
            Transport and road agencies around Australia recognise the significant role mobile LiDAR and imagery can play in managing their assets. To maximise the use of mobile LiDAR, substantial amounts of time are spent assessing the quality of the acquired data and extracting key measurements.
          </p>
        </q-card-main>
        <q-card-actions>
          <q-btn flat color="primary">Get Started</q-btn>
        </q-card-actions>
      </q-card>

      <q-card flat class="col">
        <q-card-title>
          <div class="column items-center">
            <q-icon style="text-align: center" name="toys" size="5rem" />
            <big>UAV</big>
          </div>
        </q-card-title>
        <q-card-main>
          <p>
            QA4UAV will be an automated quality assurance software tool for UAV imagery and photogrammetric products, including point clouds and digital surface models (DSMs). It will leverage components of the existing QA4LiDAR and QA4MOBiLE tools, to build another tool in the “QA4” suite.
          </p>
        </q-card-main>
        <q-card-actions>
          <q-btn flat color="primary" @click="goUav">Get Started</q-btn>
        </q-card-actions>
      </q-card>
      <q-card flat class="col">
        <q-card-title>
          <div class="column items-center">
            <q-icon style="text-align: center" name="directions_boat" size="5rem" />
            <big>Bathymetry</big>
          </div>
        </q-card-title>
        <q-card-main>
          <p>
            TBA
          </p>
        </q-card-main>
        <q-card-actions>
          <q-btn flat color="primary">Get Started</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
  import { QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn } from 'quasar'
  export default {
    components: {
      QParallax, QCard, QCardTitle, QCardMain, QIcon, QCardActions, QBtn
    },
    methods: {
      goUav() {
        this.$router.push('/uav');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

</style>
