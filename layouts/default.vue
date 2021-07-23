<template>
  <div class="page">
    <div class="container">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.page {
  background: $yellow;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $score-bar-height 1rem;
}

.container {
  max-width: 1600px;
  width: 100%;
}
</style>
