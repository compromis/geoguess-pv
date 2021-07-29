<template>
  <div class="geo-bar">
    <div
      class="fill"
      role="progressbar"
      :aria-valuenow="score"
      aria-valuemin="0"
      aria-valuemax="500"
      :style="{ width }"
    >
      <span />
    </div>
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
  margin: 1.25rem auto 0;

  .fill {
    span {
      display: flex;
      background: $black;
      height: 1rem;
      animation: fill 2s forwards;
    }
  }
}

@keyframes fill {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}
</style>
