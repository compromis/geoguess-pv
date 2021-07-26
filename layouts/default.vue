<template>
  <Nuxt />
</template>

<script>
export default {
  mounted () {
    this.setVh()
    window.addEventListener('resize', this.setVh)
  },

  methods: {
    setVh () {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
  }
}
</script>
