<template>
  <q-timeline color="secondary">

    <q-timeline-entry heading class="app-big-heading">
      Annual SCT Timeline
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="End of February"
      icon="event"
    >
      <ul style="padding-left: 24px">
        <li>
          AHO HIPP Request Submission deadline
        </li>
        <li>
          Final date for Areas of Interest submissions to AusSeabed SCT for inclusion in Heat Map
        </li>
      </ul>
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="Mid March"
      icon="map"
    >
      <div>
        Area of Interest heat map submission to AHO for consideration in next Hydroscheme
      </div>
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="End of October"
      icon="new_releases"
    >
      <div>
        Hydroscheme release day
      </div>
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="January of following year"
      icon="description"
    >
      <div>
        Contracts awarded to HIPP Panel
      </div>
    </q-timeline-entry>

  </q-timeline>
  
</template>


<style scoped lang="stylus">

.q-timeline {
  &::v-deep {
    .q-timeline__title {
      margin-bottom: 0px
    }
    .q-timeline__subtitle {
      margin-bottom: 0px 
    }
    .q-timeline__content {
      padding-bottom: 12px
    }
    .q-timeline__heading-title {
      font-size: 1rem
      font-weight: 500
      color: var(--q-color-primary) !important;
      padding: 0px
      line-height: 1.5rem
    }
  }
}

</style>
