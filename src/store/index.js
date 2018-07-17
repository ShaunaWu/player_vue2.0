/**
 * Created by Shaun on 2018/5/14.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 线下调试开启debug，debug为true
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  // log一些日志，包括prev state和next state等
  plugins: debug ? [createLogger()] : []
})
