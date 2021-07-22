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
        <span class="score-label">de {{ game.length * 500 | formatNumber }}</span>
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
      <div :class="['location-map', { 'location-map-show': showMap }]">
        <button class="close-map-button" aria-label="Tanca mapa" @click="showMap = false">
          &times;
        </button>
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
            :position="marker.position"
            :draggable="!guessed"
            :icon="marker.icon"
            @dragend="updateLat"
          />
          <gmap-polyline
            v-if="path.length > 0"
            :path="path"
          />
        </gmap-map>
        <geo-button v-if="!guessed && markers.length" class="guess-button map-button button-hide" @click="guess">
          Crec que és ací ->
        </geo-button>
        <geo-button v-else-if="!guessed" variant="disabled" class="guess-button map-button button-hide">
          Tria un punt al mapa
        </geo-button>
      </div>
    </div>
    <div class="button-container">
      <geo-button v-if="!guessed" :class="['guess-button', { 'button-hide': !showMap }]" @click="guess">
        Es ací ->
      </geo-button>
      <geo-button v-if="!guessed" :class="['show-map-button', { 'button-hide': showMap }]" @click="showMap = !showMap">
        <map-icon />
        Endevina-ho
      </geo-button>
    </div>
    <div v-if="guessed" class="result">
      <div class="result-score">
        <span class="result-score-points">+ {{ roundScore }}</span>
        <span class="result-score-label">Punts</span>
      </div>
      <geo-bar :score="roundScore" />
      <div v-if="distance > 1000" class="result-distance">
        Has fallat per {{ distance | inKm }}
      </div>
      <div v-else class="result-distance">
        Molt bé! T'has apropat {{ distance | inKm }}
      </div>
      <p class="result-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <div class="next-button">
        <geo-button v-if="round.id === game.length" to="results">
          Mostra resultats
        </geo-button>
        <geo-button v-else @click="nextRound">
          Següent ronda ->
        </geo-button>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateDistance, calculateScore, inKm } from '../utils/math'
import questionPin from '../assets/images/question-pin.png'
import flagPin from '../assets/images/flag-pin.png'

const userIcon = {
  url: questionPin
}
const flagIcon = {
  url: flagPin
}

export default {
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat('es-ES').format(number)
    },

    inKm (value) {
      return inKm(value)
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
      if (this.guessed) { return }
      this.markers = [{ position: { lat: event.latLng.lat(), lng: event.latLng.lng() }, icon: userIcon }]
      this.updateLat(event)
    },

    guess () {
      const { lat: lat1, lng: lon1 } = this.currentGuess
      const { lat: lat2, lng: lon2 } = this.round.position
      this.markers.push({ position: this.round.position, icon: flagIcon })
      this.path = [
        { lat: lat1, lng: lon1 },
        { lat: lat2, lng: lon2 }
      ]
      this.distance = calculateDistance({ lat1, lat2, lon1, lon2 })
      this.roundScore = calculateScore(this.distance)
      this.guessed = true
      this.$store.commit('addPoints', this.roundScore)
      this.$store.commit('recordResult', {
        round: this.round,
        guess: this.currentGuess,
        distance: this.distance,
        score: this.roundScore
      })
    },

    nextRound () {
      this.$store.commit('nextRound')
    },

    updateLat (event) {
      this.currentGuess.lat = event.latLng.lat()
      this.currentGuess.lng = event.latLng.lng()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";
@import "~bootstrap/scss/_mixins";

$score-bar-height: 6rem;
$button-bar-height: 5rem;

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
    font-size: 2rem;
    text-align: center;
    margin: 0 auto;
  }

  .score {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 1rem;
    line-height: 0.85;

    &-points {
      font-family: $headings-font-family;
      font-size: 3rem;
    }
  }
}

.location {
  width: 100%;
  position: relative;
  transition: .2s;
  transform: translateY(-3rem);

  &-street-view {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-canvas {
      border: 14px solid $white;
      width: 95%;
      transform: rotate(1deg);
      height: 74vh;
      box-shadow: $box-shadow-sm;
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
      min-height: 300px;
      box-shadow: $box-shadow;

      &:hover {
        height: 35vh;
        width: 45%;
      }
    }

    .make-guess {
      position: absolute;
      bottom: -9rem;
      left: 10%;
      width: 300px;
      text-align: center;
    }
  }
}

.close-map-button {
  display: none;
}

.next-button {
  margin-top: 2rem;

  .geo-button {
    font-size: 1.5rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.geo-button.map-button {
  position: absolute;
  bottom: -7rem;
  right: 15%;
  font-size: 1.5rem;
  padding-left: 3rem;
  padding-right: 3rem;
}

.button-container {
  margin: 0 auto;
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: none;
  justify-content: center;
  width: 100%;
  max-width: 400px;

  .geo-button {
    width: 100%;
  }
}

.guessed {
  .location {
    transform: translateY(0);

    &-street-view {
      align-items: flex-end;

      &-canvas {
        width: 65%;
        height: 50vh;
        transition: .6s ease-out;
      }
    }

    &-map-canvas {
      transform: rotate(-2deg);
      height: 40vh;
      max-height: 350px;
      width: 45%;
      left: 0;
      transition: .6s ease-out;
      bottom: -3rem;

      &:hover {
        height: 40vh;
        width: 45%;
      }
    }
  }
}

.result {
  margin-top: 7rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-score {
    display: flex;
    flex-direction: column;
    text-align: center;

    &-points {
      font-family: $headings-font-family;
      font-size: 4rem;
      line-height: .8;
    }
  }

  &-distance {
    font-size: 1.75rem;
  }

  &-text {
    margin: 1rem 0;
    font-size: 1.25rem;
    text-align: center;
    max-width: 800px;
  }
}

.show-map-button {
  display: none;
}

@include media-breakpoint-down(md) {
  .score-bar {
    height: $score-bar-height;

    .question {
      font-size: 1.25rem;
      line-height: 1.1;
    }
  }

  .location {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transform: translateY(0);

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
      display: none;
      z-index: 10;
      position: fixed;
      top: $score-bar-height;
      left: 0;
      right: 0;
      bottom: $button-bar-height;
      padding: 1rem;

      &-canvas {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;

        &:hover {
          width: 100%;
          height: 100%;
        }
      }

      &-show {
        display: flex !important;
      }

      .close-map-button {
        display: block;
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 10;
        background: $white;
        border: 0;
        font-size: 2.5rem;
        padding: 0 1.25rem;
      }
    }
  }

  .guessed {
    .location {
      background: $yellow;
      height: 33vh;
    }

    .location-street-view,
    .close-map-button {
      display: none;
    }

    .location-map-canvas,
    .location-map-canvas:hover {
      width: 100%;
      height: 33vh;
      min-height: 30vh;
    }

    .result {
      margin-top: 38vh;
    }
  }

  .button-show {
    display: block !important;
  }

  .button-hide {
    display: none !important;
  }

  .button-container {
    height: $button-bar-height;
    padding: .5rem;
    bottom: 0;
    display: flex;
  }

  .guess-button {
    display: none;
  }

  .show-map-button {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 1.5em;
      height: 1.5em;
      margin-right: .5em;
    }
  }
}
</style>
