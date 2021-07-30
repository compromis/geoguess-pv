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

<i18n lang="yaml">
ca:
  title: "Joc: En perill de destrucció - Compromís"
es:
  title: "Juego: En peligro de destrucción - Compromís"
</i18n>

<script>
export default {
  head () {
    return {
      title: this.$t('title')
    }
  }
}
</script>

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
