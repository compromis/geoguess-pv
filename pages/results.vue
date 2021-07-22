<template>
  <div class="results">
    <h1 class="results-headline">
      <span class="results-headline-points">{{ score | formatNumber }}</span>
      <span class="results-headline-label">Punts</span>
    </h1>
    <div class="cols">
      <div class="results-map">
        <gmap-map
          ref="map"
          class="results-map-canvas"
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
            clickableIcons: false
          }"
        >
          <gmap-marker
            v-for="(marker, i) in markers"
            :key="'marker' + i"
            :position="marker.position"
            :icon="marker.icon"
          />
          <gmap-polyline
            v-for="(path, i) in paths"
            :key="'path' + i"
            :path="path"
          />
        </gmap-map>
      </div>
      <div class="results-summary">
        <table>
          <colgroup>
            <col>
            <col width="120">
            <col width="120">
          </colgroup>
          <tbody>
            <tr v-for="(result, i) in summary" :key="i">
              <th>
                {{ result.round.label }}
              </th>
              <td class="results-summary-distance">
                {{ result.distance | inKm }}
              </td>
              <td class="results-summary-score">
                <span>+{{ result.score | formatNumber }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="results-summary-total">
              <th colspan="2">
                Total
              </th>
              <td class="results-summary-score">
                <span>{{ total | formatNumber }}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <geo-button to="play">
      Torna a jugar
    </geo-button>
  </div>
</template>

<script>
import { inKm } from '../utils/math'
import questionPin from '../assets/images/question-pin.png'
import flagPin from '../assets/images/flag-pin.png'

export default {
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat('ca-ES').format(number)
    },

    inKm (value) {
      return inKm(value)
    }
  },

  layout: 'home',

  middleware ({ store, redirect }) {
    if (!store.state.summary.length) {
      redirect('/')
    }
  },

  data () {
    return {
      pvPosition: {
        lat: 39.4713682,
        lng: -0.3826744
      }
    }
  },

  computed: {
    score () {
      return this.$store.state.score
    },

    summary () {
      return this.$store.state.summary
    },

    total () {
      return this.summary.length ? this.summary.reduce((a, b) => ({ score: a.score + b.score })).score : 0
    },

    markers () {
      const markers = []

      this.summary.forEach((result) => {
        markers.push({
          position: result.guess,
          icon: questionPin
        })
        markers.push({
          position: result.round.position,
          icon: flagPin
        })
      })

      return markers
    },

    paths () {
      const paths = []

      this.summary.forEach((result) => {
        paths.push([
          result.guess,
          result.round.position
        ])
      })

      return paths
    }
  }
}
</script>

<style lang="scss" scoped>
  .results {
    max-width: 1600px;
    width: 100%;
    padding: 0 1rem;
    text-align: center;

    &-headline {
      line-height: .9;

      &-points {
        font-size: calc(3rem + 4vw);
      }

      &-label {
        display: block;
        font-family: $font-family-sans-serif;
        text-transform: capitalize;
        font-size: 2.25rem;
      }
    }

    &-map {
      &-canvas {
        border: 14px solid $white;
        width: 100%;
        transform: rotate(-1deg);
        box-shadow: $box-shadow;
      }
    }

    &-summary {
      table {
        width: 100%;
        border: 1px $black solid;
        margin: 3rem auto;
        max-width: 800px;
      }

      th,
      td {
        border-bottom: 1px $black solid;
        padding: .5rem .75rem;
        font-weight: normal;
      }

      th {
        text-align: left;
        font-size: 1.5rem;
      }

      &-distance {
        text-align: right;
        font-size: 1.5rem;
      }

      &-score {
        text-align: right;
        font-family: $headings-font-family;

        span {
          display: block;
          font-size: 2.5rem;
          margin: -.5rem 0;
          transform: translateY(.25rem);
        }
      }

      &-total {
        th,
        td {
          background: $black;
          color: $white;
        }
      }
    }

    .cols {
      display: grid;
      grid-template-columns: 1fr 1.85fr;
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;

      .results-map {
        &-canvas {
          height: 675px;
        }
      }
    }
  }
</style>
