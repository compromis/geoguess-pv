<template>
  <div class="logo">
    <transition name="fade" mode="out-in">
      <a v-if="showLogo" href="https://compromis.net" class="compromis" aria-label="Compromís">
        <compromis-logo mono />
      </a>
      <nuxt-link v-else v-t="'title'" :to="localePath('/')" class="site-name" />
    </transition>
    <div class="quiz">
      <nuxt-link v-if="$i18n.locale === 'ca'" :to="switchLocalePath('es')">
        Castellano
      </nuxt-link>
      <nuxt-link v-else :to="switchLocalePath('ca')">
        Valencià
      </nuxt-link>
    </div>
  </div>
</template>

<i18n lang="yaml">
ca:
  title: "En perill de destrucció"
es:
  title: "En peligro de destrucción"
</i18n>

<script>
export default {
  data () {
    return {
      showLogo: true
    }
  },

  mounted () {
    window.addEventListener('scroll', this.toggleLogo)
  },

  destroyed () {
    window.removeEventListener('scroll', this.toggleLogo)
  },

  methods: {
    toggleLogo () {
      this.showLogo = window.scrollY < 100
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";
@import "~bootstrap/scss/_mixins";

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

  .compromis svg {
    height: 2rem;
  }

  .site-name {
    font-family: $headings-font-family;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 1.75rem;
    line-height: 1;
  }

  .quiz {
    margin-left: auto;
    font-size: 1.25rem;
  }
}

@include media-breakpoint-down(md) {
  .logo {
    background: $yellow;

    svg {
      height: 1.5rem;
    }
  }
}
</style>
