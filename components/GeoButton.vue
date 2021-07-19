<template>
  <button :class="{'yellow' : variant === 'yellow', 'disabled' : variant === 'disabled'}">
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
@import '../assets/scss/variables.scss';

button {
  outline: none;
  background: $green;
  border: 2px solid $black;
  padding: .5rem 1rem;
  font-size: 1.35rem;
  transition: .25s;

  &:hover {
    transform: rotate(-6deg) scale(1.05);
    box-shadow: 5px 5px 20px 3px rgba($black, .25);
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
