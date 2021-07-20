<template>
  <button :class="['geo-button', variant]" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  outline: none;
  background: $green;
  border: 2px solid $black;
  padding: .5rem 1rem;
  font-size: 1.35rem;
  transition: .25s;

  &:hover {
    transform: rotate(-6deg) scale(1.05);
    box-shadow: $box-shadow;
  }

  &:active {
    transform: rotate(4deg) scale(0.98);
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
