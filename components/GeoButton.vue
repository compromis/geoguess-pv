<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    v-bind="$attrs"
    :class="['geo-button', variant]"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: ''
    }
  },

  computed: {
    tag () {
      return this.to ? 'nuxt-link' : this.href ? 'a' : 'button'
    }
  }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";
@import "~bootstrap/scss/_mixins";

.geo-button {
  display: inline-flex;
  outline: none;
  background: $green;
  border: 2px solid $black;
  padding: .5rem 1.25rem;
  font-size: 1.35rem;
  transition: .25s;
  color: $black;
  text-decoration: none;
  align-items: center;
  justify-content: center;

  &:not(.disabled):hover {
    transform: rotate(-3deg) scale(1.05);
    box-shadow: $box-shadow;
    color: $black;
  }

  &:not(.disabled):active {
    transform: rotate(1.5deg) scale(0.98);
    transition: .1s;
  }

  &.disabled {
    background: lightgray;
  }

  &.yellow {
    background: $yellow;
  }

  &.twitter {
    background: #1DA1F2;
    color: $white !important;
  }

  &.facebook {
    background: #1778F2;
    color: $white !important;
  }

  &.whatsapp {
    background: #25D366;
    color: $white !important;
  }

  &.telegram {
    background: #0088cc;
    color: $white !important;
  }

  svg {
    width: 1em;
    height: 1em;
    margin-right: .5em;
  }
}

@include media-breakpoint-down(md) {
  .geo-button:not(.disabled) {
    &:hover,
    &:active {
      transform: rotate(0) scale(1);
    }
  }
}
</style>
