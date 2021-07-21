<template>
  <div class="geo-bar">
    <div
      class="fill"
      role="progressbar"
      :aria-valuenow="score"
      aria-valuemin="0"
      aria-valuemax="500"
      :style="{ width }"
    />
  </div>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      default: 0
    }
  },

  computed: {
    width () {
      const width = this.score * 100 / 500
      return width + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.geo-bar {
  border: 1px $black solid;
  width: 100%;
  max-width: 320px;
  border-radius: 2rem;
  overflow: hidden;
  margin: 1.25rem;

  .fill {
    background: $black;
    height: 1rem;
  }
}
</style>
