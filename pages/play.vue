<template>
  <div class="game">
    <template v-for="round in game">
      <guess-round
        v-if="currentRound === round.id"
        :key="round.id"
        :round="round"
      />
    </template>
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
  }
}
</script>

<style lang="scss" scoped>

</style>
