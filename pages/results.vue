<template>
  <div class="page">
    <geo-nav />
    <div class="results">
      <h1 class="results-headline">
        <span class="results-headline-points">{{ score | formatNumber }}</span>
        <span v-t="'outofpoints'" class="results-headline-label" />
      </h1>
      <div class="results-text">
        <p v-if="score >= 3000" v-t="'exceptional'" />
        <p v-else-if="score >= 1000" v-t="'middleofroad'" />
        <p v-else v-t="'shamefuldisplay'" />
        <p v-html="$t('common')" />
      </div>
      <div class="cols">
        <div class="results-map">
          <gmap-map
            ref="map"
            class="results-map-canvas"
            :zoom="7.75"
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
                  {{ result.round[$i18n.locale].label }}
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
        <h2 v-html="$t('share')" />
        <ul>
          <li>
            <geo-button variant="twitter" :href="`https://twitter.com/intent/tweet/?text=${shareable.tweet}&url=${shareable.url}`" target="_blank">
              <icons-twitter /> Twitter
            </geo-button>
          </li>
          <li>
            <geo-button variant="facebook" :href="`https://www.facebook.com/sharer/sharer.php?u=${shareable.url}&quote=${shareable.text}`" target="_blank">
              <icons-facebook /> Facebook
            </geo-button>
          </li>
          <li>
            <geo-button variant="whatsapp" :href="`whatsapp://send?text=${shareable.text} ${shareable.url}`" target="_blank">
              <icons-whatsapp /> Whatsapp
            </geo-button>
          </li>
          <li>
            <geo-button variant="telegram" :href="`https://t.me/share/url?url=${shareable.url}&text=${shareable.text}`" target="_blank">
              <icons-telegram /> Telegram
            </geo-button>
          </li>
        </ul>
      </div>
      <geo-button :to="localePath('play')" variant="yellow" class="replay">
        <icons-replay /> {{ $t('replay') }}
      </geo-button>
    </div>
  </div>
</template>

<i18n lang="yaml">
ca:
  title: "Resultats - En perill de destrucció - Compromís"
  outofpoints: "de 4.000 punts"
  exceptional: "Enhorabona! Sens dubte et coneixes el territori pam a pam."
  middleofroad: >
    Molt bé! Encara que et queden per afinar alguns punts del mapa,
    pero es nota que coneixes el territori i els seus punts en perill.
  shamefuldisplay: >
    Més sort a la propera. T’has quedat lluny d’alguns punts, però tranquil,
    que de segur que en no res saps localitzar-los amb els ulls tancats.
  common: >
    <a href="https://sumat.compromis.net/?ref=geoguesspv" title="Suma't a Compromís">Comptem amb tu</a>
    per a ajudar-nos a protegir aquests espais davant l’especulació i els grans projectes
    faraònics, i continuar apostant per polítiques sostenibles amb les quals fer front al gran
    repte del segle XXI, l’emergència climàtica.
  share: "Comparteix la teua puntuació<br>i repta a les teues amistats"
  replay: "Torna a jugar"
  shareabletext: "🙌 He tret {score} punts al joc 🗺️ \"En Perill de Destrucció\" de Compromís. Pots superar-ho?"
  shareabletweet: "🙌 He tret {score} punts al joc 🗺️ #EnPerillDeDestrucció de @compromis. Pots superar-ho?"
es:
  title: "Resultados - En peligro de destrucción - Compromís"
  outofpoints: "de 4.000 puntos"
  exceptional: "¡Enhorabuena! Sin duda te conocer el territorio palmo a palmo."
  middleofroad: >
    ¡Muy bien! Aunque te quedan por afinar algunos puntos del mapa, se nota que conoces
    el territorio y sus puntos en peligro.
  shamefuldisplay: >
    Más suerte la próxima. Te has quedado lejos de algunos puntos,
    pero tranquilidad, que seguro que en nada sabes localizarlos con los ojos cerrados.
  common: >
    <a href="https://sumat.compromis.net/cas?ref=geoguesspv" title="Súmate a Compromís">Contamos contigo</a>
    para ayudarnos a proteger estos espacios ante la especulación y los grandes proyectos faraónicos,
    y seguir apostando por políticas sostenibles con las que hacer frente al gran reto del siglo XXI,
    la emergencia climática.
  share: "Comparte tu puntuación<br>y reta a tus amistades"
  replay: "Volver a jugar"
  shareabletext: "🙌 He sacado {score} puntos en el juego 🗺️ \"En Peligro de Destrucción\" de Compromís. ¿Puedes superarlo?"
  shareabletweet: "🙌 He sacado {score} puntos en el juego 🗺️ #EnPeligroDeDestrucción de @compromis. ¿Puedes superarlo?"
</i18n>

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
      title: this.$t('title')
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
      const { score } = this
      return {
        url: encodeURIComponent(url),
        text: encodeURIComponent(this.$t('shareabletext', { score })),
        tweet: encodeURIComponent(this.$t('shareabletweet', { score }))
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
        text-transform: initial;
        font-size: 1.5rem;
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
