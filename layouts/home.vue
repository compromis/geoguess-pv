<template>
  <div class="page">
    <div class="logo">
      <a href="https://compromis.net">
        <compromis-logo mono />
      </a>
      <p>
        <a href="https://compromis.net/campanyes">Quiz</a>
      </p>
    </div>
    <Nuxt />
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";
@import "~bootstrap/scss/_mixins";

.page {
  background: $yellow;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $nav-bar-height 0;
}

.logo {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: $nav-bar-height;
  padding: 0 1rem;

  a {
    color: $black;
  }

  svg {
    height: 2rem;
  }

  p {
    margin-left: auto;
    font-size: 1.25rem;
    margin-bottom: 0;
  }
}

@include media-breakpoint-down(md) {
  .logo {
    background: $yellow;
  }
}
</style>
