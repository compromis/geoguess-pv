<template>
  <div :class="{ guessed }">
    <div class="score-bar">
      <div class="current-step">
        {{ round.id }}/{{ game.length }}
      </div>
      <div v-if="guessed" class="question">
        {{ round.name }}
      </div>
      <div v-else class="question">
        {{ round.question }}
      </div>
      <div class="score">
        <span class="score-points">{{ score }}</span>
        <span class="score-label">Punts</span>
      </div>
    </div>
    <div class="location">
      <div class="location-street-view">
        <gmap-street-view-panorama
          class="pano location-street-view-canvas"
          :position="round.position"
          :pov="round.pov"
          :zoom="1"
          :options="{ addressControl: false, showRoadLabels: false }"
        />
      </div>
      <div class="location-map">
        <gmap-map
          ref="map"
          class="location-map-canvas"
          :zoom="7"
          :center="pvPosition"
          :options="{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUI: true,
            draggableCursor: 'crosshair',
            clickableIcons: false
          }"
          @click="setMarker($event)"
        >
          <gmap-marker
            v-for="(marker, i) in markers"
            :key="i"
            :position="marker"
            :draggable="!guessed"
            @dragend="updateLat"
          />
          <gmap-polyline
            v-if="path.length > 0"
            :path="path"
          />
          </gmap-polyline>
        </gmap-map>
      </div>
    </div>
    <div class="button-container">
      <geo-button v-if="!guessed" class="guess-button" @click="guess">
        Es ací ->
      </geo-button>
      <geo-button v-if="!guessed" :class="{ showMap : 'location-map-show'}" @click="showMap = !showMap">
        Endevina-ho
      </geo-button>
    </div>
    <div v-if="guessed" class="result">
      <div class="result-score">
        <span class="result-score-points">+ {{ roundScore }}</span>
        <span class="result-score-label">Punts</span>
      </div>
      <div class="result-distance">
        Has fallat per {{ distance | inKm }}
      </div>
      <p class="result-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <geo-button @click="nextRound">
        {{ round.id === game.length ? 'Finalitzar' : 'Següent ronda' }}
      </geo-button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  filters: {
    inKm (value) {
      return value > 1000 ? (value / 1000).toFixed(0) + 'km' : value + ' metres'
    }
  },

  props: {
    round: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      guessed: false,
      roundScore: 0,
      distance: 0,
      pvPosition: {
        lat: 39.4713682,
        lng: -0.3826744
      },
      currentGuess: {
        lat: 0,
        lng: 0
      },
      markers: [],
      path: [],
      showMap: false
    }
  },

  computed: {
    score () {
      return this.$store.state.score
    },

    game () {
      return this.$store.state.game
    }
  },

  methods: {
    setMarker (event) {
      this.markers = [{ lat: event.latLng.lat(), lng: event.latLng.lng() }]
      this.updateLat(event)
    },

    guess () {
      const { lat: lat1, lng: lon1 } = this.currentGuess
      const { lat: lat2, lng: lon2 } = this.round.position
      this.markers.push(this.round.position)
      this.path = [
        { lat: lat1, lng: lon1 },
        { lat: lat2, lng: lon2 }
      ]
      this.distance = this.calculateDistance({ lat1, lat2, lon1, lon2 })
      this.roundScore = this.calculateScore(this.distance)
      this.guessed = true
      this.$store.commit('addPoints', this.roundScore)
      this.$store.commit('recordResult', {
        round: this.round,
        distance: this.distance,
        score: this.roundScore
      })
    },

    nextRound () {
      this.$store.commit('setRound', this.round.id + 1)
    },

    updateLat (event) {
      this.currentGuess.lat = event.latLng.lat()
      this.currentGuess.lng = event.latLng.lng()
    },

    calculateDistance ({ lat1, lat2, lon1, lon2 }) {
      // Source: https://www.movable-type.co.uk/scripts/latlong.html
      const R = 6371e3 // metres
      const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
      const φ2 = lat2 * Math.PI / 180
      const Δφ = (lat2 - lat1) * Math.PI / 180
      const Δλ = (lon2 - lon1) * Math.PI / 180

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c

      return Math.round(d)
    },

    calculateScore (distance) {
      const maxScore = 500
      const minScore = 0
      const maxDistance = 50000
      const score = Math.round(maxScore + (distance - 1) * ((minScore - maxScore) / (maxDistance - 1)))
      return score > 0 ? score : 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";
@import "~bootstrap/scss/_mixins";

.score-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: .5rem 1rem;
  background: $yellow;
  z-index: 10;

  .current-step {
    font-family: $headings-font-family;
    font-size: 3.5rem;
    line-height: 1.2;
  }

  .question {
    font-size: 2.25rem;
    text-align: center;
    margin: 0 auto;
  }

  .score {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 1.15rem;

    &-points {
      font-family: $headings-font-family;
      font-size: 3rem;
      line-height: 1.2;
    }

    &-label {
      line-height: 0.8;
    }
  }
}

.location {
  width: 100%;
  position: relative;

  &-street-view {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-canvas {
      border: 14px solid $white;
      width: 90%;
      transform: rotate(1deg);
      height: 60vh;
    }
  }

  &-map {
    &-canvas {
      position: absolute;
      bottom: -5rem;
      left: 10%;
      width: 25%;
      border: 14px solid $white;
      position: absolute;
      height: 20vh;
      transition: .25s;
      min-width: 250px;
      min-height: 200px;
      box-shadow: $box-shadow;

      &:hover {
        height: 35vh;
        width: 45%;
      }
    }
  }
}

.button-container {
  margin: 0 auto;
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 400px;

  .geo-button {
    width: 100%;
  }
}

.guessed {
  .location {
    &-street-view {
      align-items: flex-end;

      &-canvas {
        width: 65%;
        height: 500px;
        transition: .6s ease-out;
      }
    }

    &-map-canvas {
      transform: rotate(-2deg);
      height: 350px;
      width: 45%;
      left: 0;
      transition: .6s ease-out;

      &:hover {
        height: 350px;
        width: 45%;
      }
    }
  }
}

.result {
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-score {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-bottom: 1rem;

    &-points {
      font-family: $headings-font-family;
      font-size: 4rem;
      line-height: .8;
    }
  }

  &-distance {
    font-size: 2rem;
  }

  &-text {
    margin: 2rem 0;
    font-size: 1.25rem;
    text-align: center;
    max-width: 800px;
  }
}

@include media-breakpoint-down(sm) {
  .score-bar {
    //sadasd
  }

  .location {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    &-street-view {
      width: 100%;

      &-canvas {
        width: 100%;
        height: calc(100vh - 80px);
        border: none;
        transform: none;
      }
    }

    &-map {
      display: block;
      z-index: 10;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      padding: 0 1rem;

      &-canvas {
        position: relative;
        width: 100%;
        height: 70vh;
        left: 0;
        bottom: -7rem;
      }

      &-show {
        display: block;
        position: absolute;
      }
    }
  }

  .button-container {
    bottom: .5rem;

    .geo-button {
      height: 65px;
    }
  }
}
</style>
