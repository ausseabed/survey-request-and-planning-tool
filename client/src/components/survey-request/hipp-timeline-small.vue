<template>
  <div class="row items-center q-gutter-x-xs">
    <div class="app-big-heading q-pr-sm">
      Timeline
    </div>
    <q-card flat bordered dense>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="event" color="secondary"/>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>End of February</q-item-label>
          <q-item-label caption>
            HIPP Request Submission deadline
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>

    <div class="dash-div"></div>

    <q-card flat bordered dense>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="new_releases" color="secondary"/>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>End of October</q-item-label>
          <q-item-label caption>
            Hydroscheme release day
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>

    <div class="dash-div"></div>

    <q-card flat bordered dense>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="description" color="secondary"/>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>January of following year</q-item-label>
          <q-item-label caption>
            Contracts awarded to HIPP Panel
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
  
</template>

<style scoped lang="stylus">
.dash-div {
  min-width: 30px;
  min-height: 4px;
  max-height: 4px;
  background-color: $secondary;
  opacity: 0.6;
}

.q-card {
  &::v-deep {
    .q-item__section {
      margin-left: -10px;
      margin-right: -6px;
    }

    .q-item {
      padding-left: 12px;
    }
  }
}

</style>
