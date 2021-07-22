<template>
  <div class="page">
    <div class="logo">
      <a href="https://compromis.net">
        <compromis-logo mono />
      </a>
      <p>
        <a href="https://compromis.net/campanyes">Quiz</a>
      </p>
    </div>
    <Nuxt />
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.logo {
  position: fixed;
  display: flex;
  align-items: center;
  top: 1rem;
  left: 1rem;
  right: 1rem;

  a {
    color: $black;
  }

  svg {
    height: 2.25rem;
  }

  p {
    margin-left: auto;
    font-size: 1.5rem;
  }
}
</style>
