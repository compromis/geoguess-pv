import game from '../content/game.js'

export const state = () => ({
  game,
  round: 1,
  finished: false,
  score: 0,
  history: []
})

export const mutations = {
  setRound (state, round) {
    if (round > state.game.length) {
      state.finished = true
    } else {
      state.round = round
    }
  },

  setFinished (state, finished) {
    state.finished = finished
  },

  addPoints (state, points) {
    state.score += points
  },

  recordResult (state, result) {
    state.history.push(result)
  }
}
