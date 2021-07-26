export default {
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat('ca-ES').format(number)
    },

    inKm (value) {
      return value > 1000 ? (value / 1000).toFixed(0) + ' km' : value + ' m'
    }
  }
}
