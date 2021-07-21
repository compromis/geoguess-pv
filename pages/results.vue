<template>
  <div class="results">
    <h1>
      Resultats
    </h1>
    {{ score }}
    <pre>
      {{ summary }}
    </pre>
    <geo-button>
      Començar el test ->
    </geo-button>
  </div>
</template>

<script>
export default {
  computed: {
    score () {
      return this.$store.state.score
    },

    summary () {
      return this.$store.state.summary
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
