<template>
  <div class="page">
    <div class="container">
      <template v-for="round in game">
        <guess-round
          v-if="currentRound === round.id"
          :key="round.id"
          :round="round"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    game () {
      return this.$store.state.game
    },
    currentRound () {
      return this.$store.state.round
    }
  },

  created () {
    this.$store.commit('reset')
  }
}
</script>

<style lang="scss" scoped>
  .page {
    padding: ($score-bar-height - 1rem) 1rem 0;
  }
</style>
