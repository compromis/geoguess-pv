<template>
  <div class="page">
    <geo-nav />
    <div class="home">
      <div class="container">
        <h1 v-html="$t('headline')" />
      </div>
      <div class="images" aria-hidden="true">
        <img class="image-1" src="~/assets/images/1.jpg" alt="">
        <img class="image-2" src="~/assets/images/2.jpg" alt="">
        <img class="image-3" src="~/assets/images/3.jpg" alt="">
        <img class="image-4" src="~/assets/images/4.jpg" alt="">
        <img class="image-5" src="~/assets/images/5.jpg" alt="">
        <img class="image-6" src="~/assets/images/6.jpg" alt="">
        <img class="image-7" src="~/assets/images/1.jpg" alt="">
        <img class="image-8" src="~/assets/images/2.jpg" alt="">
      </div>
      <div class="container">
        <p v-t="'text1'" />
        <p v-t="'text2'" />
        <geo-button v-t="'play'" :to="localePath('play')" class="play" />
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
ca:
  title: "Joc: En perill de destrucció - Compromís"
  headline: "En perill<br>de destrucció"
  text1: "Sabries indicar en el mapa on es troben aquests punts del nostre territori?"
  text2: >
    Una pista: tots es troben en risc per culpa de l'especulació, les obres faraòniques
    i innecessàries o per la negativa del govern central a donar solucions sostenibles
    i respectuoses amb l’entorn.
  play: "Juga ->"
es:
  title: "Juego: En peligro de destrucción - Compromís"
  headline: "En peligro<br>de destrucción"
  text1: "¿Sabrías indicar en el mapa dónde se encuentran estos puntos de nuestro territorio?"
  text2: >
    Una pista: todos se encuentran en riesgo por culpa de la especulación, las obras faraónicas
    e innecesarias o por la negativa del gobierno central a dar soluciones sostenibles
    y respetuosas con el entorno.
  play: "Jugar ->"
</i18n>

<script>
export default {
  head () {
    return {
      title: this.$t('title')
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 0 1rem;
  }

  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    overflow-x: hidden;
    margin-bottom: -5rem;

    h1 {
      line-height: 1;
      font-size: calc(3.25rem + 3.75vw);
      font-size: clamp(4rem, 6.5vw, 9rem);
      margin-bottom: -2vh;
    }

    p {
      font-size: $text-base-fallback;
      font-size: $text-base;
      max-width: 60ch;
      margin: 1rem auto;
      line-height: 1.25;
    }

    .play {
      margin: 1rem 0 3rem;
      font-size: $text-lg-fallback;
      font-size: $text-lg;
      width: 100%;
      max-width: 350px;
    }
  }

  .images {
    display: flex;
    overflow-x: hidden;
    padding: 4vh 0;

    img {
      border: calc(2px + .4vw) $white solid;
      box-shadow: $box-shadow-sm;
      margin: 0;
      width: 30vw;
      max-width: 350px;
      max-height: 25vh;
      object-fit: cover;
    }

    .image-1 {
      transform: rotate(-2deg);
    }

    .image-2 {
      transform: rotate(3deg);
    }

    .image-3 {
      transform: rotate(-1deg);
    }

    .image-4 {
      transform: rotate(2deg);
    }

    .image-5 {
      transform: rotate(-4deg);
    }

    .image-6 {
      transform: rotate(2deg);
    }
  }
</style>
