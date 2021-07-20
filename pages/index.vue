<template>
  <div class="page">
    <div class="container">
      <welcome-screen v-if="currentRound === 0" />
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
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: $yellow;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 1rem;
}

.container {
  max-width: 1400px;
  width: 100%;
}
</style>
