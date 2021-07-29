<template>
  <div :class="{ guessed }">
    <div class="score-bar">
      <div class="current-step">
        {{ round.id }}/{{ game.length }}
      </div>
      <div v-if="guessed" class="question">
        {{ round.answer }}
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
    <div v-if="!guessed" class="button-container">
      <geo-button :variant="markers.length ? 'primary' : 'disabled'" :class="['guess-button', { 'button-hide': !showMap }]" @click="guess">
        {{ markers.length ? 'Crec que és ací ->' : 'Tria un punt al mapa' }}
      </geo-button>
      <geo-button :class="['show-map-button', { 'button-hide': showMap }]" @click="showMap = !showMap">
        <icons-map />
        Endevina-ho
      </geo-button>
    </div>
    <div v-else class="result">
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
      <div class="result-text" v-html="round.text" />
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
import { calculateDistance, calculateScore } from '../utils/math'
import questionPin from '../assets/images/question-pin.png'
import flagPin from '../assets/images/flag-pin.png'
import filtersMixin from '../utils/filtersMixin'

export default {
  mixins: [filtersMixin],

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
    setMarker ({ latLng }) {
      if (this.guessed) { return }
      this.markers = [{
        position: { lat: latLng.lat(), lng: latLng.lng() },
        icon: questionPin
      }]
      this.updateLat({ latLng })
    },

    guess () {
      if (!this.markers.length) {
        alert('Primer has de triar un punt al mapa')
        return
      }

      // Add result markers and path
      this.markers.push({ position: this.round.position, icon: flagPin })
      this.path = [this.currentGuess, this.round.position]

      // Fit map to bounds
      this.fitToBounds(this.path)

      // Calculate distance and score
      this.distance = calculateDistance(this.path)
      this.roundScore = calculateScore(this.distance)

      // Record result and add points
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

    updateLat ({ latLng }) {
      this.currentGuess.lat = latLng.lat()
      this.currentGuess.lng = latLng.lng()
    },

    fitToBounds ([guess, answer]) {
      this.$refs.map.$mapPromise.then((map) => {
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(guess)
        bounds.extend(answer)
        map.fitBounds(bounds)
      })
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
  padding: 0 1rem;
  background: $yellow;
  z-index: 10;

  .current-step {
    font-family: $headings-font-family;
    font-size: 3.5rem;
    line-height: 1.2;
    transform: translateY(.06em);
  }

  .question {
    font-size: 1.75rem;
    text-align: center;
    margin: 0 auto;
    padding: 0 .5rem;
  }

  .score {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 1rem;
    line-height: 0.85;

    &-points {
      font-family: $headings-font-family;
      font-size: 2.5rem;
    }
  }
}

.location {
  width: 100%;
  position: relative;
  transition: .2s;
  z-index: 1000;
  padding-bottom: 6rem;

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
      bottom: 1rem;
      left: 10%;
      width: 25%;
      border: 14px solid $white;
      position: absolute;
      height: 20vh;
      transition: .25s;
      min-width: 250px;
      min-height: 300px;
      max-height: 500px;
      box-shadow: $box-shadow;

      &:hover {
        height: 55vh;
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
  bottom: .5rem;
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
  transition: .25s ease;
  padding-top: .5rem;

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
      bottom: 3rem;

      &:hover {
        height: 40vh;
        width: 45%;
      }
    }
  }
}

.result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -1rem;
  padding-bottom: $score-bar-height;

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
    font-size: $text-lg-fallback;
    font-size: $text-lg;
    text-align: center;
    line-height: 1.1;
    margin: 2rem 0;
  }

  &-text {
    margin: 0;
    font-size: 1.25rem;
    text-align: center;
    max-width: 800px;

    &::v-deep img {
      display: block;
      width: 80%;
      max-width: 500px;
      border: 10px $white solid;
      box-shadow: $box-shadow;
      transform: rotate(-1.5deg);
      margin: 2rem auto;
    }
  }
}

@include media-breakpoint-down(md) {
  .score-bar {
    height: $score-bar-height;

    .question {
      font-size: 1.15rem;
      line-height: 1.1;
    }
  }

  .location {
    width: 100%;
    position: fixed;
    top: $score-bar-height;
    bottom: $button-bar-height;
    left: 0;
    right: 0;
    transform: translateY(0);
    display: flex;
    padding: 0;

    &-street-view {
      display: flex;
      width: 100%;

      &-canvas {
        width: 100%;
        height: 100%;
        border: none;
        transform: none;
        border-width: 10px;
      }
    }

    &-map {
      transform: translateX(100%) rotate(5deg);
      z-index: 10;
      position: fixed;
      top: 1rem;
      left: 0;
      right: 0;
      bottom: 1rem;
      padding: 1rem;
      transition: .5s cubic-bezier(.17,.67,.23,1.18);

      &-canvas {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        border-width: 10px;

        &:hover {
          width: 100%;
          height: 100%;
        }
      }

      &-show {
        transform: translateX(0%) rotate(0);
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
    padding-top: 0;

    .location {
      background: $yellow;
      height: 33vh;
      width: calc(100% - 1rem);

      &-map {
        top: 0;
        transform: translateX(.5rem);
      }
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
      display: block;
      position: fixed;
      background: $yellow;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
      padding: 1rem;
      padding-top: 53vh;
      margin: 0;
      text-align: center;

      &-text {
        font-size: 1rem;
      }

      .next-button {
        margin-bottom: 3rem;
      }
    }
  }

  .button-show {
    display: block !important;
  }

  .button-hide {
    display: none !important;
  }

  .button-container {
    position: fixed;
    height: $button-bar-height;
    padding: .5rem;
    bottom: 0;
    display: flex;
  }
}
</style>
