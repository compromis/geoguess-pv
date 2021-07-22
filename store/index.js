import game from '../content/game.js'

export const state = () => ({
  game,
  round: 1,
  score: 0,
  summary: []
})

export const mutations = {
  nextRound (state) {
    state.round++
  },

  addPoints (state, points) {
    state.score += points
  },

  recordResult (state, result) {
    state.summary.push(result)
  },

  reset (state) {
    state.round = 1
    state.score = 0
    state.summary = []
  }
}
