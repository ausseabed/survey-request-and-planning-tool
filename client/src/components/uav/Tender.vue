<template>
  <div class="row justify-center">
    <div style="width: 900px; max-width: 90vw;">
      <q-breadcrumbs separator=">" color="light">
        <q-breadcrumbs-el label="Home" icon="home" to="/" />
        <q-breadcrumbs-el label="UAV" icon="toys" to="/uav" />
        <q-breadcrumbs-el label="Requirements" icon="fas fa-clipboard-list" />
      </q-breadcrumbs>
    </div>
    <q-page padding class="docs-input row justify-center">
      <div style="width: 900px; max-width: 90vw;">
        <q-card inline style="width:100%">
          <q-item style="vertical-align:bottom" sparse>
            <q-item-main>
              <div ref="mapDiv" id="mapDiv" style="height:300px;"></div>
            </q-item-main>

            <!-- If project ID is not empty or null, then show project summary else, allow users to enter the values -->
            <q-item-side v-if="!is_proj_dtl_needed" left style="width: 300px; height: 300px;">
              <q-item-tile label>
                <h4>{{project_details.name}}</h4>
                <span slot="subtitle"><b>Contract No: </b>{{project_details.contract_no}}</span>
              </q-item-tile>
              <q-item-tile label>
                <h5>{{project_details.tenderer}}</h5>
              </q-item-tile>
              <q-item-tile v-if="updated_readable" stamp>Updated {{updated_readable}}</q-item-tile>
              <q-item-tile @click="" class="self-end">
                <br />
              </q-item-tile>

              <q-item-tile class="self-end">
                <q-btn icon="done"
                       @click="createTenderDoc"
                       label="Create Tender document"></q-btn>
              </q-item-tile>
              <q-item-tile @click="" class="self-end">
                <br />
              </q-item-tile>
              <q-item-tile v-if="project_details.can_edit" class="self-end">
                <q-btn icon="save"
                       @click="saveTender"
                       label="Save"></q-btn>
              </q-item-tile>
            </q-item-side>

            <!-- If project ID is not empty or null, then show project summary else, allow users to enter the values -->
            <q-item-side v-if="is_proj_dtl_needed" left style="width: 300px; height: 300px;">
              <q-item-tile>
                <q-field helper="Project Name">
                  <q-input type="text"
                           v-model="project_details.name"
                           @input="update('project_name', $event)" />
                </q-field>
                <q-field helper="Contract No">
                  <q-input type="text"
                           v-model="project_details.contract_no"
                           @input="update('contract_no', $event)" />
                </q-field>
              </q-item-tile>
              <q-item-tile @click="" class="self-end">
                <br />
              </q-item-tile>
              <q-item-tile class="self-end">
                <q-btn icon="save" label="Create"
                       v-if="project_details.name"
                       @click="saveTender"></q-btn>
              </q-item-tile>
            </q-item-side>
          </q-item>
        </q-card>

        <!-- Collection Requirements -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="fas fa-hourglass-half"
                       label="Time sensitive"
                       helper="Is Data collection time sensitive?">
                <q-toggle v-model="is_time_sensitive" />
              </q-field>

              <q-field :label-width="4"
                       v-if="is_time_sensitive"
                       inset="full"
                       icon="timer"
                       label="Time of day for collection"
                       helper="Time range in which to collect data, if time sensitive">
                <q-select :value="collection.time_sensitive.time_range"
                          @change="update('collection.time_sensitive.time_range', $event)"
                          :options="[
                              { label: 'Dawn', value: 'dawn' },
                              { label: 'Dusk', value: 'dusk' },
                              { label: 'Noon', value: 'noon' },
                              { label: 'Day', value: 'day' },
                              { label: 'Night', value: 'night' },
                              { label: 'Other (specify below)', value: 'other' },
                            ]" />

                <q-input v-if="is_time_sensitive"
                         :value="collection.time_sensitive.comment"
                         @change="update('collection.time_sensitive.comment', $event)"
                         float-label="Additional time requirements"
                         type="textarea" />
              </q-field>

              <q-field :label-width="4"
                       inset="full"
                       icon="burst_mode"
                       label="Time Series"
                       helper="Same area to be capture at different times?">
                <q-toggle v-model="is_time_series_data" />
              </q-field>

              <q-field :label-width="4"
                       inset="full"
                       icon="gps_fixed"
                       label="GPS Positioning"
                       helper="GPS positioning technique to be used?">
                <q-option-group type="radio"
                                :value="collection.gps_positioning"
                                @input="update('collection.gps_positioning', $event)"
                                :options="[
                              { label: 'Static GPS', value: 'static' },
                              { label: 'RTK-GPS', value: 'rtk' },
                              { label: 'DGPS', value: 'gps' }
                            ]" />
              </q-field>

              <q-field :label-width="4"
                       inset="full"
                       icon="fas fa-images"
                       label="Overlap">
                <q-input :value="collection.image_overlap.forward"
                         type="number"
                         :decimals="1"
                         :step="1"
                         :min="1"
                         :max="99"
                         suffix="%"
                         float-label="Forward overlap"
                         @change="update('collection.image_overlap.forward', $event)" />
                <q-input :value="collection.image_overlap.side"
                         type="number"
                         :decimals="1"
                         :step="1"
                         :min="1"
                         :max="99"
                         suffix="%"
                         float-label="Side overlap"
                         @change="update('collection.image_overlap.side', $event)" />
              </q-field>

              <q-field :label-width="4"
                       inset="full"
                       icon="fas fa-tree"
                       label="Environmental Considerations"
                       helper="Environmental considerations while collecting data">
                <q-input :value="collection.environmental_consideration"
                         @change="update('collection.environmental_consideration', $event)"
                         type="textarea" />
              </q-field>

              <q-field :label-width="4"
                       inset="full"
                       icon="settings_ethernet"
                       label="Standoff distance"
                       helper="Standoff distance from feature of interest">
                <q-input :value="collection.standoff"
                         type="number"
                         :decimals="1"
                         :step="1"
                         :min="1"
                         :max="99"
                         suffix="m"
                         float-label="Standoff distance"
                         @change="update('collection.standoff', $event)" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Delivery Requirements -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="fas fa-calendar-alt"
                       label="Delivery due date"
                       helper="Date by which data needs to be delivered">
                <q-datetime clearable
                            :value="delivery.date"
                            @change="update('delivery.date', $event)" />
              </q-field>

              <q-field :label-width="4"
                       icon="fas fa-hdd"
                       label="Delivery method"
                       helper="Preferred data delivery method">
                <q-select multiple
                          :value="delivery.method"
                          @change="update('delivery.method', $event)"
                          :options="[
                              { label: 'Hard drive', value: 'hdd' },
                              { label: 'Dropbox', value: 'dropbox' },
                              { label: 'Onedrive', value: 'onedrive' },
                              { label: 'Other', value: 'other' }
                            ]" />

                <q-input v-if="delivery.method.length > 0"
                         :value="delivery.method_comment"
                         @change="update('delivery.method_comment', $event)"
                         float-label="Delivery method details"
                         type="textarea" />
              </q-field>

              <q-field :label-width="4"
                       icon="perm_device_information"
                       label="Ancillary Data"
                       helper="Supporting data / metadata required">
                <q-checkbox :value="delivery.ancillary_data" @change="update('delivery.ancillary_data', $event)" label="Raw Data" val="raw" style="margin-right: 10px" />
                <q-checkbox :value="delivery.ancillary_data" @change="update('delivery.ancillary_data', $event)" label="Pilot License" val="pilot" style="margin-right: 10px" />
                <q-checkbox :value="delivery.ancillary_data" @change="update('delivery.ancillary_data', $event)" label="Sensor Settings" val="sensor" style="margin-right: 10px" />
                <q-checkbox :value="delivery.ancillary_data" @change="update('delivery.ancillary_data', $event)" label="Aviation approval" val="approval" style="margin-right: 10px" />
                <q-checkbox :value="delivery.ancillary_data" @change="update('delivery.ancillary_data', $event)" label="Catalogue findings" val="catalogue" style="margin-right: 10px" />
              </q-field>

              <q-field :label-width="4"
                       icon="text_fields"
                       label="Naming convention"
                       inset="full"
                       helper="Select a naming convention or create a new">
                <q-select :value="naming_convention_id"
                          @input="on_standard_dataset_selected"
                          clearable
                          :options="naming_conventions"
                          :after="[{
                        icon: 'remove_red_eye',
                        content: true,
                        handler: view_naming_convention
                      },{
                        icon: 'fas fa-plus-square',
                        content: false,
                        handler: new_naming_convention
                      }]" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Coordinate Systems -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="fas fa-globe"
                       label="Coordinate System"
                       helper="Horizontal coordinate system to be used">
                <q-select filter
                          autofocus-filter
                          :value="spatial_reference.hcs"
                          @change="update('spatial_reference.hcs', $event)"
                          :options="hcs" />
              </q-field>

              <q-field inset="full"
                       :label-width="4"
                       helper="Vertical coordinate system to be used">
                <q-select filter
                          autofocus-filter
                          multiple
                          chips
                          :value="spatial_reference.vcs"
                          @change="update('spatial_reference.vcs', $event)"
                          :options="vcs" />
              </q-field>

              <q-field :label-width="4"
                       icon="fas fa-arrows-alt-h"
                       label="Horizontal Accuracy">
                <q-input :value="spatial_reference.accuracy.horizontal.abs"
                         type="number"
                         :decimals="0"
                         :step="1"
                         :min="1"
                         :max="100"
                         suffix="@ 95% CI (cm)"
                         float-label="Horizontal accuracy"
                         @change="update('spatial_reference.accuracy.horizontal.abs', $event)" />
              </q-field>

              <q-field :label-width="4"
                       icon="fas fa-arrows-alt-v"
                       label="Vertical Accuracy"
                       helper="Vertical accuracy required">
                <q-input :value="spatial_reference.accuracy.vertical.abs"
                         type="number"
                         :decimals="0"
                         :step="1"
                         :min="1"
                         :max="100"
                         suffix="@ 95% CI (cm)"
                         float-label="Absolute Vertical accuracy"
                         @change="update('spatial_reference.accuracy.vertical.abs', $event)" />
                <q-input :value="spatial_reference.accuracy.vertical.rel"
                         type="number"
                         :decimals="0"
                         :step="1"
                         :min="1"
                         :max="100"
                         suffix="@ 95% CI (cm)"
                         float-label="Relative Vertical accuracy"
                         @change="update('spatial_reference.accuracy.vertical.rel', $event)" />

              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Imagery Requirements -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="image"
                       label="Imagery">
                <q-toggle :value="imagery.required"
                          @change="update('imagery.required', $event)" />
              </q-field>

              <q-field v-if="imagery.required"
                       :label-width="4"
                       inset="full"
                       helper="Image Types required">
                <q-checkbox :value="imagery.types" @change="update('imagery.types', $event)" label="RGB (Colour)" val="rgb" style="margin-right: 10px" />
                <q-checkbox :value="imagery.types" @change="update('imagery.types', $event)" label="Grey Scale" val="grey" style="margin-right: 10px" />
                <q-checkbox :value="imagery.types" @change="update('imagery.types', $event)" label="Near-InfraRed" val="nir" style="margin-right: 10px" />
                <q-checkbox :value="imagery.types" @change="update('imagery.types', $event)" label="Thermal" val="thermal" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="imagery.required"
                       :label-width="4"
                       inset="full"
                       helper="Image capture angle">
                <q-radio :value="imagery.capture_angle" @change="update('imagery.capture_angle', $event)" label="Oblique" val="oblique" style="margin-right: 10px" />
                <q-radio :value="imagery.capture_angle" @change="update('imagery.capture_angle', $event)" label="Nadir" val="nadir" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="imagery.required"
                       :label-width="4"
                       inset="full"
                       helper="Spatial resolution of images expressed in meter.">
                <q-chips-input v-model="img_resolution"
                               float-label="Image resolution required" />
              </q-field>


              <q-field v-if="imagery.required"
                       :label-width="4"
                       inset="full"
                       helper="File formats">
                <q-checkbox :value="imagery.formats" @change="update('imagery.formats', $event)" label="ECW (.ecw)" val="ecw" style="margin-right: 10px" />
                <q-checkbox :value="imagery.formats" @change="update('imagery.formats', $event)" label="GeoTiff (.tif/.tiff)" val="tiff" style="margin-right: 10px" />
                <q-checkbox :value="imagery.formats" @change="update('imagery.formats', $event)" label="Jpeg (.jpg/.jp2)" val="jpg" style="margin-right: 10px" />
                <q-checkbox :value="imagery.formats" @change="update('imagery.formats', $event)" label="ASCII (.asc)" val="asc" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="imagery.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile size in km or 'mosaic' if mosaic dataset is required">
                <q-chips-input v-model="img_tile_size"
                               float-label="Tile size/Mosiac" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Point Cloud -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="cloud_queue"
                       label="Point Cloud">
                <q-toggle v-model="is_pc_required" />
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full"
                       helper="File formats">
                <q-checkbox :value="point_cloud.formats" @change="update('point_cloud.formats', $event)" label="Uncompressed (.las)" val="las" style="margin-right: 10px" />
                <q-checkbox :value="point_cloud.formats" @change="update('point_cloud.formats', $event)" label="Compressed (.laz)" val="laz" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full"
                       helper="Point cloud types required">
                <q-checkbox :value="point_cloud.types" @change="update('point_cloud.types', $event)" label="Unclassified" val="unclassified" style="margin-right: 10px" />
                <q-checkbox :value="point_cloud.types" @change="update('point_cloud.types', $event)" label="Classified" val="classified" style="margin-right: 10px" />
                <q-checkbox :value="point_cloud.types" @change="update('point_cloud.types', $event)" label="Swath" val="swath" style="margin-right: 10px" />
                <q-checkbox :value="point_cloud.types" @change="update('point_cloud.types', $event)" label="Model Key Points" val="mkp" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full">
                <q-checkbox :value="point_cloud.full_wave_form"
                            @change="update('point_cloud.full_wave_form', $event)"
                            label="Full wave form required?"
                            toggle-indeterminate
                            :true-value="true"
                            :indeterminate-value="false"
                            :false-value="null"
                            left-label
                            style="margin-right: 10px" />
              </q-field>

              <q-field :label-width="4"
                       v-if="point_cloud.required"
                       inset="full"
                       helper="LAS version required">
                <q-select v-model="pc_version"
                          :options="pc_versions"
                          @input="on_pc_version_changed" />
              </q-field>
              <q-field :label-width="4"
                       v-if="point_cloud.required"
                       inset="full"
                       helper="Point data record format">
                <q-select v-model="pc_pdrf_format"
                          :options="version_pdrf_formats"
                          @input="on_pc_pdrf_changed" />
              </q-field>
              <q-field :label-width="4"
                       v-if="point_cloud.required"
                       inset="full">
                <pc-classification v-model="classification"
                                   :min="pdrf_classification.min"
                                   :max="pdrf_classification.max"></pc-classification>
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile size in km">
                <q-chips-input v-model="pc_tile_size"
                               float-label="Tile size/Mosiac" />
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full"
                       helper="Point Density Required">
                <q-input :value="point_cloud.density"
                         type="number"
                         :decimals="0"
                         :step="1"
                         :min="1"
                         :max="100"
                         suffix="points/m2"
                         float-label="Point Density"
                         @change="update('point_cloud.density', $event)" />
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full"
                       helper="Maximum allowed scan angle">
                <q-select :value="point_cloud.scan_angle"
                          @change="update('point_cloud.scan_angle', $event)"
                          :options="scan_angle" />
              </q-field>

              <q-field v-if="point_cloud.required"
                       :label-width="4"
                       inset="full"
                       helper="Maximum size for each las file">
                <q-input :value="point_cloud.file_size"
                         type="number"
                         :decimals="1"
                         :step="0.5"
                         :min="1"
                         :max="10"
                         suffix="GB"
                         float-label="File Size"
                         @change="update('point_cloud.file_size', $event)" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- DEM Requirements -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="terrain"
                       label="Digital Elevation Model">
                <q-toggle :value="dem.required"
                          @change="update('dem.required', $event)" />
              </q-field>

              <q-field v-if="dem.required"
                       :label-width="4"
                       inset="full"
                       helper="Spatial resolution of DEM expressed in meter.">
                <q-chips-input v-model="dem_resolution"
                               float-label="DEM resolution required" />
              </q-field>


              <q-field v-if="dem.required"
                       :label-width="4"
                       inset="full"
                       helper="File formats">
                <q-checkbox :value="dem.formats" @change="update('dem.formats', $event)" label="GeoTiff (.tif/.tiff)" val="tiff" style="margin-right: 10px" />
                <q-checkbox :value="dem.formats" @change="update('dem.formats', $event)" label="ASCII (.asc)" val="asc" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="dem.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile size in km or 'mosaic' if mosaic dataset is required">
                <q-chips-input v-model="dem_tile_size"
                               float-label="Tile size/Mosiac" />
              </q-field>

              <q-field v-if="dem.required"
                       :label-width="4"
                       inset="full">
                <q-checkbox left-label
                            :value="dem.hydro_flatten"
                            @change="update('dem.hydro_flatten', $event)"
                            label="Hydro Flattening required?"
                            style="margin-right: 10px" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- DSM Requirements -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="streetview"
                       label="Digital Surface Model">
                <q-toggle :value="dsm.required"
                          @change="update('dsm.required', $event)" />
              </q-field>

              <q-field v-if="dsm.required"
                       :label-width="4"
                       inset="full"
                       helper="Spatial resolution of DSM expressed in meter.">
                <q-chips-input v-model="dsm_resolution"
                               float-label="DSM resolution required" />
              </q-field>

              <q-field v-if="dsm.required"
                       :label-width="4"
                       inset="full"
                       helper="File formats">
                <q-checkbox :value="dsm.formats" @change="update('dsm.formats', $event)" label="GeoTiff (.tif/.tiff)" val="tiff" style="margin-right: 10px" />
                <q-checkbox :value="dsm.formats" @change="update('dsm.formats', $event)" label="ASCII (.asc)" val="asc" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="dsm.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile size in km or 'mosaic' if mosaic dataset is required">
                <q-chips-input v-model="dsm_tile_size"
                               float-label="Tile size/Mosiac" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Contour Requirements -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="leak_add"
                       label="Contours">
                <q-toggle :value="contours.required"
                          @change="update('contours.required', $event)" />
              </q-field>

              <q-field v-if="contours.required"
                       :label-width="4"
                       inset="full"
                       helper="Contour Intervals required">
                <q-input :value="contours.interval"
                         type="number"
                         :decimals="0"
                         :step="1"
                         :min="1"
                         :max="100"
                         suffix="meter"
                         float-label="Contour Interval"
                         @change="update('contours.required', $event)" />
              </q-field>

              <q-field v-if="contours.required"
                       :label-width="4"
                       inset="full"
                       helper="Attributes required in contour.">
                <q-chips-input v-model="contour_attrs"
                               float-label="Contours Attributes" />
              </q-field>

              <q-field v-if="contours.required"
                       :label-width="4"
                       inset="full"
                       helper="File formats">
                <q-checkbox :value="contours.formats" @change="update('contours.formats', $event)" label="Shape files" val="shp" style="margin-right: 10px" />
                <q-checkbox :value="contours.formats" @change="update('contours.formats', $event)" label="File Geodatabase" val="fgdb" style="margin-right: 10px" />
                <q-checkbox :value="contours.formats" @change="update('contours.formats', $event)" label="MapInfo TAB" val="tab" style="margin-right: 10px" />
                <q-checkbox :value="contours.formats" @change="update('contours.formats', $event)" label="AutoCAD DXF" val="dxf" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="contours.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile size in km, 'mosaic' if single file delivery required. Default: mosaic">
                <q-chips-input v-model="contour_tile_size"
                               float-label="Tile size/Mosiac" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Video -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="local_movies"
                       label="Video">
                <q-toggle :value="video.required"
                          @change="update('video.required', $event)" />
              </q-field>

              <q-field v-if="video.required"
                       :label-width="4"
                       inset="full"
                       helper="File formats">
                <q-checkbox :value="video.formats" @change="update('video.formats', $event)" label="MPEG-4 (.mp4)" val="mp4" style="margin-right: 10px" />
                <q-checkbox :value="video.formats" @change="update('video.formats', $event)" label="Quicktime (.mov)" val="mov" style="margin-right: 10px" />
                <q-checkbox :value="video.formats" @change="update('video.formats', $event)" label="Audio Video Interleave (.avi)" val="avi" style="margin-right: 10px" />
                <q-checkbox :value="video.formats" @change="update('video.formats', $event)" label="Material eXchange Format (.mxf)" val="mxf" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="video.required"
                       :label-width="4"
                       inset="full"
                       helper="Video Resolution">
                <q-select :value="video.resolution"
                          @change="update('video.resolution', $event)"
                          :options="video_resolution" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Tile Index -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="grid_on"
                       label="Tile Index">
                <q-toggle :value="tile_index.required"
                          @change="update('tile_index.required', $event)" />
              </q-field>

              <q-field v-if="tile_index.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile index format">
                <q-checkbox :value="tile_index.formats" @change="update('tile_index.formats', $event)" label="Shape files" val="shp" style="margin-right: 10px" />
                <q-checkbox :value="tile_index.formats" @change="update('tile_index.formats', $event)" label="File Geodatabase" val="fgdb" style="margin-right: 10px" />
                <q-checkbox :value="tile_index.formats" @change="update('tile_index.formats', $event)" label="MapInfo TAB" val="tab" style="margin-right: 10px" />
                <q-checkbox :value="tile_index.formats" @change="update('tile_index.formats', $event)" label="AutoCAD DXF" val="dxf" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="tile_index.required"
                       :label-width="4"
                       inset="full"
                       helper="Tile size in km">
                <q-chips-input v-model="tile_index_tile_size"
                               float-label="Tile size" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Flight Trajectory -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="flight"
                       label="Flight Trajectory">
                <q-toggle :value="trajectory.required"
                          @change="update('trajectory.required', $event)" />
              </q-field>

              <q-field v-if="trajectory.required"
                       :label-width="4"
                       inset="full"
                       helper="Flight Trajectory">
                <q-checkbox :value="trajectory.formats" @change="update('trajectory.formats', $event)" label="Shape files" val="shp" style="margin-right: 10px" />
                <q-checkbox :value="trajectory.formats" @change="update('trajectory.formats', $event)" label="KML/KMZ" val="kml" style="margin-right: 10px" />
                <q-checkbox :value="trajectory.formats" @change="update('trajectory.formats', $event)" label="File Geodatabase" val="fgdb" style="margin-right: 10px" />
                <q-checkbox :value="trajectory.formats" @change="update('trajectory.formats', $event)" label="MapInfo TAB" val="tab" style="margin-right: 10px" />
                <q-checkbox :value="trajectory.formats" @change="update('trajectory.formats', $event)" label="AutoCAD DXF" val="dxf" style="margin-right: 10px" />
              </q-field>

              <q-field v-if="trajectory.required"
                       :label-width="4"
                       inset="full"
                       helper="Attributes required in trajectory">
                <q-chips-input v-model="traj_attrs"
                               float-label="Trajectory Attributes" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Custom datasets -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="donut_small"
                       label="Custom Datasets"
                       helper="Select custom dataset or create a new">
                <q-select v-model="selected_customdataset"
                          :options="custom_dataset_options"
                          @input="on_custom_dataset_selected"
                          :after="[{
                        icon: 'remove_red_eye',
                        content: true,
                        handler: view_naming_convention
                      },{
                        icon: 'fas fa-plus-square',
                        content: false,
                        handler: new_custom_dataset
                      }]" />
              </q-field>
              <q-field :label-width="4"
                       v-if="custom_datasets.length > 0"
                       inset="full">
                <custom-datasets />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Metadata -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="fas fa-tags"
                       label="Metadata"
                       helper="Metadata format">
                <q-checkbox :value="metadata.formats" @change="update('metadata.formats', $event)" label="XML" val="xml" style="margin-right: 10px" />
                <q-checkbox :value="metadata.formats" @change="update('metadata.formats', $event)" label="PDF" val="pdf" style="margin-right: 10px" />
                <q-checkbox :value="metadata.formats" @change="update('metadata.formats', $event)" label="Word" val="doc" style="margin-right: 10px" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>

        <!-- Project Report -->
        <q-card inline style="width:100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="assignment_turned_in"
                       label="Project Report"
                       helper="Project report format">
                <q-checkbox :value="project_report.formats" @change="update('project_report.formats', $event)" label="PDF" val="pdf" style="margin-right: 10px" />
                <q-checkbox :value="project_report.formats" @change="update('project_report.formats', $event)" label="Word" val="doc" style="margin-right: 10px" />
                <q-checkbox :value="project_report.formats" @change="update('project_report.formats', $event)" label="Excel" val="xls" style="margin-right: 10px" />
              </q-field>

              <q-field :label-width="4"
                       inset="full"
                       helper="Information required in report">
                <q-input :value="project_report.notes"
                         @change="update('project_report.notes', $event)"
                         type="textarea" />
              </q-field>
            </q-item-main>
          </q-item>
        </q-card>
        <q-card inline style="width: 100%">
          <q-item dense>
            <q-item-main>
              <q-field :label-width="4"
                       icon="fas fa-upload"
                       label="Supporting files"
                       helper="Uploading supporting files like site images, landing sites etc.">
                <q-uploader url=""
                            method="PUT"
                            multiple
                            :headers="{ 'x-amz-acl': 'bucket-owner-full-control' }"
                            :url-factory="getSignedUrl"
                            @add="onUploadAdd"
                            @uploaded="onUploadFinish"
                            :send-raw="true" />
              </q-field>
            </q-item-main>
          </q-item>
          <q-list separator>
            <q-item v-for="file in files">
              <q-item-main :label="file" />
              <q-item-side right><q-btn color="negative" flat round dense icon="delete" @click="confirmDelete(file)" /></q-item-side>
              <q-item-side right><q-btn flat round dense icon="file_download" @click="downloadFile(file)" /></q-item-side>
            </q-item>
          </q-list>
        </q-card>

        <!-- Additionl requirements -->
        <q-collapsible class="q-card"
                       icon="insert_comment"
                       label="Additional Requirements">

          <q-checkbox :value="additional.client_needed"
                      @change="update('additional.client_needed', $event)"
                      label="Customer representative to attend the site for UAV flight" />

          <q-input :value="additional.background"
                   @change="update('additional.background', $event)"
                   type="textarea"
                   float-label="Project Background" />

          <q-input :value="additional.raw_data"
                   @change="update('additional.raw_data', $event)"
                   type="textarea"
                   float-label="Raw Data delivery & requirements" />

          <q-input :value="additional.features"
                   @change="update('additional.features', $event)"
                   type="textarea"
                   float-label="Feature of Interest" />

          <q-input :value="additional.flight_pattern"
                   @change="update('additional.flight_pattern', $event)"
                   type="textarea"
                   float-label="Flight Pattern" />

          <q-input :value="additional.landing_takeoff"
                   @change="update('additional.landing_takeoff', $event)"
                   type="textarea"
                   float-label="UAV take off & landing" />

          <q-input :value="additional.flight_height"
                   @change="update('additional.flight_height', $event)"
                   type="textarea"
                   float-label="Flight Height" />

          <q-input :value="additional.flight_risk"
                   @change="update('additional.flight_risk', $event)"
                   type="textarea"
                   float-label="Known Flight Risks" />

          <q-input :value="additional.permits"
                   @change="update('additional.permits', $event)"
                   type="textarea"
                   float-label="Permits" />

          <q-input :value="additional.safety_approvals"
                   @change="update('additional.safety_approvals', $event)"
                   type="textarea"
                   float-label="Safety Approvals" />

          <q-input :value="additional.casa_requirements"
                   @change="update('additional.casa_requirements', $event)"
                   type="textarea"
                   float-label="CASA and CAA requirements to fly" />

          <q-input :value="additional.site_access"
                   @change="update('additional.site_access', $event)"
                   type="textarea"
                   float-label="Site Access" />

          <q-input :value="additional.vantage_point"
                   @change="update('additional.vantage_point', $event)"
                   type="textarea"
                   float-label="Site Visibility" />

          <q-input :value="additional.vegetation"
                   @change="update('additional.vegetation', $event)"
                   type="textarea"
                   float-label="Vegetation coverage & density" />

          <q-input :value="additional.environment_terrain"
                   @change="update('additional.environment_terrain', $event)"
                   type="textarea"
                   float-label="Environmental composition and terrain" />

          <q-input :value="additional.others"
                   @change="update('additional.others', $event)"
                   type="textarea"
                   float-label="Any other additional requirements" />

        </q-collapsible>
      </div>
    </q-page>
  </div>
</template>
<script>
  import './docs-input.styl'
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import PointCloudClassification from './../controls/PointCloudClassification.vue'
  import CustomDatasets from './../controls/CustomDatasets.vue'
  const _ = require('lodash');
  import { errorHandler } from './../mixins/error-handling'
  const uuidv4 = require('uuid/v4');
  const timespan = require('readable-timespan');
  timespan.set({
    lessThanFirst: 'now',
    millisecond: false
  });
  import axios from 'axios';
  const path = require('path');

  import OlMap from './../olmap/olmap';

  export default Vue.extend({
    mixins: [errorHandler],
    beforeMount() {
      // Load data required for the view
      this.$store.dispatch('common/loadDataset', { type: 'standard' });
      this.$store.dispatch('common/loadDataset', { type: 'custom' });
      if (this.$route.query.id) {
        this.$store.dispatch('uav_tender/getTender', { id: this.$route.query.id });
      }
    },

    components: {
      'pc-classification': PointCloudClassification,
      'custom-datasets': CustomDatasets
    },
    mounted() {
      var olmap = OlMap(this.$refs.mapDiv, {
        basemap: "osm"
      })
      olmap.initMap();
      this.map = olmap;
      this.map.onAdd = (geojson) => {
        // Geo json added to map, push it to server
        this.$store.dispatch('uav_tender/putAoi', { id: this.project_details.id, geojson: geojson })
          .catch((e) => {
            this.notify('negative', 'Error uploading Aoi to server.')
          });
      }

      if (this.aoiUrl) { this.map.addGeojsonUrl(this.aoiUrl) }

      if (!this.project_details.id) {
        this.update('id', uuidv4());
      }
    },
    watch: {
      aoiUrl(newValue, oldValue) {
        // Update map when aoiUrl Changes
        if (newValue) { this.map.addGeojsonUrl(newValue) }
      }
    },
    methods: {
      confirmDelete(file) {
        this.$q.dialog({
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this file? Once deleted files cannot be retrieved.',
          ok: 'Yes, delete it',
          cancel: 'Cancel'
        }).then(() => {
          this.deleteFile(file)
        }).catch(() => {
          
        })
      },
      deleteFile(file) {
        axios.delete('/api/uav/download/' + this.project_details.id + '?path=' + file)
          .then((r) => {
            this.$store.commit('uav_tender/removeFile', r.data.file);
            
          })
      },
      downloadFile(file) {
        axios.get('/api/uav/download/' + this.project_details.id + '?path=' + file)
          .then((r) => {
            axios.create().get(r.data.url, { responseType: 'blob' })
              .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', unescape(response.request.responseURL.split('/').pop().split('#')[0].split('?')[0]));
                document.body.appendChild(link);
                link.click();
              });
        })
      },
      onUploadFinish(file, xhr) {
        this.$store.commit('uav_tender/addFile', file.name);
      },
      onUploadAdd(files) {
        var file_sizes = _.reduce(files, (r, f) => {
          if (f.size > 5 * 1024 * 1024) {
            r.push(f.size);
          }
          return r;
        }, []);

        if (file_sizes.length > 0) {
          this.notify('negative', 'Files over 5MB in size will not be uploaded.')
        }
      },
      async getSignedUrl(file) {
        this.contentType = file.type;

        if (file.size > 5 * 1024 * 1024) {
          return '';
        }

        var signed_url = await this.axios.post('/api/signedurl', {
          file_name: 'uav/requirements/' + this.project_details.id + '/assets/' + file.name,
          content_type: file.type
        })
          .then((response) => {
            return response.data.url;
          });
        return signed_url;
      },

      view_naming_convention() {
        // TODO: Redirect to naming convention page
        this.$router.push({ path: '../standarddataset/' + this.delivery.naming_convention.id })
      },

      new_naming_convention() {
        this.$router.push({ path: '../standarddataset/new' })
      },

      new_custom_dataset() {
        this.$router.push({ path: '../customdataset/new'})
      },

      set_tile_size(key_path, value, mosaic_allowed) {
        this.$store.commit('uav_tender/update', {
          path: key_path, value: _.reduce(value, (result, v) => {
            if ((mosaic_allowed && v.toLowerCase() === "mosaic") || (!isNaN(v.toLowerCase().replace("km", "").trim()) && parseFloat(v.toLowerCase().replace("km", "").trim()) > 0)) {
              result.push(v.toLowerCase() === "mosaic" ? v.toLowerCase() : v.toLowerCase().replace("km", "").trim() + " km")
            }
            return result;
          }, [])
        })
      },

      set_resolution(key_path, value) {
        this.$store.commit('uav_tender/update', {
          path: key_path, value: _.reduce(value, (result, v) => {
            if (!isNaN(v.toLowerCase().replace("m", "").trim()) && parseFloat(v.toLowerCase().replace("m", "").trim()) > 0) {
              result.push(v.toLowerCase().replace("m", "").trim() + " m")
            }
            return result;
          }, [])
        })
      },

      set_attributes(key_path, value) {
        this.$store.commit('uav_tender/update', {
          path: key_path, value: _.reduce(value, (result, v) => {
            if (result.indexOf(v.toUpperCase()) < 0) {
              result.push(v.toUpperCase())
            }
            return result;
          }, [])
        })
      },

      on_pc_version_changed() {
        var pdrfIdx = _.findIndex(this.version_pdrf_formats, (f) => {
          return f.value == this.point_cloud.pdrf
        });

        if (pdrfIdx < 0) {
          this.pc_pdrf_format = null;
        }
      },

      on_custom_dataset_selected() {
        if (_.findIndex(this.custom_datasets, (d) => { return d.id === this.selected_customdataset }) < 0) {
          var cd_selected = _.find(this.available_custom_datasets, (d) => {
            return d.id === this.selected_customdataset;
          });

          this.$store.commit('uav_tender/addCustomDataset', cd_selected);
        }

        this.selected_customdataset = null;
      },

      on_standard_dataset_selected(id) {
        var sd_selected = null;
        if (_.findIndex(this.available_standard_datasets, (d) => { return d.id === id }) > -1) {
          sd_selected = _.find(this.available_standard_datasets, (d) => {
            return d.id === id;
          });
        }

        this.update('delivery.naming_convention', sd_selected);
      },

      on_pc_pdrf_changed() {
        if (this.point_cloud.pdrf >= 6) {
          this.classification = this.point_cloud.classification ? _.unionBy(this.point_cloud.classification, this.classification_new, 'class') : this.classification_new;
        }
        else {
          this.classification = this.point_cloud.classification ? _.intersectionBy(this.point_cloud.classification, this.classification_old, 'class') : this.classification_old;
        }
      },

      update(key, event) {
        this.$store.commit('uav_tender/update', {
          path: key,
          value: event
        })
      },

      saveTender() {
        this.$store.dispatch('uav_tender/saveTender')
      },

      createTenderDoc() {
        this.axios.post('/api/tasks/tender')
          .then((response) => {
            console.log(response)
          })
          .catch((error) => {
            console.log(error)
          });
      }
    },
    computed: {
      ...mapGetters({
        project_details: 'uav_tender/project_details',
        point_cloud: 'uav_tender/point_cloud',
        collection: 'uav_tender/collection',
        delivery: 'uav_tender/delivery',
        spatial_reference: 'uav_tender/spatial_reference',
        imagery: 'uav_tender/imagery',
        dem: 'uav_tender/dem',
        dsm: 'uav_tender/dsm',
        contours: 'uav_tender/contours',
        video: 'uav_tender/video',
        metadata: 'uav_tender/metadata',
        trajectory: 'uav_tender/trajectory',
        models_3d: 'uav_tender/models_3d',
        project_report: 'uav_tender/project_report',
        tile_index: 'uav_tender/tile_index',
        custom_datasets: 'uav_tender/custom_datasets',
        additional: 'uav_tender/additional',
        files: 'uav_tender/files',
        aoiUrl: 'uav_tender/aoiUrl',
        pc_versions: 'common/pc_versions',
        pdrf_formats: 'common/pdrf_formats',
        hcs: 'common/hcs',
        vcs: 'common/vcs',
        video_resolution: 'common/video_resolution',
        scan_angle: 'common/scan_angle',
        naming_conventions: 'common/naming_conventions',
        available_custom_datasets: 'common/custom_datasets',
        available_standard_datasets: 'common/standard_datasets',
        classification_old: 'common/classification_old',
        classification_new: 'common/classification_new',
      }),
      naming_convention_id() {
        return this.delivery && this.delivery.naming_convention ? this.delivery.naming_convention.id : null;
      },
      updated_readable() {
        if (this.project_details.updated) {
          var elapsed = timespan.parse(Date.now() - Date.parse(this.project_details.updated));
          return elapsed === "now" ? "just " + elapsed : elapsed + " ago"
        }
        return this.project_details.updated
      },
      custom_dataset_options() {
        return _.map(
          _.reject(this.available_custom_datasets, (v) => {
            return _.findIndex(this.custom_datasets, (cd) => { return cd.id === v.id }) > -1;
          }), (v) => {
            return {
              label: v.name,
              value: v.id
            };
          })
      },
      version_pdrf_formats() {
        return _.filter(this.pdrf_formats, (f) => {
          return this.point_cloud.version == 1.2 ? f.value <= 3 : this.point_cloud.version == 1.3 ? f.value <= 5 : this.point_cloud.version == 1.4 ? true : f.value <= 3;
        })
      },
      pdrf_classification() {
        return {
          min: this.point_cloud.pdrf >= 6 ? 19 : 13,
          max: this.point_cloud.pdrf >= 6 ? 255 : 31
        }
      },
      is_proj_dtl_needed() {
        return !this.project_details.created || !this.project_details.name || !this.project_details.contract_no;
      },
      pc_version: {
        get() { return this.point_cloud.version },
        set(value) { this.$store.commit('uav_tender/update', { path: 'point_cloud.version', value: value }) }
      },
      is_pc_required: {
        get() { return this.point_cloud.required },
        set(value) { this.$store.commit('uav_tender/update', { path: 'point_cloud.required', value: value }) }
      },
      pc_pdrf_format: {
        get() { return this.point_cloud.pdrf },
        set(value) { this.$store.commit('uav_tender/update', { path: 'point_cloud.pdrf', value: value }) }
      },
      classification: {
        get() {
          if (this.point_cloud.classification) {
            return this.point_cloud.classification;
          }
          else {
            return this.point_cloud.pdrf >= 6 ? this.classification_new : this.classification_old
          }
        },
        set(value) { this.$store.commit('uav_tender/update', { path: 'point_cloud.classification', value: _.cloneDeep(value) }) }
      },
      img_resolution: {
        get() { return _.cloneDeep(this.imagery.resolutions) },
        set(value) { this.set_resolution('imagery.resolutions', value) }
      },
      img_tile_size: {
        get() { return _.cloneDeep(this.imagery.tile_sizes) },
        set(value) { this.set_tile_size('imagery.tile_sizes', value, true) }
      },
      dem_resolution: {
        get() { return _.cloneDeep(this.dem.resolutions) },
        set(value) { this.set_resolution('dem.resolutions', value) }
      },
      dem_tile_size: {
        get() { return _.cloneDeep(this.dem.tile_sizes) },
        set(value) { this.set_tile_size('dem.tile_sizes', value, true) }
      },
      dsm_resolution: {
        get() { return _.cloneDeep(this.dsm.resolutions) },
        set(value) { this.set_resolution('dsm.resolutions', value) }
      },
      dsm_tile_size: {
        get() { return _.cloneDeep(this.dsm.tile_sizes) },
        set(value) { this.set_tile_size('dsm.tile_sizes', value, true) }
      },
      contour_tile_size: {
        get() { return _.cloneDeep(this.contours.tile_sizes) },
        set(value) { this.set_tile_size('contours.tile_sizes', value, true) }
      },
      tile_index_tile_size: {
        get() { return _.cloneDeep(this.tile_index.tile_sizes) },
        set(value) { this.set_tile_size('tile_index.tile_sizes', value, false) }
      },
      pc_tile_size: {
        get() { return _.cloneDeep(this.point_cloud.tile_sizes) },
        set(value) { this.set_tile_size('point_cloud.tile_sizes', value, false) }
      },
      contour_attrs: {
        get() { return _.cloneDeep(this.contours.attributes) },
        set(value) { this.set_attributes('contours.attributes', value) }
      },
      traj_attrs: {
        get() { return _.cloneDeep(this.trajectory.attributes) },
        set(value) { this.set_attributes('trajectory.attributes', value) }
      },
      is_time_sensitive: {
        get() { return this.collection.time_sensitive.is_sensitive },
        set(value) {
          this.$store.commit('uav_tender/update', { path: 'collection.time_sensitive.is_sensitive', value: value })
          // Set date & time range to null when turned off
          if (!value) {
            this.$store.commit('uav_tender/update', { path: 'collection.time_sensitive.time_range', value: null })
            this.$store.commit('uav_tender/update', { path: 'collection.time_sensitive.comment', value: null })
          }
        }
      },
      is_time_series_data: {
        get() { return this.collection.time_series_data },
        set(value) { this.$store.commit('uav_tender/update', { path: 'collection.time_series_data', value: value }) }
      }
    },
    data() {
      return {
        map: null,
        selected_customdataset: null,
        contentType: null,
        project_name: null,
        contract_no: null
      }
    }
  });
</script>
<style lang="stylus">
  .q-chip-right {
    margin-right: -12px;
  }
</style>
