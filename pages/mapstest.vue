<template>
  <div>
    <GmapMap ref="map" style="width: 600px; height: 400px;" :zoom="1" :center="{lat: 0, lng: 0}">
      <GmapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :draggable="true"
        @dragend="updateLat"
      />
    </GmapMap>
    <gmap-street-view-panorama
      class="pano"
      :position="{lat: 52.201272, lng: 0.118720}"
      style="width: 500px;
      height: 300px;"
      :pov="pov"
      :zoom="1"
      @pano_changed="updatePano"
      @pov_changed="updatePov"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      pov: null,
      pano: null,
      markers: [{
        position: {
          lat: 10.0,
          lng: 10.0
        }
      }, {
        position: {
          lat: 11.0,
          lng: 11.0
        }
      }],
      place: null
    }
  },
  methods: {
    updatePov (pov) {
      this.pov = pov
    },
    updatePano (pano) {
      this.pano = pano
    },

    updateLat (hello) {
      console.log(hello.latLng.lat(), hello.latLng.lng())
    }
  }
}
</script>
