export const state = () => ({
  step: 0,
  finished: false,
  points: 0,
  history: []
})

export const mutations = {
  setStep (state, step) {
    state.step = step
  },

  setFinished (state, finished) {
    state.finished = finished
  },

  addPoints (state, points) {
    state.points += points
  },

  recordResult (state, result) {
    state.history.push(result)
  }
}
