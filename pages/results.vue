<template>
  <div class="page">
    <geo-nav />
    <div class="results">
      <h1 class="results-headline">
        <span class="results-headline-points">{{ score | formatNumber }}</span>
        <span class="results-headline-label">Punts</span>
      </h1>
      <p class="results-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <div class="cols">
        <div class="results-map">
          <gmap-map
            ref="map"
            class="results-map-canvas"
            :zoom="8"
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
              <col width="110">
              <col width="110">
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
                  <span>{{ score | formatNumber }}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="results-share">
        <h2>Comparteix la teua puntuació<br>i repta a les teues amistats</h2>
        <ul>
          <li>
            <geo-button variant="twitter" :href="`https://twitter.com/intent/tweet/?text=${shareable.text}&url=${shareable.url}&hashtags=${shareable.hashtag}`" target="_blank">
              <icons-twitter /> Twitter
            </geo-button>
          </li>
          <li>
            <geo-button variant="facebook" :href="`https://www.facebook.com/sharer/sharer.php?u=${shareable.url}`" target="_blank">
              <icons-facebook /> Facebook
            </geo-button>
          </li>
          <li>
            <geo-button variant="whatsapp" :href="`whatsapp://send?text=${shareable.text} ${shareable.url}`" target="_blank">
              <icons-whatsapp />Whatsapp
            </geo-button>
          </li>
          <li>
            <geo-button variant="telegram" :href="`https://t.me/share/url?url=${shareable.url}&text=${shareable.text}`" target="_blank">
              <icons-telegram />Telegram
            </geo-button>
          </li>
        </ul>
      </div>
      <geo-button to="play" variant="yellow" class="replay">
        <icons-replay /> Torna a jugar
      </geo-button>
    </div>
  </div>
</template>

<script>
import { url } from '../content/meta'
import filtersMixin from '../utils/filtersMixin'
import questionPin from '../assets/images/question-pin.png'
import flagPin from '../assets/images/flag-pin.png'

export default {
  mixins: [filtersMixin],

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

  head () {
    return {
      title: 'Resultats - En perill de destrucció - Quiz - Compromís'
    }
  },

  computed: {
    score () {
      return this.$store.state.score
    },

    summary () {
      return this.$store.state.summary
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
    },

    shareable () {
      const text = `He tret ${this.score} punts al mapa-quiz En Perill de Destrucció de Compromís. Pots superar-ho?`

      return {
        url: encodeURIComponent(url),
        text: encodeURIComponent(text),
        hashtag: 'EnPerillDeDestrucció'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~bootstrap/scss/_functions";
  @import "~bootstrap/scss/_variables";
  @import "~bootstrap/scss/_mixins";

  .results {
    max-width: 1600px;
    width: 100%;
    padding: 4vh 1rem;
    text-align: center;

    &-headline {
      line-height: .9;
      padding: 0;

      &-points {
        font-size: calc(5rem + 1vw);
      }

      &-label {
        display: block;
        font-family: $font-family-sans-serif;
        text-transform: capitalize;
        font-size: $text-base-fallback;
        font-size: $text-base;
      }
    }

    &-text {
      max-width: 60ch;
      font-size: $text-base-fallback;
      font-size: $text-base;
      margin: 3vh auto;
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
          height: 625px;
        }
      }
    }

    &-share {
      margin: 6vh 0;

      h2 {
        font-family: $font-family-sans-serif;
        text-transform: initial;
        font-size: $text-base-fallback;
        font-size: $text-base;
      }

      ul {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 2rem 0;
        padding: 0;
      }

      li {
        margin: 0 .5rem 1rem;
      }
    }
  }

  .replay {
    font-size: $text-lg-fallback;
    font-size: $text-lg;
  }

  @include media-breakpoint-down(md) {
    .results {
      &-headline {
        &-label {
          font-size: 1.5rem;
        }
      }

      &-summary {
        table {
          margin: 1.5rem auto;
        }

        th,
        &-distance {
          font-size: 1rem;
        }

        &-score span {
          font-size: 1.5rem;
        }
      }

      .cols {
        grid-template-columns: 1fr;

        .results-map-canvas {
          height: 35vh;
          border-width: 10px;
        }
      }
    }
  }
</style>
