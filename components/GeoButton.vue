<template>
  <component :is="tag" :to="to" :class="['geo-button', variant]" @click="$emit('click', $event)">
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
    variant: {
      type: String,
      default: ''
    }
  },

  computed: {
    tag () {
      return this.to ? 'nuxt-link' : 'button'
    }
  }
}
</script>

<style lang="scss" scoped>
.geo-button {
  display: inline-block;
  outline: none;
  background: $green;
  border: 2px solid $black;
  padding: .5rem 1rem;
  font-size: 1.35rem;
  transition: .25s;
  color: $black;
  text-decoration: none;

  &:not(.disabled):hover {
    transform: rotate(-4deg) scale(1.05);
    box-shadow: $box-shadow;
  }

  &:not(.disabled):active {
    transform: rotate(2deg) scale(0.98);
    transition: .1s;
  }
}

.disabled {
  background: lightgray;
}

.yellow {
  background: $yellow;
}
</style>
