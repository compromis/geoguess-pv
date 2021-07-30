import game from '../content/game'
import http from '../utils/http'

export const state = () => ({
  id: null,
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

  assignId (state, id) {
    state.id = id
  },

  reset (state) {
    state.id = null
    state.round = 1
    state.score = 0
    state.summary = []
  }
}

export const actions = {
  async save ({ commit, state }, result) {
    commit('addPoints', result.score)
    commit('recordResult', result)

    if (!state.id) {
      commit('assignId', Math.random())
    }

    await http.save({
      id: state.id,
      round: state.round,
      total: state.score,
      score: result.score,
      guess: result.guess,
      distance: result.distance
    })
  }
}
