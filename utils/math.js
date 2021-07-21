function calculateDistance ({ lat1, lat2, lon1, lon2 }) {
  // Source: https://www.movable-type.co.uk/scripts/latlong.html
  const R = 6371e3 // metres
  const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return Math.round(d)
}

function calculateScore (distance) {
  const maxScore = 500
  const minScore = 0
  const maxDistance = 50000
  const score = Math.round(maxScore + (distance - 1) * ((minScore - maxScore) / (maxDistance - 1)))
  return score > 0 ? score : 0
}

export { calculateDistance, calculateScore }
