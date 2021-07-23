<template>
  <div class="home">
    <div class="container">
      <h1>
        En perill<br>de destrucció
      </h1>
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
      <p>
        Sabries indicar en el mapa on es troben aquests punts del nostre territori?
      </p>
      <p>
        Una pista: tots es troben en risc per culpa de l'especulació i les obres faraòniques depredadores i innecessàries.
      </p>
      <geo-button to="/play" class="play">
        Juga ->
      </geo-button>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'home'
}
</script>

<style lang="scss" scoped>
  .container {
    max-width: 1600px;
    width: 100%;
    padding: 0 1rem;
  }

  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    overflow-x: hidden;

    h1 {
      line-height: 1;
      font-size: calc(3.25rem + 3.75vw);
      font-size: clamp(4rem, 7vw, 9rem);
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
      margin: 3vh 0;
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
      max-width: 500px;
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
